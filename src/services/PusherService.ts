import LaravelEcho from 'laravel-echo';
import Pusher from 'pusher-js';
import useUserStore from '@/store/userStore';

// Define proper types for Pusher and Echo
interface PusherConnection {
    state: string;
    bind: (event: string, callback: (data?: unknown) => void) => void;
    unbind: (event: string, callback?: (data?: unknown) => void) => void;
}

interface PusherInstance {
    connection: PusherConnection;
    disconnect: () => void;
}

export interface EchoChannel {
    listen: <T>(event: string, callback: (data: T) => void) => EchoChannel;
    stopListening: (event: string) => EchoChannel;
    unsubscribe: () => void;
    name?: string;
}

interface EchoConnector {
    pusher: PusherInstance;
}

export interface EchoInstance {
    connector: EchoConnector;
    private: (channel: string) => EchoChannel;
    channel: (channel: string) => EchoChannel | null;
    leave: (channel: string) => void;
    disconnect: () => void;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

// Callback signature for connection state changes
type ConnectionCallback = (status: ConnectionStatus, error?: string) => void;


class PusherService {
    private static instance: PusherService;
    private echo: EchoInstance | null = null;
    private channels: Map<string, EchoChannel> = new Map();
    private connectionCallbacks: Set<ConnectionCallback> = new Set();
    private connectionStatus: ConnectionStatus = 'disconnected';
    private connectionError: string | null = null;
    private reconnectTimeout: number | null = null;
    private isConnecting = false;

    private constructor() {
        // Private constructor to enforce singleton pattern
    }

    public static getInstance(): PusherService {
        if (!PusherService.instance) {
            PusherService.instance = new PusherService();
        }
        return PusherService.instance;
    }

    /**
     * Connect to Pusher
     */
    public connect(): void {
        if (this.echo || this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        this.updateConnectionStatus('connecting');

        const token = useUserStore.getState().token;

        if (!token) {
            this.updateConnectionStatus('disconnected', 'No authentication token available');
            this.isConnecting = false;
            return;
        }

        try {
            // Set up Pusher globally using type assertions without modifying Window interface
            (window as any).Pusher = Pusher;

            // Configure Echo with proper auth endpoint
            const echoInstance = new LaravelEcho({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY,
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
                forceTLS: true,
                // Ensure the full URL with base path is provided for auth endpoint
                authEndpoint: `${import.meta.env.VITE_API_URL}/api/v1/broadcasting/auth`,
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                },
                // Pusher-specific configurations for better reliability
                pusherOptions: {
                    timeout: 20000, // 20 second connection timeout
                    pongTimeout: 15000, // Wait 15 seconds for a pong response
                    unavailableTimeout: 30000, // Time to wait if no connection is available
                    activityTimeout: 300000 // How long before considering the connection idle (5 minutes)
                }
            });

            this.echo = echoInstance as EchoInstance;

            // Store Echo instance globally using type assertion
            (window as any).Echo = this.echo;

            if (this.echo.connector.pusher) {
                // Log the connection attempt
                console.log('PusherService: Connecting to Pusher...', {
                    key: import.meta.env.VITE_PUSHER_APP_KEY,
                    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
                    authEndpoint: `${import.meta.env.VITE_API_URL}/api/v1/broadcasting/auth`
                });

                // Set up connection event handlers
                this.echo.connector.pusher.connection.bind('connected', () => {
                    console.log('PusherService: Connected successfully');
                    this.updateConnectionStatus('connected');
                    this.isConnecting = false;
                });

                this.echo.connector.pusher.connection.bind('disconnected', () => {
                    console.log('PusherService: Disconnected');
                    this.updateConnectionStatus('disconnected');
                    this.isConnecting = false;
                    this.scheduleReconnect();
                });

                this.echo.connector.pusher.connection.bind('error', (err: unknown) => {
                    console.error('PusherService: Connection error:', err);
                    this.updateConnectionStatus('disconnected', `Connection error: ${String(err)}`);
                    this.isConnecting = false;
                    this.scheduleReconnect();
                });

                // If already connected, manually update the state
                if (this.echo.connector.pusher.connection.state === 'connected') {
                    console.log('PusherService: Already connected');
                    this.updateConnectionStatus('connected');
                    this.isConnecting = false;
                }
            }
        } catch (err) {
            console.error('PusherService: Error setting up Echo/Pusher:', err);
            this.updateConnectionStatus('disconnected', `Connection setup failed: ${(err instanceof Error) ? err.message : String(err)}`);
            this.isConnecting = false;
            this.scheduleReconnect();
        }
    }

    /**
     * Disconnect from Pusher
     */
    public disconnect(): void {
        if (this.reconnectTimeout) {
            window.clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        // Unsubscribe from all channels first
        this.channels.forEach((channel, name) => {
            try {
                channel.unsubscribe();
            } catch (err) {
                console.error(`PusherService: Error unsubscribing from channel ${name}:`, err);
            }
        });

        this.channels.clear();

        // Then disconnect Echo
        if (this.echo) {
            try {
                this.echo.disconnect();
            } catch (err) {
                console.error('PusherService: Error disconnecting Echo:', err);
            }

            this.echo = null;
        }

        this.updateConnectionStatus('disconnected');
    }

    /**
     * Subscribe to a private channel
     * @param channelName Channel name without "private-" prefix
     * @param events Map of event names to event handlers
     * @returns void
     */
    public subscribeToPrivateChannel<T>(
        channelName: string,
        events: Record<string, (data: T) => void>
    ): void {
        if (!this.echo) {
            this.updateConnectionStatus('disconnected', 'Not connected to Pusher');
            return;
        }

        try {
            console.log(`PusherService: Subscribing to private channel ${channelName}`);
            const channel = this.echo.private(channelName);

            // Register event listeners
            Object.entries(events).forEach(([event, callback]) => {
                console.log(`PusherService: Listening to event ${event} on channel ${channelName}`);
                channel.listen(event, callback);
            });

            this.channels.set(channelName, channel);
        } catch (err) {
            console.error(`PusherService: Error subscribing to channel ${channelName}:`, err);
        }
    }

    /**
     * Unsubscribe from a private channel
     * @param channelName Channel name without "private-" prefix
     */
    public unsubscribeFromChannel(channelName: string): void {
        if (this.channels.has(channelName)) {
            const channel = this.channels.get(channelName)!;

            try {
                channel.unsubscribe();
                this.channels.delete(channelName);
                console.log(`PusherService: Unsubscribed from channel ${channelName}`);
            } catch (err) {
                console.error(`PusherService: Error unsubscribing from channel ${channelName}:`, err);
            }
        }
    }


    public onConnectionChange(callback: ConnectionCallback): () => void {
        this.connectionCallbacks.add(callback);

        // Immediately notify of current state
        callback(this.connectionStatus, this.connectionError || undefined);

        // Return unsubscribe function
        return () => {
            this.connectionCallbacks.delete(callback);
        };
    }

    /**
     * Update connection status and notify listeners
     */
    private updateConnectionStatus(status: ConnectionStatus, error?: string): void {
        this.connectionStatus = status;
        this.connectionError = error || null;

        this.connectionCallbacks.forEach(callback => {
            callback(status, error);
        });
    }

    /**
     * Schedule a reconnection attempt
     */
    private scheduleReconnect(): void {
        if (this.reconnectTimeout) {
            window.clearTimeout(this.reconnectTimeout);
        }

        this.updateConnectionStatus('reconnecting');

        this.reconnectTimeout = window.setTimeout(() => {
            // Ensure we have a fresh token before reconnecting
            const token = useUserStore.getState().token;
            if (token) {
                console.log('PusherService: Attempting reconnection...');
                this.connect();
            } else {
                console.log('PusherService: No token available for reconnection, delaying...');
                // Try again in a bit
                this.scheduleReconnect();
            }
        }, 5000); // Fixed 5 second reconnect delay
    }

    /**
     * Get current connection status
     */
    public getConnectionStatus(): { status: ConnectionStatus; error: string | null } {
        return {
            status: this.connectionStatus,
            error: this.connectionError
        };
    }
}

export default PusherService;

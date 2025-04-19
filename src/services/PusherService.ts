import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import useUserStore from '@/store/userStore';

// Type definitions
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'failed';
type ConnectionCallback = (status: ConnectionStatus, error?: string) => void;

class PusherService {
    private static instance: PusherService;
    private echo: Echo<'pusher'> | null = null;
    private status: ConnectionStatus = 'disconnected';
    private connectionCallbacks: ConnectionCallback[] = [];
    private connectionAttempts: number = 0;
    private maxConnectionAttempts: number = 5;
    private reconnectTimeout: number | null = null;
    private channels: Set<string> = new Set();

    // Private constructor ensures singleton pattern
    private constructor() {}

    /**
     * Get the singleton instance
     */
    public static getInstance(): PusherService {
        if (!PusherService.instance) {
            PusherService.instance = new PusherService();
        }
        return PusherService.instance;
    }

    public onConnectionChange(callback: ConnectionCallback): () => void {
        this.connectionCallbacks.push(callback);

        // Immediately notify of current status
        callback(this.status);

        // Return unsubscribe function
        return () => {
            this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
        };
    }


    private updateStatus(status: ConnectionStatus, error?: string): void {
        this.status = status;
        this.connectionCallbacks.forEach(callback => callback(status, error));
    }

    public connect(): void {
        // Don't attempt to connect if already connecting or connected
        if (this.status === 'connecting' || this.status === 'connected') {
            return;
        }

        // Clear any pending reconnect timeouts
        if (this.reconnectTimeout !== null) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        this.updateStatus('connecting');

        try {
            // Get auth token from user store
            const token = useUserStore.getState().token;

            if (!token) {
                this.updateStatus('failed', 'Authentication token not available');
                return;
            }

            // Initialize Echo with Pusher
            this.echo = new Echo({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY || '',
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
                wsHost: import.meta.env.VITE_PUSHER_HOST,
                wsPort: import.meta.env.VITE_PUSHER_PORT ? parseInt(import.meta.env.VITE_PUSHER_PORT) : 6001,
                wssPort: import.meta.env.VITE_PUSHER_PORT ? parseInt(import.meta.env.VITE_PUSHER_PORT) : 6001,
                forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
                disableStats: true,
                enabledTransports: ['ws', 'wss'],
                authEndpoint: '/api/v1/broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                },
            });

            // Set up connection event handlers on the underlying Pusher instance
            if (this.echo.connector && this.echo.connector.pusher) {
                const pusher = this.echo.connector.pusher as Pusher;

                // Connection established successfully
                pusher.connection.bind('connected', () => {
                    console.log('Pusher connection established');
                    this.connectionAttempts = 0;
                    this.updateStatus('connected');
                });

                // Connection disconnected
                pusher.connection.bind('disconnected', () => {
                    console.log('Pusher disconnected');
                    this.updateStatus('disconnected');
                });

                // Connection failed
                pusher.connection.bind('failed', () => {
                    console.error('Pusher connection failed');
                    this.handleConnectionFailure();
                });

                // Additional error handling
                pusher.connection.bind('error', (error: Error | undefined) => {
                    console.error('Pusher connection error:', error);
                    this.handleConnectionFailure(error?.message || 'Connection error');
                });
            }
        } catch (error) {
            console.error('Failed to initialize Pusher connection:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to initialize connection';
            this.handleConnectionFailure(errorMessage);
        }
    }

    /**
     * Handle connection failures with exponential backoff retry logic
     */
    private handleConnectionFailure(errorMessage?: string): void {
        this.connectionAttempts++;

        if (this.connectionAttempts <= this.maxConnectionAttempts) {
            // Exponential backoff with max 30s
            const delay = Math.min(1000 * Math.pow(2, this.connectionAttempts), 30000);

            this.updateStatus(
                'failed',
                `Connection attempt ${this.connectionAttempts} failed. Retrying in ${delay/1000}s...`
            );

            // Schedule reconnection attempt
            this.reconnectTimeout = window.setTimeout(() => {
                this.reconnectTimeout = null;
                this.connect();
            }, delay);
        } else {
            // Max retries reached
            this.updateStatus('failed', errorMessage || 'Maximum connection attempts reached');
        }
    }

    /**
     * Disconnect from Pusher
     * Cleans up all connections and subscriptions
     */
    public disconnect(): void {
        if (this.echo?.connector?.pusher) {
            const pusher = this.echo.connector.pusher as Pusher;

            // Clear all subscriptions
            this.channels.clear();

            // Disconnect the underlying Pusher connection
            pusher.disconnect();
        }

        this.echo = null;
        this.updateStatus('disconnected');

        // Clear any pending reconnects
        if (this.reconnectTimeout !== null) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    /**
     * Subscribe to a private channel
     * Automatically handles channel prefix and registration
     */
    public subscribeToPrivateChannel<T = unknown>(
        channelName: string,
        events: Record<string, (data: T) => void>
    ): void {
        if (!this.echo) {
            console.warn(`Cannot subscribe to channel ${channelName} - Echo not initialized`);
            return;
        }

        try {
            // Save channel name for potential reconnects
            this.channels.add(channelName);

            // Create channel subscription
            const channel = this.echo.private(channelName);

            // Register all event handlers
            Object.entries(events).forEach(([event, callback]) => {
                // Remove the type parameter and use the callback directly
                // This assumes the listen method will handle the data correctly
                channel.listen(event, callback as (data: unknown) => void);
            });

            console.log(`Subscribed to channel: ${channelName}`);
        } catch (error) {
            console.error(`Failed to subscribe to channel ${channelName}:`, error);
        }
    }

    /**
     * Unsubscribe from a channel
     */
    public unsubscribeFromChannel(channelName: string): void {
        if (!this.echo) return;

        try {
            // Remove from tracked channels
            this.channels.delete(channelName);

            // Leave the channel
            this.echo.leave(channelName);
            console.log(`Unsubscribed from channel: ${channelName}`);
        } catch (error) {
            console.error(`Failed to unsubscribe from channel ${channelName}:`, error);
        }
    }

    /**
     * Get the connection status
     */
    public getStatus(): ConnectionStatus {
        return this.status;
    }
}

export default PusherService;

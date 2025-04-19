import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import axiosInstance from '@/lib/axios';
import type { BroadcastDriver } from 'laravel-echo';

// Connection status types
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'failed';
export type ConnectionChangeListener = (status: ConnectionStatus, error?: string) => void;

// Global Pusher
window.Pusher = Pusher;

/**
 * Simple singleton service to maintain a Laravel Echo connection
 */
class PusherService {
    private static instance: PusherService;
    private echo: Echo<BroadcastDriver> | null = null;
    private status: ConnectionStatus = 'disconnected';
    private error: string | null = null;
    private listeners: ConnectionChangeListener[] = [];

    private constructor() {}

    public static getInstance(): PusherService {
        if (!PusherService.instance) {
            PusherService.instance = new PusherService();
        }
        return PusherService.instance;
    }

    public connect(): void {
        if (this.echo || this.status === 'connecting') return;
        this.setStatus('connecting');

        try {
            // Create Echo instance
            this.echo = new Echo({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY,
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
                forceTLS: true,
                authorizer: (channel: { name: string }) => {
                    return {
                        authorize: (socketId: string, callback: (error: boolean, response: unknown) => void) => {
                            axiosInstance
                                .post('/broadcasting/auth', {
                                    socket_id: socketId,
                                    channel_name: channel.name,
                                })
                                .then((response) => {
                                    callback(false, response.data);
                                })
                                .catch((error) => {
                                    callback(true, error);
                                });
                        },
                    };
                },
            });

            this.setStatus('connected');
        } catch (err) {
            this.setStatus('failed', err instanceof Error ? err.message : 'Connection failed');
        }
    }

    public disconnect(): void {
        if (!this.echo) return;
        this.echo.disconnect();
        this.echo = null;
        this.setStatus('disconnected');
    }

    // Subscribe to a private channel
    public subscribeToPrivateChannel<T>(
        channelName: string,
        events: Record<string, (data: T) => void>
    ): void {
        if (!this.echo) this.connect();
        if (!this.echo) return;

        const normalizedName = channelName.replace(/^private-/, '');
        const channel = this.echo.private(normalizedName);

        Object.entries(events).forEach(([event, callback]) => {
            channel.listen(event, callback);
        });
    }

    // Subscribe to a public channel
    public subscribeToChannel<T>(
        channelName: string,
        events: Record<string, (data: T) => void>
    ): void {
        if (!this.echo) this.connect();
        if (!this.echo) return;

        const channel = this.echo.channel(channelName);

        Object.entries(events).forEach(([event, callback]) => {
            channel.listen(event, callback);
        });
    }

    // Unsubscribe from a channel
    public unsubscribeFromChannel(channelName: string): void {
        if (!this.echo) return;
        this.echo.leave(channelName);
    }

    // Register for connection status changes
    public onConnectionChange(listener: ConnectionChangeListener): () => void {
        this.listeners.push(listener);
        listener(this.status, this.error || undefined);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Get current status
    public getStatus(): ConnectionStatus {
        return this.status;
    }

    // Get current error if any
    public getError(): string | null {
        return this.error;
    }

    // Update status and notify listeners
    private setStatus(status: ConnectionStatus, error?: string): void {
        this.status = status;
        this.error = error || null;
        this.listeners.forEach(listener => listener(status, error));
    }
}

// Type declaration for global Pusher
declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

export default PusherService;

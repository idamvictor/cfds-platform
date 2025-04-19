import { useState, useEffect, useCallback } from 'react';
import PusherService, { ConnectionStatus } from '@/services/PusherService';


export function usePusher() {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [error, setError] = useState<string | null>(null);

    // Get the singleton instance
    const pusherService = PusherService.getInstance();

    // Connect to Pusher
    useEffect(() => {
        // Setup connection status listener
        const unsubscribe = pusherService.onConnectionChange((status, err) => {
            setConnectionStatus(status);
            setError(err || null);
        });

        // Initialize connection
        pusherService.connect();

        // Cleanup on unmount
        return () => {
            unsubscribe();
            // We don't disconnect here as other components might be using the connection
        };
    }, []);

    const subscribeToPrivateChannel = useCallback(<T>(
        channelName: string,
        events: Record<string, (data: T) => void>
    ): void => {
        pusherService.subscribeToPrivateChannel<T>(channelName, events);
    }, []);


    const unsubscribeFromChannel = useCallback((channelName: string): void => {
        pusherService.unsubscribeFromChannel(channelName);
    }, []);

    const reconnect = useCallback((): void => {
        pusherService.disconnect();
        pusherService.connect();
    }, []);

    return {
        connectionStatus,
        error,
        subscribeToPrivateChannel,
        unsubscribeFromChannel,
        reconnect
    };
}

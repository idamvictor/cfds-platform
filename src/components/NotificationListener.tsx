import { useEffect, useRef, useCallback } from 'react';
import { usePusher } from '@/hooks/usePusher';
import useUserStore from '@/store/userStore';
import { toast } from 'sonner';

interface NotificationData {
    id: string;
    type: string;
    message: string;
    data?: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

// Define user update data structure
interface UserUpdateData {
    id: string;
    type: string;
    data: Record<string, unknown>;
}

export function NotificationListener() {
    const { subscribeToPrivateChannel, unsubscribeFromChannel, connectionStatus } = usePusher();
    const userId = useUserStore(state => state.user?.id);
    const getCurrentUser = useUserStore(state => state.getCurrentUser);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    const channelsSubscribed = useRef<{
        notifications: boolean;
        userUpdates: boolean;
    }>({
        notifications: false,
        userUpdates: false
    });

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('/sounds/notification.mp3');

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleNotification = useCallback((data: NotificationData) => {
        // Play notification sound
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => {
                console.error('Failed to play notification sound:', err);
            });
        }

        // Show toast notification
        toast(data.message, {
            description: data.data?.description as string,
            // Include action if action URL is available
            action: data.data?.action_url ? {
                label: 'View',
                onClick: () => window.open(data.data?.action_url as string, '_blank')
            } : undefined
        });

        // Refresh user data
        getCurrentUser();
    }, [getCurrentUser]);

    // Create a stable reference to the user update handler
    const handleUserUpdate = useCallback(() => {
        console.log('User data updated, refreshing...');
        getCurrentUser();
    }, [getCurrentUser]);

    // Manage subscriptions based on connection status and user ID
    useEffect(() => {
        // Only proceed if we're connected and have a user ID
        if (connectionStatus !== 'connected' || !userId) {
            return;
        }

        // Subscribe to notifications channel if not already subscribed
        if (!channelsSubscribed.current.notifications) {
            subscribeToPrivateChannel<NotificationData>(
                `notifications.${userId}`,
                { '.new-notification': handleNotification }
            );
            channelsSubscribed.current.notifications = true;
        }

        // Subscribe to user updates channel if not already subscribed
        if (!channelsSubscribed.current.userUpdates) {
            subscribeToPrivateChannel<UserUpdateData>(
                `user.${userId}`,
                { '.user.updated': handleUserUpdate }
            );
            channelsSubscribed.current.userUpdates = true;
        }

        // Cleanup function to unsubscribe when component unmounts or user changes
        return () => {
            if (channelsSubscribed.current.notifications) {
                unsubscribeFromChannel(`notifications.${userId}`);
                channelsSubscribed.current.notifications = false;
            }

            if (channelsSubscribed.current.userUpdates) {
                unsubscribeFromChannel(`user.${userId}`);
                channelsSubscribed.current.userUpdates = false;
            }
        };
    }, [
        connectionStatus,
        userId,
        subscribeToPrivateChannel,
        unsubscribeFromChannel,
        handleNotification,
        handleUserUpdate
    ]);

    // This component doesn't render anything
    return null;
}

export default NotificationListener;

import { useEffect, useRef } from 'react';
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
    const { subscribeToPrivateChannel, connectionStatus } = usePusher();
    const { user, getCurrentUser } = useUserStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/notification.mp3');

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playNotificationSound = () => {
        if (audioRef.current) {
            // Reset the audio to the beginning
            audioRef.current.currentTime = 0;

            // Play the sound
            audioRef.current.play().catch(err => {
                console.error('Failed to play notification sound:', err);
            });
        }
    };

    useEffect(() => {
        if (connectionStatus === 'connected' && user) {
            // Subscribe to user notifications channel
            subscribeToPrivateChannel<NotificationData>(
                `notifications.${user.id}`,
                {
                    '.new-notification': (data) => {
                        // Play notification sound
                        playNotificationSound();

                        // Show toast notification
                        toast(data.message, {
                            description: data.data?.description as string,
                            // Include action if action URL is available
                            action: data.data?.action_url ? {
                                label: 'View',
                                onClick: () => window.open(data?.data?.action_url as string, '_blank')
                            } : undefined
                        });

                        // Refetch current user to get updated data
                        getCurrentUser();
                    }
                }
            );

            subscribeToPrivateChannel<UserUpdateData>(
                `user.${user.id}`,
                {
                    '.user.updated': () => {
                        console.log('hello', 'user updated');
                        // Refetch current user to get updated data
                        getCurrentUser();
                    }
                }
            );
        }
    }, [connectionStatus, user, subscribeToPrivateChannel, getCurrentUser]);

    return null;
}

export default NotificationListener;

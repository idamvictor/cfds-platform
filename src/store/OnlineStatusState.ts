import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import useUserStore from "@/store/userStore";

interface OnlineStatus {
    [userId: string]: {
        lastSeen: string;
    };
}

interface OnlineStatusState {
    onlineUsers: OnlineStatus;
    setUserOnline: (userId: string) => void;
    startHeartbeat: () => void;
    stopHeartbeat: () => void;
    isUserOnline: (userId?: string) => boolean;
}

// Consider user online if active in last 2 minutes
const ONLINE_THRESHOLD_MS = 2 * 60 * 1000;

const useOnlineStatusStore = create<OnlineStatusState>((set, get) => {
    let heartbeatInterval: number | null = null;

    return {
        onlineUsers: {},

        setUserOnline: (userId: string) => {
            set((state) => ({
                onlineUsers: {
                    ...state.onlineUsers,
                    [userId]: {
                        lastSeen: new Date().toISOString()
                    }
                }
            }));
        },

        startHeartbeat: () => {
            // Stop any existing heartbeat
            if (heartbeatInterval) {
                window.clearInterval(heartbeatInterval);
            }

            // Get current user
            const currentUser = useUserStore.getState().user;
            if (!currentUser) return;

            // Set current user as online immediately
            get().setUserOnline(currentUser.id);

            // Send initial heartbeat
            axiosInstance.post('/user/heartbeat')
                .then(response => {
                    if (response.data.online_users) {
                        // Update online users from response
                        const onlineUsers: OnlineStatus = {};
                        response.data.online_users.forEach((user: { id: string, last_seen: string }) => {
                            onlineUsers[user.id] = { lastSeen: user.last_seen };
                        });
                        set({ onlineUsers });
                    }
                })
                .catch(error => console.error('Heartbeat failed:', error));

            // Set up periodic heartbeat
            heartbeatInterval = window.setInterval(() => {
                axiosInstance.post('/user/heartbeat')
                    .then(response => {
                        if (response.data.online_users) {
                            // Update online users from response
                            const onlineUsers: OnlineStatus = {};
                            response.data.online_users.forEach((user: { id: string, last_seen: string }) => {
                                onlineUsers[user.id] = { lastSeen: user.last_seen };
                            });
                            set({ onlineUsers });
                        }
                    })
                    .catch(error => console.error('Heartbeat failed:', error));
            }, 30000); // Every 30 seconds

            // Handle visibility change
            const handleVisibilityChange = () => {
                if (!document.hidden && currentUser) {
                    get().setUserOnline(currentUser.id);
                    axiosInstance.post('/user/heartbeat')
                        .catch(error => console.error('Heartbeat failed:', error));
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Handle beforeunload event to mark user as offline
            const handleBeforeUnload = () => {
                axiosInstance.post('/user/offline')
                    .catch(() => {
                        // Ignore errors on page unload
                    });
            };

            window.addEventListener('beforeunload', handleBeforeUnload);
        },

        stopHeartbeat: () => {
            if (heartbeatInterval) {
                window.clearInterval(heartbeatInterval);
                heartbeatInterval = null;
            }

            // Remove event listeners
            document.removeEventListener('visibilitychange', () => {});
            window.removeEventListener('beforeunload', () => {});

            // Send offline status
            const currentUser = useUserStore.getState().user;
            if (currentUser) {
                axiosInstance.post('/user/offline')
                    .catch(error => console.error('Failed to set offline status:', error));
            }
        },

        isUserOnline: (userId?: string) => {
            if (!userId) return false;

            const user = get().onlineUsers[userId];
            if (!user) return false;

            const lastSeen = new Date(user.lastSeen);
            const now = new Date();
            return now.getTime() - lastSeen.getTime() < ONLINE_THRESHOLD_MS;
        }
    };
});

export default useOnlineStatusStore;

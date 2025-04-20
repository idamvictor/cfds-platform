import { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import useOnlineStatusStore from "@/store/OnlineStatusState.ts";

export function OnlineStatusInitializer() {
    const startHeartbeat = useOnlineStatusStore(state => state.startHeartbeat);
    const stopHeartbeat = useOnlineStatusStore(state => state.stopHeartbeat);
    const user = useUserStore(state => state.user);

    useEffect(() => {
        if (user) {
            startHeartbeat();
        }

        // Cleanup on unmount
        return () => {
            stopHeartbeat();
        };
    }, [user, startHeartbeat, stopHeartbeat]);

    return null;
}

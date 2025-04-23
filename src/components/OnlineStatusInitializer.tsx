import { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import useOnlineStatusStore from "@/store/OnlineStatusState";

export function OnlineStatusInitializer() {
    const startHeartbeat = useOnlineStatusStore(state => state.startHeartbeat);
    const stopHeartbeat = useOnlineStatusStore(state => state.stopHeartbeat);
    const user = useUserStore(state => state.user);

    useEffect(() => {
        if (user) {
            startHeartbeat();
        }
        return () => {
            stopHeartbeat();
        };
    }, [user, startHeartbeat, stopHeartbeat]);

    return null;
}

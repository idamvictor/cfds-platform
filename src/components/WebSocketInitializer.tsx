import { useEffect } from "react";
import { useAssetWebSocket } from "@/hooks/useAssetWebsocket";
import PusherService from "@/services/PusherService";
import useUserStore from "@/store/userStore";
import { NotificationListener } from "./NotificationListener";


export default function WebSocketInitializer() {
    const { user } = useUserStore();

    // Initialize the Asset WebSocket
    const { subscribeToAll, isConnected } = useAssetWebSocket({
        onConnected: () => console.log("Asset WebSocket connected"),
        onDisconnected: () => console.log("Asset WebSocket disconnected"),
        onError: (error) => console.error("Asset WebSocket error:", error.message)
    });

    // Subscribe to all assets when the connection is established
    useEffect(() => {
        if (isConnected) {
            subscribeToAll();
        }
    }, [isConnected, subscribeToAll]);

    // Initialize the Pusher service for user notifications when authenticated
    useEffect(() => {
        if (user) {
            const pusherService = PusherService.getInstance();
            pusherService.connect();
        }
    }, [user]);

    return user ? <NotificationListener /> : null;
}

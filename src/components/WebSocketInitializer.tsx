
import { useEffect } from "react";
import { useAssetWebSocket } from "@/hooks/useAssetWebsocket";


export default function WebSocketInitializer() {
    const { subscribeToAll, isConnected } = useAssetWebSocket({
        onConnected: () => console.log("WebSocket connected"),
        onDisconnected: () => console.log("WebSocket disconnected"),
        onError: (error) => console.error("WebSocket error:", error.message)
    });

    // Subscribe to all assets when the connection is established
    useEffect(() => {
        if (isConnected) {
            subscribeToAll();
        }
    }, [isConnected, subscribeToAll]);

    return null;
}

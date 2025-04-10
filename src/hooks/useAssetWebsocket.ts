import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import useAssetStore from '@/store/assetStore';

// Types for WebSocket data
export interface AssetUpdate {
    id: string;
    symbol: string;
    name: string;
    category: string;
    price: number;
    lastUpdated: string;
    tradingViewSymbol: string;
    priceLow24h?: number;
    priceHigh24h?: number;
    change24h?: number;
    changePercent24h?: number;
    volume24h?: number | null;
}

export interface WebSocketResponse {
    success: boolean;
    count: number;
    data: AssetUpdate[];
}

interface WebSocketOptions {
    onConnected?: () => void;
    onDisconnected?: () => void;
    onError?: (error: Error) => void;
}

/**
 * Custom hook for managing asset WebSocket connections
 */
export function useAssetWebSocket(options: WebSocketOptions = {}) {
    const socketRef = useRef<Socket | null>(null);
    const updateAssetFromWebsocket = useAssetStore(state => state.updateAssetFromWebsocket);

    // Connect to WebSocket
    const connect = useCallback(() => {
        if (socketRef.current?.connected) {
            return;
        }

        socketRef.current = io("https://asset-data.surdonline.com", {
            auth: {
                apiKey: "9e37abad-04e9-47fb-bbd5-b8e344ff7e5a"
            },
            transports: ['websocket']
        });

        // Handle connection events
        socketRef.current.on('connect', () => {
            options.onConnected?.();
        });

        socketRef.current.on('disconnect', () => {
            options.onDisconnected?.();
        });

        socketRef.current.on('error', (error: Error) => {
            options.onError?.(error);
        });

        // Handle data events - simplified to only necessary events
        socketRef.current.on('data:all', (response: WebSocketResponse) => {
            if (response.success && response.data?.length) {
                updateAssetFromWebsocket(response.data);
            }
        });

        // Standard updates for individual assets
        socketRef.current.on('data:update', (asset: AssetUpdate) => {
            updateAssetFromWebsocket(asset);
        });

    }, [options, updateAssetFromWebsocket]);

    // Subscribe to all assets - this is all we need
    const subscribeToAll = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('subscribe:all');
        }
    }, []);

    // Disconnect and cleanup
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    // Setup connection and cleanup
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        subscribeToAll,
        disconnect
    };
}

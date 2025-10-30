import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import useAssetStore from '@/store/assetStore';
import useSiteSettingsStore from '@/store/siteSettingStore';

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
    const livetraderStatus = useSiteSettingsStore(
        (state) => state.settings?.livetrader_status ?? true
    );

    // Connect to WebSocket
    const connect = useCallback(() => {
        // Don't try to reconnect if already connected
        if (socketRef.current?.connected) {
            return;
        }

        // If there's an existing socket that's not connected, clean it up first
        if (socketRef.current) {
            socketRef.current.removeAllListeners();
            socketRef.current.close();
            socketRef.current = null;
        }

        // Create a new socket
        socketRef.current = io("https://asset-data.surdonline.com", {
            auth: {
                apiKey: "9e37abad-04e9-47fb-bbd5-b8e344ff7e5a"
            },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            timeout: 10000
        });

        // Handle connection events
        socketRef.current.on('connect', () => {
            options.onConnected?.();

            // Subscribe to all assets immediately when connected
            if (socketRef.current) {
                socketRef.current.emit('subscribe:all');
            }
        });

        socketRef.current.on('disconnect', () => {
            options.onDisconnected?.();
        });

        socketRef.current.on('connect_error', (error: Error) => {
            options.onError?.(error);
        });

        // Handle data events
        socketRef.current.on('data:all', (response: WebSocketResponse) => {
            if (response.success && response.data?.length) {
                updateAssetFromWebsocket(response.data);
            }
        });

        socketRef.current.on('data:update', (asset: AssetUpdate) => {
            updateAssetFromWebsocket(asset);
        });

    }, [options, updateAssetFromWebsocket]);

    // Subscribe to all assets
    const subscribeToAll = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('subscribe:all');
        }
    }, []);

    // Disconnect and cleanup
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.removeAllListeners();
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    // Setup connection and cleanup
    useEffect(() => {
        // Only connect if livetrader_status is true
        if (livetraderStatus) {
            connect();
        } else {
            // Disconnect if livetrader_status is false
            disconnect();
        }

        // Clean up WebSocket connection on unmount
        return () => {
            disconnect();
        };
    }, [connect, disconnect, livetraderStatus]);

    return {
        subscribeToAll,
        disconnect,
        isConnected: !!socketRef.current?.connected
    };
}

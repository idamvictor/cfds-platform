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
    // Optional fields that might not be present in all asset types
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

        // Handle data events
        socketRef.current.on('data:all', (response: WebSocketResponse) => {
            if (response.success && response.data?.length) {
                response.data.forEach(asset => {
                    updateAssetFromWebsocket(asset);
                });
            }
        });

        // Standard updates
        socketRef.current.on('data:update', (asset: AssetUpdate) => {
            updateAssetFromWebsocket(asset);
        });

        // Turbo mode (high frequency) updates
        socketRef.current.on('turbo:update', (asset: AssetUpdate) => {
            updateAssetFromWebsocket(asset);
        });

        // Category data
        socketRef.current.on('data:category:forex', (response: WebSocketResponse) => {
            if (response.success && response.data?.length) {
                response.data.forEach(asset => {
                    updateAssetFromWebsocket(asset);
                });
            }
        });

        socketRef.current.on('data:category:crypto', (response: WebSocketResponse) => {
            if (response.success && response.data?.length) {
                response.data.forEach(asset => {
                    updateAssetFromWebsocket(asset);
                });
            }
        });

        socketRef.current.on('data:category:stocks', (response: WebSocketResponse) => {
            if (response.success && response.data?.length) {
                response.data.forEach(asset => {
                    updateAssetFromWebsocket(asset);
                });
            }
        });

        socketRef.current.on('data:category:metals', (response: WebSocketResponse) => {
            if (response.success && response.data?.length) {
                response.data.forEach(asset => {
                    updateAssetFromWebsocket(asset);
                });
            }
        });

    }, [options, updateAssetFromWebsocket]);

    // Subscribe to all assets
    const subscribeToAll = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('subscribe:all');
        }
    }, []);

    // Subscribe to a category
    const subscribeToCategory = useCallback((category: string) => {
        if (socketRef.current) {
            socketRef.current.emit('subscribe:category', category);
        }
    }, []);

    // Subscribe to specific symbols
    const subscribeToSymbols = useCallback((symbols: string[], turboMode = false) => {
        if (socketRef.current) {
            socketRef.current.emit('subscribe:symbols', {
                symbols,
                mode: turboMode ? 'turbo' : undefined
            });
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
        subscribeToCategory,
        subscribeToSymbols,
        disconnect
    };
}

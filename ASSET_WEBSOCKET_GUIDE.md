# Live Asset Price WebSocket System Documentation

## Overview
This system provides real-time asset price updates using Socket.IO WebSocket connections. It manages live trading data for forex, crypto, stocks, indices, commodities, and metals across the trading platform.

## Architecture

### Core Components

1. **useAssetWebSocket Hook** (`src/hooks/useAssetWebsocket.ts`)
   - Main WebSocket connection management
   - Handles connection lifecycle and error handling
   - Integrates with Zustand store for state updates

2. **Asset Store** (`src/store/assetStore.ts`)
   - Zustand store for asset state management
   - Handles real-time price updates from WebSocket
   - Manages asset grouping and active selections

3. **WebSocket Server**
   - External service: `https://asset-data.surdonline.com`
   - Provides real-time market data
   - API Key authenticated

## WebSocket Connection Setup

### Environment Configuration
```typescript
// WebSocket server configuration
const WEBSOCKET_URL = "https://asset-data.surdonline.com";
const API_KEY = "9e37abad-04e9-47fb-bbd5-b8e344ff7e5a";
```

### Connection Parameters
```typescript
const socket = io("https://asset-data.surdonline.com", {
  auth: {
    apiKey: "9e37abad-04e9-47fb-bbd5-b8e344ff7e5a"
  },
  transports: ['websocket'],
  reconnectionAttempts: 5,
  timeout: 10000
});
```

## Data Types

### Asset Update Structure
```typescript
export interface AssetUpdate {
  id: string;                    // Asset ID
  symbol: string;               // Trading symbol
  name: string;                 // Asset name
  category: string;             // Asset category
  price: number;                // Current price
  lastUpdated: string;          // ISO timestamp
  tradingViewSymbol: string;    // TradingView symbol
  priceLow24h?: number;         // 24h low
  priceHigh24h?: number;        // 24h high
  change24h?: number;           // 24h change amount
  changePercent24h?: number;    // 24h change percentage
  volume24h?: number | null;    // 24h trading volume
}
```

### WebSocket Response Format
```typescript
export interface WebSocketResponse {
  success: boolean;
  count: number;
  data: AssetUpdate[];
}
```

## WebSocket Events

### Outgoing Events (Client → Server)

#### 1. Subscribe to All Assets
```typescript
// Subscribe to all asset updates
socket.emit('subscribe:all');
```

#### 2. Subscribe to Specific Assets
```typescript
// Subscribe to multiple assets by symbol
socket.emit('subscribe:assets', { 
  symbols: ['BTCUSD', 'EURUSD', 'AAPL'] 
});

// Subscribe to single asset by symbol
socket.emit('subscribe:asset', { 
  symbol: 'BTCUSD' 
});
```

#### 3. Unsubscribe from Assets
```typescript
// Unsubscribe from multiple assets
socket.emit('unsubscribe:assets', { 
  symbols: ['BTCUSD', 'EURUSD'] 
});

// Unsubscribe from single asset
socket.emit('unsubscribe:asset', { 
  symbol: 'BTCUSD' 
});
```

### Incoming Events (Server → Client)

#### 1. Initial Data Load
```typescript
socket.on('data:all', (response: WebSocketResponse) => {
  // Bulk asset data on connection
  if (response.success && response.data?.length) {
    updateAssetFromWebsocket(response.data);
  }
});
```

#### 2. Real-time Updates
```typescript
socket.on('data:update', (asset: AssetUpdate) => {
  // Individual asset price updates
  updateAssetFromWebsocket(asset);
});
```

#### 3. Connection Events
```typescript
socket.on('connect', () => {
  // Connection established
  socket.emit('subscribe:all');
});

socket.on('disconnect', () => {
  // Connection lost
});

socket.on('connect_error', (error) => {
  // Connection failed
});
```

## Store Integration

### Asset Store State
```typescript
interface AssetStore {
  assets: Asset[];                    // All available assets
  activeAsset: Asset | null;          // Currently selected asset
  groupedAssets: Record<string, Asset[]>; // Assets grouped by category
  activePairs: string[];              // User's active trading pairs
  
  // WebSocket update handler
  updateAssetFromWebsocket: (updates: AssetUpdate | AssetUpdate[]) => void;
}
```

### Price Update Logic
```typescript
updateAssetFromWebsocket: (updates) => {
  set((state) => {
    const updateArray = Array.isArray(updates) ? updates : [updates];
    const assetsMap = new Map(state.assets.map(asset => [asset.asset_id, asset]));
    
    updateArray.forEach((update) => {
      const asset = assetsMap.get(update.id);
      if (!asset) return;
      
      // Update asset with new price data
      const updatedAsset = {
        ...asset,
        rate: update.price.toString(),
        price_low: update.priceLow24h?.toString(),
        price_high: update.priceHigh24h?.toString(),
        change: update.change24h?.toString(),
        change_percent: update.changePercent24h?.toString(),
        volume: update.volume24h?.toString() || null,
        updated_at: update.lastUpdated,
        // Calculate spread-adjusted prices
        buy_price: update.price * (1 + Number(asset.buy_spread)),
        sell_price: update.price * (1 - Number(asset.sell_spread)),
      };
      
      // Update in all relevant collections
      // ... update logic
    });
  });
}
```

## Usage Patterns

### 1. Market Watch Component (All Assets)
```typescript
import { useAssetWebSocket } from "@/hooks/useAssetWebsocket";
import useAssetStore from "@/store/assetStore";

export function MarketWatch() {
  const { assets, groupedAssets } = useAssetStore();
  
  // Initialize WebSocket connection for all assets
  const { subscribeToAll } = useAssetWebSocket({
    onConnected: () => {
      subscribeToAll();
    },
    onDisconnected: () => {
      console.log('WebSocket disconnected');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  return (
    <div>
      {assets.map(asset => (
        <div key={asset.id}>
          {asset.symbol}: {asset.rate}
        </div>
      ))}
    </div>
  );
}
```

### 2. Selective Asset Subscription
```typescript
import { useAssetWebSocket } from "@/hooks/useAssetWebsocket";
import useAssetStore from "@/store/assetStore";
import { useEffect, useState } from "react";

export function WatchlistComponent() {
  const { assets } = useAssetStore();
  const [watchlist, setWatchlist] = useState(['BTCUSD', 'EURUSD', 'AAPL']);
  
  const { 
    subscribeToAssets, 
    subscribeToAsset,
    unsubscribeFromAsset,
    isConnected 
  } = useAssetWebSocket({
    onConnected: () => {
      console.log('Connected - subscribing to watchlist');
    }
  });

  // Subscribe to watchlist on connection
  useEffect(() => {
    if (isConnected && watchlist.length > 0) {
      subscribeToAssets(watchlist);
    }
  }, [isConnected, watchlist, subscribeToAssets]);

  const addToWatchlist = (symbol: string) => {
    setWatchlist(prev => [...prev, symbol]);
    if (isConnected) {
      subscribeToAsset(symbol);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    if (isConnected) {
      unsubscribeFromAsset(symbol);
    }
  };

  // Display only watchlist assets
  const watchlistAssets = assets.filter(asset => 
    watchlist.includes(asset.tv_symbol || asset.symbol)
  );

  return (
    <div>
      <h3>My Watchlist</h3>
      {watchlistAssets.map(asset => (
        <div key={asset.id} className="flex justify-between">
          <span>{asset.symbol}: {asset.rate}</span>
          <button onClick={() => removeFromWatchlist(asset.tv_symbol)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 3. Single Asset Focus
```typescript
export function SingleAssetTracker({ symbol }: { symbol: string }) {
  const asset = useAssetStore(state => 
    state.assets.find(a => a.tv_symbol === symbol || a.symbol === symbol)
  );
  
  const { subscribeToAsset, unsubscribeFromAsset, isConnected } = useAssetWebSocket({
    onConnected: () => {
      if (symbol) {
        subscribeToAsset(symbol);
      }
    }
  });

  useEffect(() => {
    if (isConnected && symbol) {
      subscribeToAsset(symbol);
    }
    
    // Cleanup on unmount or symbol change
    return () => {
      if (symbol) {
        unsubscribeFromAsset(symbol);
      }
    };
  }, [symbol, isConnected, subscribeToAsset, unsubscribeFromAsset]);

  if (!asset) {
    return <div>Asset not found: {symbol}</div>;
  }

  return (
    <div>
      <h2>{asset.name}</h2>
      <div>Price: {asset.rate}</div>
      <div>Change: {asset.change_percent}%</div>
      <div>Volume: {asset.volume}</div>
    </div>
  );
}
```

### 4. Auto-Connection in App
```typescript
// In main App component or layout
import { useAssetWebSocket } from "@/hooks/useAssetWebsocket";

function App() {
  // Auto-connect when app loads
  useAssetWebSocket({
    onConnected: () => {
      console.log('Asset WebSocket connected');
    }
  });
  
  return <YourAppContent />;
}
```

## Conditional Connection

### Live Trader Status Control
```typescript
// Connection controlled by site settings
const livetraderStatus = useSiteSettingsStore(
  (state) => state.settings?.livetrader_status ?? true
);

useEffect(() => {
  if (livetraderStatus) {
    connect(); // Connect to WebSocket
  } else {
    disconnect(); // Disconnect WebSocket
  }
}, [livetraderStatus]);
```

## Error Handling & Reconnection

### Automatic Reconnection
- **Reconnection Attempts**: 5 attempts
- **Timeout**: 10 seconds per attempt
- **Transport**: WebSocket only (no fallback to polling)

### Connection Monitoring
```typescript
const { isConnected, disconnect } = useAssetWebSocket({
  onConnected: () => {
    toast.success('Market data connected');
  },
  onDisconnected: () => {
    toast.warning('Market data disconnected');
  },
  onError: (error) => {
    toast.error(`Market data error: ${error.message}`);
  }
});
```

## Performance Considerations

### 1. Efficient Updates
- Uses Map for O(1) asset lookups
- Batches multiple updates in single state change
- Only updates changed assets

### 2. Memory Management
- Automatic cleanup on component unmount
- Removes all listeners before disconnection
- Prevents memory leaks with proper cleanup

### 3. Selective Subscription Benefits
```typescript
// Instead of subscribing to all assets (potentially 1000s)
subscribeToAll(); // High bandwidth usage

// Subscribe only to what you need
subscribeToAssets(['BTCUSD', 'EURUSD', 'AAPL']); // Low bandwidth usage

// Performance comparison:
// All assets: ~50-100 updates/second
// 10 assets: ~2-5 updates/second
// Single asset: ~0.5-1 updates/second
```

#### When to Use Selective Subscription:
- **Watchlists**: User's favorite assets
- **Trading Pages**: Only currently traded assets  
- **Mobile Apps**: Reduce battery drain
- **Slow Connections**: Minimize data usage
- **Focus Mode**: Single asset trading

#### When to Use Subscribe All:
- **Market Overview**: Full market dashboard
- **Asset Search**: Real-time filtering across all assets
- **Admin Panels**: Monitoring all market data
- **Alerts System**: Watching for opportunities across markets

### 4. State Persistence
```typescript
// Only essential data persisted
partialize: (state) => ({
  activeAsset: state.activeAsset,
  activePairs: state.activePairs,
  activePair: state.activePair,
}),
```

## Spread Calculation

### Buy/Sell Price Calculation
```typescript
// Prices adjusted for spread
buy_price: basePrice * (1 + buySpread)
sell_price: basePrice * (1 - sellSpread)
```

Example:
- Base Price: $100
- Buy Spread: 0.001 (0.1%)
- Sell Spread: 0.001 (0.1%)
- Buy Price: $100.10
- Sell Price: $99.90

## Integration with Trading Components

### Price Display Components
All price displays automatically update when WebSocket receives new data:
- Market watch panels
- Asset selection dropdowns
- Trading interface price displays
- Chart price indicators

### Leverage Calculation
```typescript
getActiveLeverage: () => {
  const leverageData = useDataStore.getState().leverage;
  const assetType = activeAsset.category;
  
  return leverageData[assetType] || 
         activeAsset.leverage || 
         user.account_type.leverage || 
         20; // default
}
```

## Migration to Next.js

### Required Changes

1. **Environment Variables**
```typescript
// Change from Vite env vars
// From: import.meta.env.VITE_WEBSOCKET_URL
// To: process.env.NEXT_PUBLIC_WEBSOCKET_URL
```

2. **Client Components**
```typescript
'use client';
import { useAssetWebSocket } from '@/hooks/useAssetWebsocket';
```

3. **Socket.IO Client**
```bash
npm install socket.io-client
```

### Next.js Implementation
```typescript
// pages/trading.tsx or app/trading/page.tsx
'use client';

import { useEffect } from 'react';
import { useAssetWebSocket } from '@/hooks/useAssetWebsocket';

export default function TradingPage() {
  const { subscribeToAll, isConnected } = useAssetWebSocket();
  
  useEffect(() => {
    if (isConnected) {
      subscribeToAll();
    }
  }, [isConnected, subscribeToAll]);
  
  return (
    <div>
      <MarketWatch />
      <TradingInterface />
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Connection Failures**
   - Check API key validity
   - Verify network connectivity
   - Ensure WebSocket not blocked by firewall

2. **Price Updates Not Showing**
   - Verify WebSocket connection status
   - Check if `subscribeToAll()` was called
   - Ensure component is subscribed to asset store

3. **Performance Issues**
   - Limit number of active assets
   - Check for memory leaks in components
   - Monitor WebSocket message frequency

### Debug Information
```typescript
// Add to useAssetWebSocket for debugging
console.log('WebSocket Status:', socketRef.current?.connected);
console.log('Assets Updated:', updates.length);
console.log('Active Asset:', activeAsset?.symbol);
```

## Security Considerations

- API key is exposed in client code (consider server-side proxy)
- WebSocket URL should be configurable via environment variables
- Implement proper error handling for malicious data
- Validate incoming data structure before processing
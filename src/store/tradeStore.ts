import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { io, Socket } from 'socket.io-client';
import useUserStore from "@/store/userStore.ts";

export interface Trade {
  id: string;
  trade_type: "buy" | "sell";
  leverage: number;
  amount: number;
  volume: number;
  opening_price: number;
  closing_price: number;
  pnl: number;
  take_profit: number;
  stop_loss: number;
  is_closed: boolean;
  open_time: string;
  asset_id: string;
  asset_symbol: string;
  asset_name: string;
}

export interface AccountSummary {
  balance: number;
  credit: number;
  equity: number;
  margin: number;
  marginLevel: string;
  freeMargin: number;
  pnl: number;
  lifetimePnl: number;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  path: string;
  per_page: number;
  to: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

// WebSocket response interface
interface AssetUpdate {
  id: string;
  symbol?: string;
  name?: string;
  price: number;
  lastUpdated?: string;
  priceLow24h?: number;
  priceHigh24h?: number;
  change24h?: number;
  changePercent24h?: number;
  volume24h?: number | null;
}

interface TradeStore {
  openTrades: Trade[];
  closedTrades: Trade[];
  accountSummary: AccountSummary;
  isLoadingOpen: boolean;
  isLoadingClosed: boolean;
  errorOpen: string | null;
  errorClosed: string | null;
  openTradesMeta: PaginationMeta | null;
  closedTradesMeta: PaginationMeta | null;
  openTradesLinks: PaginationLinks | null;
  closedTradesLinks: PaginationLinks | null;
  wsConnected: boolean;

  fetchOpenTrades: (page?: number) => Promise<void>;
  fetchClosedTrades: (page?: number) => Promise<void>;
  fetchMoreOpenTrades: () => Promise<void>;
  fetchMoreClosedTrades: () => Promise<void>;
  hasMoreOpenTrades: () => boolean;
  hasMoreClosedTrades: () => boolean;
  resetTrades: () => void;
  updateTradesWithPrices: (prices: Record<string, number>) => void;
  calculateAccountSummary: () => void;
}

// Global socket instance to prevent multiple connections
let socket: Socket | null = null;

// Helper function to calculate PnL
const calculatePnL = (trade: Trade, currentPrice: number): number => {
  // const contractSize = 100000;
  const priceDifference = trade.trade_type === 'buy'
      ? currentPrice - trade.opening_price
      : trade.opening_price - currentPrice;

  return priceDifference * trade.volume;
  // return priceDifference * trade.volume * contractSize;
};

// Helper function to calculate margin
const calculateMargin = (trade: Trade, currentPrice: number): number => {
  // const contractSize = 100000;
  // return (trade.volume * contractSize * currentPrice) / trade.leverage;
  //
  // const contractSize = 100000;
  return (trade.volume * currentPrice) / trade.leverage;
};

// Type guard for AssetUpdate
function isAssetUpdate(data: unknown): data is AssetUpdate {
  const asset = data as Partial<AssetUpdate>;
  return typeof asset === 'object' &&
      asset !== null &&
      typeof asset.id === 'string' &&
      typeof asset.price === 'number';
}


const useTradeStore = create<TradeStore>((set, get) => ({
  openTrades: [],
  closedTrades: [],
  accountSummary: {
    balance: 610.05,
    credit: 0.0,
    equity: 610.05,
    margin: 0.0,
    marginLevel: "∞",
    freeMargin: 610.05,
    pnl: 0,
    lifetimePnl: 460.05,
  },
  isLoadingOpen: false,
  isLoadingClosed: false,
  errorOpen: null,
  errorClosed: null,
  openTradesMeta: null,
  closedTradesMeta: null,
  openTradesLinks: null,
  closedTradesLinks: null,
  wsConnected: false,

  fetchOpenTrades: async (page = 1) => {
    set({ isLoadingOpen: true, errorOpen: null });
    try {
      const response = await axiosInstance.get(`/open/trades?page=${page}`);

      // Update trades in store
      if (page === 1) {
        set({
          openTrades: response.data.data,
          openTradesMeta: response.data.meta || null,
          openTradesLinks: response.data.links || null,
        });
      } else {
        set((state) => ({
          openTrades: [...state.openTrades, ...response.data.data],
          openTradesMeta: response.data.meta || null,
          openTradesLinks: response.data.links || null,
        }));
      }

      // Initialize WebSocket if we have trades
      const { openTrades } = get();
      if (openTrades.length > 0) {
        initWebSocket();
      }

      // Calculate account summary
      get().calculateAccountSummary();
    } catch (error) {
      console.error("Failed to fetch open trades:", error);
      set({ errorOpen: "Failed to fetch open trades. Please try again." });
    } finally {
      set({ isLoadingOpen: false });
    }
  },

  fetchClosedTrades: async (page = 1) => {
    set({ isLoadingClosed: true, errorClosed: null });
    try {
      const response = await axiosInstance.get(`/closed/trades?page=${page}`);

      if (page === 1) {
        set({
          closedTrades: response.data.data,
          closedTradesMeta: response.data.meta || null,
          closedTradesLinks: response.data.links || null,
        });
      } else {
        set((state) => ({
          closedTrades: [...state.closedTrades, ...response.data.data],
          closedTradesMeta: response.data.meta || null,
          closedTradesLinks: response.data.links || null,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch closed trades:", error);
      set({ errorClosed: "Failed to fetch closed trades. Please try again." });
    } finally {
      set({ isLoadingClosed: false });
    }
  },

  fetchMoreOpenTrades: async () => {
    const { openTradesMeta, openTradesLinks, isLoadingOpen } = get();

    if (isLoadingOpen || !openTradesLinks?.next) return;

    const nextPage = openTradesMeta ? openTradesMeta.current_page + 1 : 1;
    await get().fetchOpenTrades(nextPage);
  },

  fetchMoreClosedTrades: async () => {
    const { closedTradesMeta, closedTradesLinks, isLoadingClosed } = get();

    if (isLoadingClosed || !closedTradesLinks?.next) return;

    const nextPage = closedTradesMeta ? closedTradesMeta.current_page + 1 : 1;
    await get().fetchClosedTrades(nextPage);
  },

  hasMoreOpenTrades: () => {
    const { openTradesLinks } = get();
    return !!openTradesLinks?.next;
  },

  hasMoreClosedTrades: () => {
    const { closedTradesLinks } = get();
    return !!closedTradesLinks?.next;
  },

  resetTrades: () => {
    // Disconnect WebSocket when resetting
    if (socket) {
      socket.disconnect();
      socket = null;
      set({ wsConnected: false });
    }

    set({
      openTrades: [],
      closedTrades: [],
      openTradesMeta: null,
      closedTradesMeta: null,
      openTradesLinks: null,
      closedTradesLinks: null,
    });
  },

  updateTradesWithPrices: (prices: Record<string, number>) => {
    if (Object.keys(prices).length === 0) return;

    set(state => {
      // Update open trades with new prices
      const updatedTrades = state.openTrades.map(trade => {
        const newPrice = prices[trade.asset_id];
        if (newPrice !== undefined) {
          // Calculate new PnL
          const newPnL = calculatePnL(trade, newPrice);

          // Return updated trade
          return {
            ...trade,
            closing_price: newPrice,
            pnl: newPnL
          };
        }
        return trade;
      });

      return { openTrades: updatedTrades };
    });

    // Update account summary after prices are updated
    get().calculateAccountSummary();
  },

  calculateAccountSummary: () => {
    const { openTrades } = get();

    const user = useUserStore.getState().user;
    const balance = user?.balance || 0;
    const credit = user?.credit_balance || 0;

    const totalPnL = openTrades.reduce((sum, trade) => sum + trade.pnl, 0);

    // Calculate margin
    const totalMargin = openTrades.reduce((sum, trade) => {
      return sum + calculateMargin(trade, trade.closing_price);
    }, 0);

    const equity = balance + totalPnL;
    const freeMargin = equity - totalMargin;

    // Calculate margin level - handle division by zero
    const marginLevel = totalMargin > 0
        ? ((equity / totalMargin) * 100).toFixed(2) + '%'
        : '∞';

    set({
      accountSummary: {
        balance,
        credit,
        equity,
        margin: totalMargin,
        marginLevel,
        freeMargin,
        pnl: totalPnL,
        lifetimePnl: 460.05 // Placeholder value
      }
    });
  }
}));

// Initialize WebSocket connection
function initWebSocket() {
  if (socket && socket.connected) return;

  // Clean up any existing connection
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  try {
    // Create new socket
    socket = io("https://asset-data.surdonline.com", {
      auth: { apiKey: "9e37abad-04e9-47fb-bbd5-b8e344ff7e5a" },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    // Get store methods
    const { updateTradesWithPrices } = useTradeStore.getState();

    // Handle connection events
    socket.on('connect', () => {
      console.log('WebSocket connected');
      useTradeStore.setState({ wsConnected: true });

      // Subscribe to all data
      socket?.emit('subscribe:all');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      useTradeStore.setState({ wsConnected: false });
    });

    socket.on('data:update', (assetUpdates: unknown) => {
      try {
        if (Array.isArray(assetUpdates)) {
          const prices: Record<string, number> = {};

          // Process each asset in the array
          assetUpdates.forEach((asset: unknown) => {
            if (isAssetUpdate(asset)) {
              prices[asset.id] = asset.price;
            }
          });

          if (Object.keys(prices).length > 0) {
            // console.log('prices', prices)
            updateTradesWithPrices(prices);
          }
        }
      } catch (err) {
        console.error('Error processing batch update:', err);
      }
    });

  } catch (err) {
    console.error('WebSocket initialization error:', err);
  }
}

export default useTradeStore;

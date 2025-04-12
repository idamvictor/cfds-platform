import { create } from "zustand";
import axiosInstance from "@/lib/axios";

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

interface TradeStore {
  openTrades: Trade[];
  closedTrades: Trade[];
  isLoadingOpen: boolean;
  isLoadingClosed: boolean;
  errorOpen: string | null;
  errorClosed: string | null;
  openTradesMeta: PaginationMeta | null;
  closedTradesMeta: PaginationMeta | null;
  openTradesLinks: PaginationLinks | null;
  closedTradesLinks: PaginationLinks | null;

  fetchOpenTrades: (page?: number) => Promise<void>;
  fetchClosedTrades: (page?: number) => Promise<void>;
  fetchMoreOpenTrades: () => Promise<void>;
  fetchMoreClosedTrades: () => Promise<void>;
  hasMoreOpenTrades: () => boolean;
  hasMoreClosedTrades: () => boolean;
  resetTrades: () => void;
}

const useTradeStore = create<TradeStore>((set, get) => ({
  openTrades: [],
  closedTrades: [],
  isLoadingOpen: false,
  isLoadingClosed: false,
  errorOpen: null,
  errorClosed: null,
  openTradesMeta: null,
  closedTradesMeta: null,
  openTradesLinks: null,
  closedTradesLinks: null,

  fetchOpenTrades: async (page = 1) => {
    set({ isLoadingOpen: true, errorOpen: null });
    try {
      const response = await axiosInstance.get(`/open/trades?page=${page}`);

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

      // If it's the first page, replace the data, otherwise append
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

    // Don't fetch if already loading or no next page
    if (isLoadingOpen || !openTradesLinks?.next) return;

    const nextPage = openTradesMeta ? openTradesMeta.current_page + 1 : 1;
    await get().fetchOpenTrades(nextPage);
  },

  fetchMoreClosedTrades: async () => {
    const { closedTradesMeta, closedTradesLinks, isLoadingClosed } = get();

    // Don't fetch if already loading or no next page
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
    set({
      openTrades: [],
      closedTrades: [],
      openTradesMeta: null,
      closedTradesMeta: null,
      openTradesLinks: null,
      closedTradesLinks: null,
    });
  },
}));

export default useTradeStore;

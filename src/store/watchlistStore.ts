import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Asset {
  id: string | number;
  symbol_display: string;
  name: string;
  sell_price: number;
  buy_price: number;
  change_percent: string | null;
}

interface WatchlistStore {
  watchlist: Asset[];
  addToWatchlist: (asset: Asset) => void;
  removeFromWatchlist: (symbolDisplay: string) => void;
  isInWatchlist: (symbolDisplay: string) => boolean;
}

const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (asset) => {
        const isAlreadyInWatchlist = get().watchlist.some(
          (item) => item.symbol_display === asset.symbol_display
        );
        if (!isAlreadyInWatchlist) {
          set((state) => ({
            watchlist: [...state.watchlist, asset],
          }));
        }
      },
      removeFromWatchlist: (symbolDisplay) => {
        set((state) => ({
          watchlist: state.watchlist.filter(
            (item) => item.symbol_display !== symbolDisplay
          ),
        }));
      },
      isInWatchlist: (symbolDisplay) => {
        return get().watchlist.some(
          (item) => item.symbol_display === symbolDisplay
        );
      },
    }),
    {
      name: "watchlist-storage",
    }
  )
);

export default useWatchlistStore;

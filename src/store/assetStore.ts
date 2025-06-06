import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { AssetUpdate } from "@/hooks/useAssetWebsocket";
import useUserStore from "@/store/userStore.ts";
import useDataStore, {AssetCat} from "@/store/dataStore.ts";

export interface Asset {
  id: string;
  asset_id: string;
  name: string;
  tv_symbol: string;
  symbol: string;
  sy: string;
  symbol_display: string;
  rate: string;
  price_low: string;
  price_high: string;
  volume: string | null;
  market_cap: string | null;
  change: string | null;
  change_percent: string | null;
  buy_spread: string;
  sell_spread: string;
  base: string;
  leverage: number;
  is_active: number;
  image: string;
  sym_key: string;
  type: "forex" | "crypto" | "stocks" | "indices" | "commodities" | "metals";
  category: "forex" | "cryptos" | "stocks" | "indices" | "commodities" | "metals";
  buy_price: number;
  sell_price: number;
  created_at: string;
  updated_at: string;
  contract_size: number;
  position: number;
}

interface AssetStore {
  assets: Asset[];
  activeAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  groupedAssets: Record<string, Asset[]>;
  activePairs: string[];
  activePair: string | null;

  fetchAssets: () => Promise<void>;
  setActiveAsset: (asset: Asset) => void;
  getAssetById: (id: string) => Asset | undefined;
  getAssetBySymbol: (symbol: string) => Asset | undefined;
  updateAssetFromWebsocket: (updates: AssetUpdate | AssetUpdate[]) => void;
  setActivePair: (pair: string) => void;
  addPair: (pair: string) => void;
  removePair: (pair: string) => void;
  getActiveLeverage: () => number;
}

const DEFAULT_ASSET_SYMBOL = "BITSTAMP:BTCUSD";
const DEFAULT_PAIR = "BTC/USD";

const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: [],
      activeAsset: null,
      isLoading: false,
      error: null,
      groupedAssets: {},
      activePairs: [DEFAULT_PAIR],
      activePair: DEFAULT_PAIR,

      fetchAssets: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/assets");
          const assets = response.data.data as Asset[];

          const groupedAssets: Record<string, Asset[]> = {};
          assets.forEach((asset) => {
            if (!groupedAssets[asset.type]) {
              groupedAssets[asset.type] = [];
            }
            groupedAssets[asset.type].push(asset);
          });

          const currentActive = get().activeAsset;

          let defaultAsset = assets.find(
            (a) => a.tv_symbol === DEFAULT_ASSET_SYMBOL
          );

          if (!defaultAsset) {
            defaultAsset = assets.find((a) => a.sy === "AUD/JPY");
          }

          if (!defaultAsset && assets.length > 0) {
            defaultAsset = assets[0];
          }

          set({
            assets,
            groupedAssets,
            isLoading: false,
            activeAsset: currentActive || defaultAsset,
          });
        } catch (error) {
          console.log(error);
          set({
            isLoading: false,
            error: "Failed to fetch assets. Please try again later.",
          });
        }
      },

      setActiveAsset: (asset) => {
        set({ activeAsset: asset });
      },

      getAssetById: (id) => {
        return get().assets.find((asset) => asset.id === id);
      },

      getAssetBySymbol: (symbol) => {
        return get().assets.find((asset) => asset.tv_symbol === symbol);
      },

      updateAssetFromWebsocket: (updates) => {
        set((state) => {
          const updateArray = Array.isArray(updates) ? updates : [updates];

          if (updateArray.length === 0) {
            return state;
          }

          const assetsMap = new Map(
            state.assets.map((asset) => [asset.asset_id, asset])
          );

          const updatedAssets = [...state.assets];
          const updatedGroupedAssets = { ...state.groupedAssets };
          let updatedActiveAsset = null;

          updateArray.forEach((update) => {
            const asset = assetsMap.get(update.id);

            if (!asset) {
              return;
            }

            const updatedAsset = {
              ...asset,
              rate: update.price.toString(),
              ...(update.priceLow24h !== undefined && {
                price_low: update.priceLow24h.toString(),
              }),
              ...(update.priceHigh24h !== undefined && {
                price_high: update.priceHigh24h.toString(),
              }),
              ...(update.change24h !== undefined && {
                change: update.change24h.toString(),
              }),
              ...(update.changePercent24h !== undefined && {
                change_percent: update.changePercent24h.toString(),
              }),
              ...(update.volume24h !== undefined && {
                volume: update.volume24h ? update.volume24h.toString() : null,
              }),
              updated_at: update.lastUpdated,
              buy_price: update.price * (1 + Number(asset.buy_spread)),
              sell_price: update.price * (1 - Number(asset.sell_spread)),
            };

            const assetIndex = updatedAssets.findIndex(
              (a) => a.asset_id === update.id
            );

            if (assetIndex !== -1) {
              updatedAssets[assetIndex] = updatedAsset;

              if (
                state.activeAsset &&
                state.activeAsset.asset_id === update.id
              ) {
                updatedActiveAsset = updatedAsset;
              }

              const assetType = asset.type;
              if (updatedGroupedAssets[assetType]) {
                const groupIndex = updatedGroupedAssets[assetType].findIndex(
                  (a) => a.id === asset.id
                );
                if (groupIndex !== -1) {
                  updatedGroupedAssets[assetType][groupIndex] = updatedAsset;
                }
              }
            }
          });
          return {
            ...state,
            assets: updatedAssets,
            groupedAssets: updatedGroupedAssets,
            activeAsset: updatedActiveAsset || state.activeAsset,
          };
        });
      },

      setActivePair: (pair) => {
        set((state) => {
          const asset = state.assets.find((a) => a.symbol_display === pair);
          return {
            activePair: pair,
            activeAsset: asset || state.activeAsset,
          };
        });
      },

      addPair: (pair) => {
        set((state) => {
          if (state.activePairs.includes(pair)) {
            return state;
          }
          return {
            activePairs: [...state.activePairs, pair],
            activePair: pair,
          };
        });
        // Update active asset as well
        const asset = get().assets.find((a) => a.symbol_display === pair);
        if (asset) {
          get().setActiveAsset(asset);
        }
      },

      removePair: (pair) => {
        set((state) => {
          if (state.activePairs.length <= 1) {
            return state;
          }
          const newPairs = state.activePairs.filter((p) => p !== pair);
          const newActivePair =
            state.activePair === pair ? newPairs[0] : state.activePair;

          // Update active asset if needed
          if (state.activePair === pair) {
            const newAsset = state.assets.find(
              (a) => a.symbol_display === newPairs[0]
            );
            if (newAsset) {
              return {
                activePairs: newPairs,
                activePair: newPairs[0],
                activeAsset: newAsset,
              };
            }
          }

          return {
            activePairs: newPairs,
            activePair: newActivePair,
          };
        });
      },

      getActiveLeverage: () => {
        const { activeAsset } = get();

        // If no active asset, return default
        if (!activeAsset) return 20;

        try {
          // Get leverage data from dataStore
          const leverageData = useDataStore.getState().leverage;
          const user = useUserStore.getState().user;

          // Get the asset type
          const assetType = activeAsset.category;

          // Use type assertion to make TypeScript happy
          // This is safe since we know assetType is a valid key of AssetCat
          const leverageValue = leverageData[assetType as keyof AssetCat];

          // Return the leverage value with fallbacks
          return (
              (leverageValue) ||
              activeAsset.leverage ||
              user?.account_type?.leverage ||
              20
          );
        } catch (error) {
          console.error("Error retrieving leverage:", error);
          // Fallback to user account leverage or default
          const user = useUserStore.getState().user;
          return user?.account_type?.leverage || 20;
        }
      }

    }),
    {
      name: "asset-storage",
      partialize: (state) => ({
        activeAsset: state.activeAsset,
        activePairs: state.activePairs,
        activePair: state.activePair,
      }),
    }
  )
);

export default useAssetStore;

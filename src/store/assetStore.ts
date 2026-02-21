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
  spread: number;
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
  lastWebsocketUpdateByAsset: Record<string, number>;

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
const MIN_PRICE = Number.EPSILON;

function toFiniteNumber(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value.replace(/,/g, "").trim())
        : Number.NaN;

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function spreadToOffset(nextRate: number, spreadValue: number): number {
  if (!Number.isFinite(spreadValue) || spreadValue <= 0) {
    return 0;
  }

  // Some feeds send spread as ratio (< 1), others as absolute points (>= 1).
  return spreadValue < 1 ? nextRate * spreadValue : spreadValue;
}

function deriveBidAsk(asset: Asset, nextRate: number) {
  const safeRate = Math.max(nextRate, MIN_PRICE);
  const currentRate = toFiniteNumber(asset.rate);
  const currentBuy = toFiniteNumber(asset.buy_price);
  const currentSell = toFiniteNumber(asset.sell_price);
  const buySpread = toFiniteNumber(asset.buy_spread);
  const sellSpread = toFiniteNumber(asset.sell_spread);

  const fallbackBuyOffset = spreadToOffset(safeRate, buySpread);
  const fallbackSellOffset = spreadToOffset(safeRate, sellSpread);

  let buyOffset =
    Number.isFinite(currentRate) && Number.isFinite(currentBuy)
      ? currentBuy - currentRate
      : Number.NaN;
  let sellOffset =
    Number.isFinite(currentRate) && Number.isFinite(currentSell)
      ? currentRate - currentSell
      : Number.NaN;

  const maxReasonableOffset = safeRate * 0.2;

  if (!(buyOffset >= 0) || buyOffset > maxReasonableOffset) {
    buyOffset = fallbackBuyOffset;
  }

  if (!(sellOffset >= 0) || sellOffset > maxReasonableOffset) {
    sellOffset = fallbackSellOffset;
  }

  buyOffset = Math.max(Math.min(buyOffset, maxReasonableOffset), 0);
  sellOffset = Math.max(Math.min(sellOffset, maxReasonableOffset), 0);

  return {
    buyPrice: safeRate + buyOffset,
    sellPrice: Math.max(safeRate - sellOffset, MIN_PRICE),
  };
}

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
      lastWebsocketUpdateByAsset: {},

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
          const currentActivePair = get().activePair;

          let defaultAsset = assets.find(
            (a) => a.tv_symbol === DEFAULT_ASSET_SYMBOL
          );

          if (!defaultAsset) {
            defaultAsset = assets.find((a) => a.sy === "AUD/JPY");
          }

          if (!defaultAsset && assets.length > 0) {
            defaultAsset = assets[0];
          }

          const refreshedActiveById = currentActive
            ? assets.find(
                (asset) =>
                  asset.asset_id === currentActive.asset_id ||
                  asset.id === currentActive.id ||
                  asset.symbol_display === currentActive.symbol_display
              )
            : undefined;

          const refreshedActiveByPair = currentActivePair
            ? assets.find(
                (asset) =>
                  asset.symbol_display === currentActivePair ||
                  asset.sy === currentActivePair
              )
            : undefined;

          const nextActiveAsset =
            refreshedActiveById || refreshedActiveByPair || defaultAsset || null;

          set({
            assets,
            groupedAssets,
            isLoading: false,
            activeAsset: nextActiveAsset,
            activePair: nextActiveAsset?.symbol_display || currentActivePair,
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
        set((state) => ({
          activeAsset: asset,
          activePair: asset.symbol_display,
          activePairs: state.activePairs.includes(asset.symbol_display)
            ? state.activePairs
            : [...state.activePairs, asset.symbol_display]
        }));
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
          const updatedLastWebsocket = { ...state.lastWebsocketUpdateByAsset };
          let updatedActiveAsset = null;
          const now = Date.now();

          updateArray.forEach((update) => {
            const asset = assetsMap.get(update.id);

            if (!asset) {
              return;
            }

            const nextRate = update.price;
            const { buyPrice, sellPrice } = deriveBidAsk(asset, nextRate);

            const updatedAsset = {
              ...asset,
              rate: nextRate.toString(),
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
              buy_price: buyPrice,
              sell_price: sellPrice,
            };

            const assetIndex = updatedAssets.findIndex(
              (a) => a.asset_id === update.id
            );

            if (assetIndex !== -1) {
              updatedAssets[assetIndex] = updatedAsset;
              updatedLastWebsocket[update.id] = now;

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
            lastWebsocketUpdateByAsset: updatedLastWebsocket,
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
        activePairs: state.activePairs,
        activePair: state.activePair,
      }),
      merge: (persistedState, currentState) => {
        const incoming = persistedState as Partial<AssetStore>;
        return {
          ...currentState,
          ...incoming,
          // Prevent stale price objects from flashing on reload.
          activeAsset: currentState.activeAsset,
        };
      },
    }
  )
);

export default useAssetStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";

export interface Asset {
  id: string;
  asset_id: string;
  name: string;
  tv_symbol: string;
  symbol: string;
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
  type: "forex" | "crypto" | "stocks";
  buy_price: number;
  sell_price: number;
  created_at: string;
  updated_at: string;
}

interface AssetStore {
  assets: Asset[];
  activeAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  groupedAssets: Record<string, Asset[]>;

  fetchAssets: () => Promise<void>;
  setActiveAsset: (asset: Asset) => void;
  getAssetById: (id: string) => Asset | undefined;
  getAssetBySymbol: (symbol: string) => Asset | undefined;
}

// Default to BTC/USD if no active asset
const DEFAULT_ASSET_SYMBOL = "BITSTAMP:BTCUSD";

const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: [],
      activeAsset: null,
      isLoading: false,
      error: null,
      groupedAssets: {},

      fetchAssets: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log("Fetching assets...");
          const response = await axiosInstance.get("/assets");
          console.log("Assets API response:", response);
          const assets = response.data.data as Asset[];
          console.log("Parsed assets:", assets);

          // Group assets by type
          const groupedAssets: Record<string, Asset[]> = {};
          assets.forEach((asset) => {
            if (!groupedAssets[asset.type]) {
              groupedAssets[asset.type] = [];
            }
            groupedAssets[asset.type].push(asset);
          });
          console.log("Grouped assets:", groupedAssets);

          // Set default active asset if none is selected
          const currentActive = get().activeAsset;

          // Find a Bitcoin asset first (for default)
          let defaultAsset = assets.find(
            (a) => a.tv_symbol === DEFAULT_ASSET_SYMBOL
          );

          // If no Bitcoin asset, try to find a forex asset that matches AUD/JPY
          if (!defaultAsset) {
            defaultAsset = assets.find((a) => a.symbol_display === "AUD/JPY");
          }

          // If still no match, just use the first asset
          if (!defaultAsset && assets.length > 0) {
            defaultAsset = assets[0];
          }

          const finalAsset = currentActive || defaultAsset;
          console.log("Setting active asset:", finalAsset);

          set({
            assets,
            groupedAssets,
            isLoading: false,
            activeAsset: finalAsset,
          });
        } catch (error) {
          console.error("Failed to fetch assets:", error);
          set({
            isLoading: false,
            error: "Failed to fetch assets. Please try again later.",
          });
        }
      },

      setActiveAsset: (asset) => {
        console.log("Setting active asset:", asset);
        set({ activeAsset: asset });
      },

      getAssetById: (id) => {
        return get().assets.find((asset) => asset.id === id);
      },

      getAssetBySymbol: (symbol) => {
        return get().assets.find((asset) => asset.tv_symbol === symbol);
      },
    }),
    {
      name: "asset-storage",
      partialize: (state) => ({
        activeAsset: state.activeAsset,
      }),
    }
  )
);

export default useAssetStore;

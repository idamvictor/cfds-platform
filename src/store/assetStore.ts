import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import {AssetUpdate} from "@/hooks/useAssetWebsocket.ts";

export interface Asset {
  id: string;
  asset_id: string;
  name: string;
  tv_symbol: string;
  symbol: string;
  sy: string;
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
  updateAssetFromWebsocket: (update: AssetUpdate) => void;
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
              const response = await axiosInstance.get("/assets");
              const assets = response.data.data as Asset[];

              // Group assets by type
              const groupedAssets: Record<string, Asset[]> = {};
              assets.forEach((asset) => {
                if (!groupedAssets[asset.type]) {
                  groupedAssets[asset.type] = [];
                }
                groupedAssets[asset.type].push(asset);
              });

              // Set default active asset if none is selected
              const currentActive = get().activeAsset;

              // Find a Bitcoin asset first (for default)
              let defaultAsset = assets.find(
                  (a) => a.tv_symbol === DEFAULT_ASSET_SYMBOL
              );

              // If no Bitcoin asset, try to find a forex asset that matches AUD/JPY
              if (!defaultAsset) {
                defaultAsset = assets.find((a) => a.sy === "AUD/JPY");
              }

              // If still no match, just use the first asset
              if (!defaultAsset && assets.length > 0) {
                defaultAsset = assets[0];
              }

              const finalAsset = currentActive || defaultAsset;

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
            set({ activeAsset: asset });
          },

          getAssetById: (id) => {
            return get().assets.find((asset) => asset.id === id);
          },

          getAssetBySymbol: (symbol) => {
            return get().assets.find((asset) => asset.tv_symbol === symbol);
          },

          updateAssetFromWebsocket: (updates) => {
            set(state => {
              // If updates is not an array, convert it to an array for consistent handling
              const updateArray = Array.isArray(updates) ? updates : [updates];

              if (updateArray.length === 0) {
                return state;
              }

              // Create a copy of the assets array
              const updatedAssets = [...state.assets];
              const updatedGroupedAssets = { ...state.groupedAssets };
              let updatedActiveAsset = state.activeAsset;

              // Process each update
              updateArray.forEach(update => {
                // Find asset by asset_id
                const assetIndex = updatedAssets.findIndex(
                    asset => asset.asset_id === update.id
                );

                if (assetIndex === -1) {
                  console.log('not found asset', update.id);
                  return;
                }

                const asset = updatedAssets[assetIndex];

                // Update the asset with available fields
                updatedAssets[assetIndex] = {
                  ...asset,
                  rate: update.price.toString(),
                  ...(update.priceLow24h !== undefined && { price_low: update.priceLow24h.toString() }),
                  ...(update.priceHigh24h !== undefined && { price_high: update.priceHigh24h.toString() }),
                  ...(update.change24h !== undefined && { change: update.change24h.toString() }),
                  ...(update.changePercent24h !== undefined && { change_percent: update.changePercent24h.toString() }),
                  ...(update.volume24h !== undefined && { volume: update.volume24h ? update.volume24h.toString() : null }),
                  updated_at: update.lastUpdated,
                  buy_price: update.price * (1 + Number(asset.buy_spread)),
                  sell_price: update.price * (1 - Number(asset.sell_spread))
                };

                // Update active asset if needed
                if (state.activeAsset && state.activeAsset.id === asset.id) {
                  updatedActiveAsset = updatedAssets[assetIndex];
                }

                // Update grouped assets
                const assetType = asset.type;
                if (updatedGroupedAssets[assetType]) {
                  const groupIndex = updatedGroupedAssets[assetType].findIndex(
                      a => a.id === asset.id
                  );

                  if (groupIndex !== -1) {
                    updatedGroupedAssets[assetType][groupIndex] = updatedAssets[assetIndex];
                  }
                }
              });

              // Return the updated state
              return {
                ...state,
                assets: updatedAssets,
                activeAsset: updatedActiveAsset,
                groupedAssets: updatedGroupedAssets
              };
            });
          }


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

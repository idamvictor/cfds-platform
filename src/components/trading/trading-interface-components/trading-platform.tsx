import { useState, useEffect } from "react";
import Header from "./header";
import MainContent from "./main-content";
import useAssetStore from "@/store/assetStore";
import useTradeStore from "@/store/tradeStore";
import AssetInitializer from "../asset-initializer";
import AssetPriceStreamInitializer from "@/components/trading/AssetPriceStreamInitializer";
import { addClickSound } from "@/lib/addClickSound.ts";
import TradeRoomTicker from "../TradeRoomTicker";
import TradingStrengthModal from "../TradingStrengthModal";

export type ActiveView =
  | "market-watch"
  | "active-orders"
  | "trading-history"
  | "calendar"
  | "market-news"
  | null;

export default function TradingPlatform() {
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [activePairs, setActivePairs] = useState<string[]>(["AUD/JPY"]);
  const [activePair, setActivePair] = useState("AUD/JPY");
  const [tsModalOpen, setTsModalOpen] = useState(false);

  const { setActiveAsset, assets, fetchAssets, activeAsset } = useAssetStore();
  const { fetchOpenTrades, fetchClosedTrades } = useTradeStore();

  useEffect(() => {
    addClickSound();
  }, []);

  // Fetch assets and trades when component mounts
  useEffect(() => {
    fetchAssets();
    fetchOpenTrades();
    fetchClosedTrades();
  }, [fetchAssets, fetchOpenTrades, fetchClosedTrades]);

  // Update active pair when active asset changes
  useEffect(() => {
    if (activeAsset && activeAsset.sy) {
      setActivePair(activeAsset.sy);

      if (!activePairs.includes(activeAsset.sy)) {
        setActivePairs((prev) => [...prev, activeAsset.sy]);
      }
    }
  }, [activeAsset, activePairs]);

  const toggleView = (view: ActiveView) => {
    setActiveView(activeView === view ? null : view);
  };

  const addCurrencyPair = (pair: string) => {
    const asset = assets.find((a) => a.sy === pair);
    if (asset) {
      setActiveAsset(asset);
    }

    if (!activePairs.includes(pair)) {
      setActivePairs([...activePairs, pair]);
    }

    setActivePair(pair);
  };

  const removeCurrencyPair = (pair: string) => {
    if (activePairs.length > 1) {
      const newPairs = activePairs.filter((p) => p !== pair);
      setActivePairs(newPairs);

      if (activePair === pair) {
        setActivePair(newPairs[0]);

        const newAsset = assets.find((a) => a.sy === newPairs[0]);
        if (newAsset) {
          setActiveAsset(newAsset);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <AssetInitializer />
      <AssetPriceStreamInitializer />

      {/* Ticker Bar */}
      <TradeRoomTicker />

      {/* Top Bar */}
      <Header
        activePairs={activePairs}
        activePair={activePair}
        setActivePair={setActivePair}
        removeCurrencyPair={removeCurrencyPair}
        toggleView={toggleView}
        onTradingStrengthClick={() => setTsModalOpen(true)}
      />

      {/* Main Trade Layout: Chart + Right Panel + Bottom Panel */}
      <MainContent
        activeView={activeView}
        activePair={activePair}
        addCurrencyPair={addCurrencyPair}
        onClosePanel={() => setActiveView(null)}
        onToggleView={toggleView}
      />

      {/* Trading Strength Modal */}
      <TradingStrengthModal
        open={tsModalOpen}
        onOpenChange={setTsModalOpen}
      />
    </div>
  );
}

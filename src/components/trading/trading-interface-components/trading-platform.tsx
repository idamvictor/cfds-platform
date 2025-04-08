import { useState, useEffect } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import MainContent from "./main-content";
import useAssetStore from "@/store/assetStore";

export type ActiveView =
  | "market-watch"
  | "active-orders"
  | "trading-history"
  | "calendar"
  | "market-news"
  | null;

export default function TradingPlatform() {
  // Add more currency pairs for testing horizontal scrolling
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>("market-watch"); // Set market-watch as default view
  const [activePairs, setActivePairs] = useState<string[]>([
    "AUD/JPY",
    "AUD/CHF",
    "EUR/USD",
    "GBP/USD",
    "USD/CAD",
    "USD/JPY",
    "EUR/GBP",
  ]);
  const [activePair, setActivePair] = useState("AUD/CHF");

  const { setActiveAsset, assets, fetchAssets } = useAssetStore();

  // Fetch assets when component mounts
  useEffect(() => {
    console.log("TradingPlatform - Fetching assets");
    fetchAssets();
  }, [fetchAssets]);

  // Log assets when they change
  useEffect(() => {
    console.log("TradingPlatform - Assets loaded:", assets.length);
  }, [assets]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleView = (view: ActiveView) => {
    setActiveView(activeView === view ? null : view);
  };

  const addCurrencyPair = (pair: string) => {
    // Find the asset by symbol_display
    const asset = assets.find((a) => a.symbol_display === pair);
    console.log("Adding currency pair:", pair, "Found asset:", asset);

    if (asset) {
      setActiveAsset(asset);
    }

    if (!activePairs.includes(pair)) {
      setActivePairs([...activePairs, pair]);
      setActivePair(pair);
    } else {
      setActivePair(pair);
    }
  };

  const removeCurrencyPair = (pair: string) => {
    if (activePairs.length > 1) {
      const newPairs = activePairs.filter((p) => p !== pair);
      setActivePairs(newPairs);

      // If the removed pair was active, set the first pair as active
      if (activePair === pair) {
        setActivePair(newPairs[0]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        activePairs={activePairs}
        activePair={activePair}
        setActivePair={setActivePair}
        removeCurrencyPair={removeCurrencyPair}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          expanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
          activeView={activeView}
          toggleView={toggleView}
          addCurrencyPair={addCurrencyPair}
        />
        <MainContent
          sidebarExpanded={sidebarExpanded}
          activeView={activeView}
          activePair={activePair}
          addCurrencyPair={addCurrencyPair}
        />
      </div>
    </div>
  );
}

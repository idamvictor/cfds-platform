"use client";

import { useState, useEffect } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import MainContent from "./main-content";
import useAssetStore from "@/store/assetStore";
import useTradeStore from "@/store/tradeStore";
import AssetInitializer from "../asset-initializer";
import { useMobile } from "@/hooks/use-mobile";
import {addClickSound} from "@/lib/addClickSound.ts";
import Footer from "@/components/footer";

export type ActiveView =
  | "market-watch"
  | "active-orders"
  | "trading-history"
  | "calendar"
  | "market-news"
  | null;

export default function TradingPlatform() {
  // Start with just one default currency pair
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>(null); // Set to null by default (panels closed)
  const [activePairs, setActivePairs] = useState<string[]>(["AUD/JPY"]);
  const [activePair, setActivePair] = useState("AUD/JPY");
  const isMobile = useMobile(768);

  const { setActiveAsset, assets, fetchAssets, activeAsset } = useAssetStore();
  const { fetchOpenTrades, fetchClosedTrades } = useTradeStore();


  useEffect(() => {
    addClickSound();
  }, []);


  // Fetch assets and trades when component mounts
  useEffect(() => {
    console.log("TradingPlatform - Fetching assets and trades");
    fetchAssets();
    fetchOpenTrades();
    fetchClosedTrades();
  }, [fetchAssets, fetchOpenTrades, fetchClosedTrades]);

  // Log assets when they change
  useEffect(() => {
    console.log("TradingPlatform - Assets loaded:", assets.length);
  }, [assets]);

  // Update active pair when active asset changes
  useEffect(() => {
    if (activeAsset && activeAsset.sy) {
      // Update the active pair to match the active asset
      setActivePair(activeAsset.sy);

      // Make sure this pair is in the activePairs list
      if (!activePairs.includes(activeAsset.sy)) {
        setActivePairs((prev) => [...prev, activeAsset.sy]);
      }
    }
  }, [activeAsset, activePairs]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleView = (view: ActiveView) => {
    setActiveView(activeView === view ? null : view);
  };

  const addCurrencyPair = (pair: string) => {
    // Find the asset by sy
    const asset = assets.find((a) => a.sy === pair);
    console.log("Adding currency pair:", pair, "Found asset:", asset);

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

      // If the removed pair was active, set the first pair as active
      if (activePair === pair) {
        setActivePair(newPairs[0]);

        // Also update the active asset
        const newAsset = assets.find((a) => a.sy === newPairs[0]);
        if (newAsset) {
          setActiveAsset(newAsset);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AssetInitializer />
      <Header
        activePairs={activePairs}
        activePair={activePair}
        setActivePair={setActivePair}
        removeCurrencyPair={removeCurrencyPair}
        toggleView={toggleView}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Only show sidebar on desktop */}
        {!isMobile && (
          <Sidebar
            expanded={sidebarExpanded}
            toggleSidebar={toggleSidebar}
            activeView={activeView}
            toggleView={toggleView}
            addCurrencyPair={addCurrencyPair}
          />
        )}
        <MainContent
          sidebarExpanded={sidebarExpanded}
          activeView={activeView}
          activePair={activePair}
          addCurrencyPair={addCurrencyPair}
        />
      </div>
      <Footer />
    </div>
  );
}

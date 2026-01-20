import { useEffect, useRef, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import MainContent from "./main-content";
import useAssetStore from "@/store/assetStore";
import useTradeStore from "@/store/tradeStore";
import AssetInitializer from "../asset-initializer";
// import { useMobile } from "@/hooks/use-mobile";
import { addClickSound } from "@/lib/addClickSound.ts";
import Footer from "@/components/footer";

// Extracted for easy testing; adjust value to shorten the revert window when needed.
const NON_OPEN_REVERT_MS = 1 * 60 * 1000;

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
  // const isMobile = useMobile(768);
  // console.log("isMobile", isMobile);

  const { setActiveAsset, assets, fetchAssets, activeAsset } = useAssetStore();
  const { fetchOpenTrades, fetchClosedTrades, openTrades } = useTradeStore();

  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSyncedTradeId, setLastSyncedTradeId] = useState<string | null>(null);
  const lastNonOpenAssetRef = useRef<string | null>(null);

  useEffect(() => {
    addClickSound();
  }, []);

  // Fetch assets and trades when component mounts
  useEffect(() => {
    // console.log("TradingPlatform - Fetching assets and trades");
    fetchAssets();
    fetchOpenTrades();
    fetchClosedTrades();
  }, [fetchAssets, fetchOpenTrades, fetchClosedTrades]);

  // Log assets when they change
  // useEffect(() => {
  //   console.log("TradingPlatform - Assets loaded:", assets.length);
  // }, [assets]);

  const normalizeSymbol = (value?: string | null) =>
    value ? value.replace(/[^A-Za-z]/g, "").toUpperCase() : "";

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

  // Utility helpers for open trades alignment
  const findAssetForTrade = (tradeId?: string, tradeSymbol?: string) => {
    if (!tradeId && !tradeSymbol) return undefined;
    const normalizedTradeSymbol = normalizeSymbol(tradeSymbol);

    return assets.find((asset) => {
      const normalizedSy = normalizeSymbol(asset.sy);
      const normalizedDisplay = normalizeSymbol(asset.symbol_display);
      const normalizedSymbol = normalizeSymbol(asset.symbol);
      const normalizedTvSymbol = normalizeSymbol(asset.tv_symbol);

      return (
        asset.asset_id === tradeId ||
        asset.id === tradeId ||
        normalizedSy === normalizedTradeSymbol ||
        normalizedDisplay === normalizedTradeSymbol ||
        normalizedSymbol === normalizedTradeSymbol ||
        normalizedTvSymbol === normalizedTradeSymbol
      );
    });
  };

  const clearRevertTimer = () => {
    if (revertTimerRef.current) {
      clearTimeout(revertTimerRef.current);
      revertTimerRef.current = null;
    }
  };

  // When open trades arrive, default to the first trade's asset
  useEffect(() => {
    if (!openTrades.length) {
      return;
    }

    const firstTrade = openTrades[0];
    const matchingAsset = findAssetForTrade(firstTrade.asset_id, firstTrade.asset_symbol);

    if (matchingAsset && lastSyncedTradeId !== firstTrade.id) {
      setActiveAsset(matchingAsset);
      setLastSyncedTradeId(firstTrade.id);
    }
  }, [openTrades, assets, lastSyncedTradeId, setActiveAsset]);

  // If active asset is outside open trades, start a 10-minute timer to revert back
  useEffect(() => {
    if (!openTrades.length) {
      clearRevertTimer();
      lastNonOpenAssetRef.current = null;
      return;
    }

    const firstTrade = openTrades[0];
    const firstTradeAsset = findAssetForTrade(firstTrade.asset_id, firstTrade.asset_symbol);

    if (!firstTradeAsset) {
      return;
    }

    const activeInOpenTrades =
      !!activeAsset &&
      openTrades.some((trade) => {
        const tradeKey = normalizeSymbol(trade.asset_symbol);
        const activeKeySy = normalizeSymbol(activeAsset.sy);
        const activeKeyDisplay = normalizeSymbol(activeAsset.symbol_display);
        const activeKeySymbol = normalizeSymbol((activeAsset as { symbol?: string }).symbol);
        const activeKeyTv = normalizeSymbol((activeAsset as { tv_symbol?: string }).tv_symbol);

        return (
          trade.asset_id === activeAsset.asset_id ||
          trade.asset_id === activeAsset.id ||
          tradeKey === activeKeySy ||
          tradeKey === activeKeyDisplay ||
          tradeKey === activeKeySymbol ||
          tradeKey === activeKeyTv
        );
      });

    if (activeInOpenTrades) {
      clearRevertTimer();
      lastNonOpenAssetRef.current = null;
      return;
    }

    const activeAssetKey = activeAsset?.asset_id || activeAsset?.id || activeAsset?.sy || null;
    const timerMatchesActive =
      revertTimerRef.current && lastNonOpenAssetRef.current === activeAssetKey;

    if (!timerMatchesActive) {
      clearRevertTimer();
      lastNonOpenAssetRef.current = activeAssetKey;
      revertTimerRef.current = setTimeout(() => {
        // Recalculate target in case assets refresh while waiting
        const latestFirstTradeAsset = findAssetForTrade(firstTrade.asset_id, firstTrade.asset_symbol);
        if (latestFirstTradeAsset) {
          setActiveAsset(latestFirstTradeAsset);
        }
        revertTimerRef.current = null;
        lastNonOpenAssetRef.current = null;
      }, NON_OPEN_REVERT_MS);
    }
  }, [activeAsset, openTrades, assets, setActiveAsset]);

  useEffect(() => {
    return () => {
      clearRevertTimer();
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleView = (view: ActiveView) => {
    setActiveView(activeView === view ? null : view);
  };

  const addCurrencyPair = (pair: string) => {
    // Find the asset by sy
    const asset = assets.find((a) => a.sy === pair);
    // console.log("Adding currency pair:", pair, "Found asset:", asset);

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
        {/* {!isMobile && (
          <Sidebar
            expanded={sidebarExpanded}
            toggleSidebar={toggleSidebar}
            activeView={activeView}
            toggleView={toggleView}
            addCurrencyPair={addCurrencyPair}
          />
        )} */}

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
      <Footer />
    </div>
  );
}

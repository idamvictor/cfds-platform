import { useEffect } from "react";
import type { ActiveView } from "./trading-platform";
import MarketWatchPanel from "./panels/market-watch-panel";
import ActiveOrdersPanel from "./panels/active-orders-panel";
import TradingHistoryPanel from "./panels/trading-history-panel";
import CalendarPanel from "./panels/calendar-panel";
import MarketNewsPanel from "./panels/market-news-panel";
import { useMobile } from "@/hooks/use-mobile";
import TradingViewWidget from "./trading-view-widget";
import useAssetStore from "@/store/assetStore";
import TradingInterface from "../trading-interface";
import OrderTable from "../order-table";

interface MainContentProps {
  sidebarExpanded: boolean;
  activeView: ActiveView;
  activePair: string;
  addCurrencyPair: (pair: string) => void;
}

export default function MainContent({
  sidebarExpanded,
  activeView,
  addCurrencyPair,
}: MainContentProps) {
  const isMobile = useMobile();
  const isLargeScreen = useMobile(1024);

  const { activeAsset } = useAssetStore();
  console.log(sidebarExpanded);

  // Log when active asset changes
  useEffect(() => {
    console.log("MainContent - Active asset changed:", activeAsset);
  }, [activeAsset]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - shows based on active view (desktop only) */}
        {activeView && !isMobile && (
          <div className="w-[300px] border-r border-border overflow-y-auto hidden md:block">
            {activeView === "market-watch" && (
              <MarketWatchPanel addCurrencyPair={addCurrencyPair} />
            )}
            {activeView === "active-orders" && <ActiveOrdersPanel />}
            {activeView === "trading-history" && <TradingHistoryPanel />}
            {activeView === "calendar" && <CalendarPanel />}
            {activeView === "market-news" && <MarketNewsPanel />}
          </div>
        )}

        {/* Center - Chart and Orders */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden w-full">
          {/* Chart and Trading Interface */}
          <div className="flex flex-1 border-b border-border bg-background w-full">
            {/* Chart area */}
            <div className="flex-1 bg-background border-muted border-2 w-full">
              <TradingViewWidget />
            </div>

            {/* Trading Interface */}
            {!isLargeScreen && (
              <div className="w-[300px] border-2 border-border overflow-y-auto">
                <TradingInterface />
              </div>
            )}
          </div>

          {/* Orders table */}
          {isLargeScreen && (
            <div className="border-b-2 border-border w-full">
              <TradingInterface />
            </div>
          )}
          <div className="h-auto overflow-auto w-full">
            <OrderTable />
          </div>
        </div>
      </div>
    </div>
  );
}

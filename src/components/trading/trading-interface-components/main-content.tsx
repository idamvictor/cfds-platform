import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActiveView } from "./trading-platform";
import MarketWatchPanel from "./panels/market-watch-panel";
import ActiveOrdersPanel from "./panels/active-orders-panel";
import TradingHistoryPanel from "./panels/trading-history-panel";
import CalendarPanel from "./panels/calendar-panel";
import MarketNewsPanel from "./panels/market-news-panel";
import TradingChart from "../trading-chart";
import OrderTable from "../order-table";
import TradingInterface from "../trading-interface";

interface MainContentProps {
  sidebarExpanded: boolean;
  activeView: ActiveView;
  activePair: string;
  addCurrencyPair: (pair: string) => void;
}

export default function MainContent({
  sidebarExpanded,
  activeView,
  activePair,
  addCurrencyPair,
}: MainContentProps) {
  const [chartHeight, setChartHeight] = useState(60); // Percentage of the container height
  console.log(sidebarExpanded)
  console.log(activePair)

  const handleResizeChart = (increase: boolean) => {
    setChartHeight((prev) => {
      const newHeight = increase ? prev + 5 : prev - 5;
      return Math.min(Math.max(newHeight, 30), 80); // Keep between 30% and 80%
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - shows based on active view */}
        {activeView && (
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
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart area */}
          <div
            className="relative border-b border-border bg-background"
            style={{ height: `${chartHeight}%` }}
          >

            {/* Chart placeholder */}
            {/* <div className="w-full h-[calc(100%-40px)] flex items-center justify-center bg-background"> */}
            <div className="w-full h-full flex items-center justify-center bg-background">
              <TradingChart />
            </div>

            {/* Resize handle */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 -mb-2.5 z-10 rounded-full bg-background border border-border"
                  onClick={() => handleResizeChart(true)}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 z-10 rounded-full bg-background border border-border"
                  onClick={() => handleResizeChart(false)}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Orders table */}
          <div className="flex-1 overflow-auto">
            <OrderTable />
          </div>
        </div>

        {/* Right panel - Trading interface */}
        <div className="w-[300px] border-l border-border overflow-y-auto hidden lg:block px-3">

          <TradingInterface />
        </div>
      </div>
    </div>
  );
}

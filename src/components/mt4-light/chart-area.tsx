import { ChartTabs } from "./chart-area/ChartTabs";
import { useState } from "react";
import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";

interface ChartTab {
  pair: string;
  timeframe: string;
  isActive?: boolean;
}

export function ChartArea() {
  const [tabs, setTabs] = useState<ChartTab[]>([
    { pair: "EURUSD", timeframe: "Daily" },
    { pair: "EURUSD", timeframe: "M5", isActive: true },
    { pair: "GBPCHF", timeframe: "M5" },
    { pair: "AUDUSD", timeframe: "M5" },
  ]);

  const handleTabSelect = (selectedTab: ChartTab) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        isActive:
          tab.pair === selectedTab.pair &&
          tab.timeframe === selectedTab.timeframe,
      }))
    );
  };

  return (
    <div className="flex-1 bg-gray-50 border-b border-slate-400 ">
      <div className="h-[90%]">
        <TradingViewLightWidget />
      </div>
      <ChartTabs tabs={tabs} onSelectTab={handleTabSelect} />
    </div>
  );
}

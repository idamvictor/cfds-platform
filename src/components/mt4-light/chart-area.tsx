import { TradingChart } from "./TradingChart";
import { ChartTabs } from "./ChartTabs";
import { useState } from "react";

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
    <div className="flex-1 bg-gray-50 border-b border-slate-400 relative">
      <TradingChart />
      <ChartTabs tabs={tabs} onSelectTab={handleTabSelect} />
    </div>
  );
}

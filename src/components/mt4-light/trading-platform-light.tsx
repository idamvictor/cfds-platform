"use client";

import { TitleBar } from "./title-bar";
import { Toolbar } from "./toolbar";
// import { AITradingPanel } from "./ai-trading-panel";
import { ChartArea } from "./chart-area";
// import { TradingHistory } from "./trading-history";
import { StatusBar } from "./status-bar";
import MarketWatch from "./market-watch-light";
import PositionDisplayLight from "./position-display-light";
import AlgoTraderLight from "./algo-trader-light";
import TotalPortfolioLight from "./total-portfolio-light";

export function TradingPlatformLight() {
  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans text-sm">
      <TitleBar />
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-96 bg-white border-r border-slate-300 flex flex-col h-full">
          <div className="h-[75%] overflow-auto">
            <MarketWatch />
          </div>
          <div className="h-[25%] overflow-auto">
            <AlgoTraderLight />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <ChartArea />
        </div>
      </div>

      <TotalPortfolioLight />

      {/* <TradingHistory /> */}
      <PositionDisplayLight />

      <StatusBar />
    </div>
  );
}

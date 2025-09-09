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
import AutomatedTrading from "../mt4/right-panels/automated-trading";
import useOverlayStore from "@/store/overlayStore";

export function TradingPlatformLight() {
  const { automatedTrading, selectedAdvisorId } = useOverlayStore();

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
        <div className="flex-1 flex flex-col relative">
          <ChartArea />
          {/* Automated Trading Panel */}
          {automatedTrading && (
            <div className="top-0 left-0 z-50 absolute">
              <AutomatedTrading advisorId={selectedAdvisorId} />
            </div>
          )}
        </div>
      </div>

      <TotalPortfolioLight />

      {/* <TradingHistory /> */}
      <PositionDisplayLight />

      <StatusBar />
    </div>
  );
}

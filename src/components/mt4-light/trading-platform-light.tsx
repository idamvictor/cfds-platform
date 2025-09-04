"use client";

import { useState } from "react";
import { TitleBar } from "./title-bar";
import { Toolbar } from "./toolbar";
import { AITradingPanel } from "./ai-trading-panel";
import { ChartArea } from "./chart-area";
import { TradingHistory } from "./trading-history";
import { StatusBar } from "./status-bar";
import MarketWatch from "./market-watch";

export function TradingPlatformLight() {
  const [autoTrading, setAutoTrading] = useState(true);

  const aiTradingOptions = [
    { name: "Quant Bridge AI", icon: "🤖" },
    { name: "BlackRock Algo Pro", icon: "🤖" },
    { name: "Flux River AI Trader", icon: "🤖" },
  ];

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans text-sm">
      <TitleBar />
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-96 bg-white border-r border-slate-300 flex flex-col">
          <MarketWatch />
          <AITradingPanel
            autoTrading={autoTrading}
            onAutoTradingChange={setAutoTrading}
            aiTradingOptions={aiTradingOptions}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <ChartArea />
        </div>
      </div>

      <TradingHistory />
      <StatusBar />
    </div>
  );
}

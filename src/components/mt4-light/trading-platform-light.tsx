"use client";

import { useState } from "react";
import { TitleBar } from "./title-bar";
import { Toolbar } from "./toolbar";
import { MarketWatch } from "./market-watch";
import { AITradingPanel } from "./ai-trading-panel";
import { ChartArea } from "./chart-area";
import { TradingHistory } from "./trading-history";
import { StatusBar } from "./status-bar";

export function TradingPlatformLight() {
  const [autoTrading, setAutoTrading] = useState(true);

  const currencyPairs = [
    { symbol: "USDJPY", flag: "🇺🇸🇯🇵", bid: "136.279", ask: "136.291" },
    { symbol: "USDCAD", flag: "🇺🇸🇨🇦", bid: "1.36279", ask: "1.36291" },
    { symbol: "AUDUSD", flag: "🇦🇺🇺🇸", bid: "1.36279", ask: "1.36291" },
    { symbol: "EURGBP", flag: "🇪🇺🇬🇧", bid: "0.36279", ask: "0.36291" },
    { symbol: "EURGBP", flag: "🇪🇺🇬🇧", bid: "0.36279", ask: "0.36291" },
    { symbol: "EURGBP", flag: "🇪🇺🇬🇧", bid: "0.36279", ask: "0.36291" },
  ];

  const aiTradingOptions = [
    { name: "Quant Bridge AI", icon: "🤖" },
    { name: "BlackRock Algo Pro", icon: "🤖" },
    { name: "Flux River AI Trader", icon: "🤖" },
  ];

  const tradeHistory = [
    {
      order: "1602989",
      time: "2023.04.28-19:30:05",
      type: "Sell",
      size: "2.00",
      symbol: "gbpchf",
      price: "1.12259",
      sl: "1.8270660",
      tp: "1.8270660",
      currentPrice: "1.12425",
      commission: "0.00",
      swap: "-25.25",
      profit: "-371.16",
    },
    {
      order: "1602990",
      time: "2023.04.28-19:30:05",
      type: "Buy",
      size: "1.50",
      symbol: "eurusd",
      price: "1.08259",
      sl: "1.07660",
      tp: "1.09660",
      currentPrice: "1.08425",
      commission: "0.00",
      swap: "-15.25",
      profit: "245.16",
    },
    {
      order: "1602991",
      time: "2023.04.28-19:31:15",
      type: "Buy",
      size: "3.00",
      symbol: "usdjpy",
      price: "134.259",
      sl: "133.660",
      tp: "135.660",
      currentPrice: "134.425",
      commission: "0.00",
      swap: "-18.50",
      profit: "198.45",
    },
    {
      order: "1602992",
      time: "2023.04.28-19:32:30",
      type: "Sell",
      size: "1.75",
      symbol: "audusd",
      price: "0.66259",
      sl: "0.67660",
      tp: "0.64660",
      currentPrice: "0.66425",
      commission: "0.00",
      swap: "-12.75",
      profit: "-156.82",
    },
    {
      order: "1602993",
      time: "2023.04.28-19:33:45",
      type: "Buy",
      size: "2.25",
      symbol: "gbpusd",
      price: "1.24559",
      sl: "1.23660",
      tp: "1.25660",
      currentPrice: "1.24725",
      commission: "0.00",
      swap: "-22.00",
      profit: "287.34",
    },
  ];

  const accountHistory = [
    {
      order: "1602985",
      time: "2023.04.28-18:30:05",
      type: "Buy",
      size: "1.00",
      symbol: "eurusd",
      price: "1.08159",
      commission: "0.00",
      swap: "-5.25",
      profit: "125.16",
    },
    {
      order: "1602984",
      time: "2023.04.28-17:45:05",
      type: "Sell",
      size: "2.00",
      symbol: "gbpusd",
      price: "1.25159",
      commission: "0.00",
      swap: "-12.25",
      profit: "-89.16",
    },
    {
      order: "1602983",
      time: "2023.04.28-17:15:22",
      type: "Buy",
      size: "1.50",
      symbol: "usdjpy",
      price: "133.859",
      commission: "0.00",
      swap: "-8.75",
      profit: "156.45",
    },
    {
      order: "1602982",
      time: "2023.04.28-16:55:18",
      type: "Sell",
      size: "2.50",
      symbol: "eurjpy",
      price: "147.559",
      commission: "0.00",
      swap: "-15.50",
      profit: "-178.92",
    },
    {
      order: "1602981",
      time: "2023.04.28-16:30:45",
      type: "Buy",
      size: "1.75",
      symbol: "audusd",
      price: "0.65959",
      commission: "0.00",
      swap: "-9.25",
      profit: "143.28",
    },
  ];

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans text-sm">
      <TitleBar />
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-96 bg-white border-r border-slate-300 flex flex-col">
          <MarketWatch currencyPairs={currencyPairs} />
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

      <TradingHistory
        tradeHistory={tradeHistory}
        accountHistory={accountHistory}
      />
      <StatusBar />
    </div>
  );
}

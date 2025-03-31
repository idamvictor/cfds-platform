"use client";

import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import MainContent from "./main-content";

export type ActiveView =
  | "market-watch"
  | "active-orders"
  | "trading-history"
  | "calendar"
  | "market-news"
  | null;

export default function TradingPlatform() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [activePairs, setActivePairs] = useState<string[]>([
    "AUD/JPY",
    "AUD/CHF",
  ]);
  const [activePair, setActivePair] = useState("AUD/CHF");

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleView = (view: ActiveView) => {
    setActiveView(activeView === view ? null : view);
  };

  const addCurrencyPair = (pair: string) => {
    if (!activePairs.includes(pair)) {
      setActivePairs([...activePairs, pair]);
      setActivePair(pair);
    } else {
      setActivePair(pair);
    }
  };

  const removeCurrencyPair = (pair: string) => {
    if (activePairs.length > 1) {
      const newPairs = activePairs.filter((p) => p !== pair);
      setActivePairs(newPairs);

      // If the removed pair was active, set the first pair as active
      if (activePair === pair) {
        setActivePair(newPairs[0]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        activePairs={activePairs}
        activePair={activePair}
        setActivePair={setActivePair}
        removeCurrencyPair={removeCurrencyPair}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          expanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
          activeView={activeView}
          toggleView={toggleView}
        />
        <MainContent
          sidebarExpanded={sidebarExpanded}
          activeView={activeView}
          activePair={activePair}
          addCurrencyPair={addCurrencyPair}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { TitleBar } from "./title-bar";
import { Toolbar } from "./toolbar";
// import { AITradingPanel } from "./ai-trading-panel";
import { ChartArea } from "./chart-area";
import useDarkModeStore from "@/store/darkModeStore";
// import { TradingHistory } from "./trading-history";
import { StatusBar } from "./status-bar";
import MarketWatch from "./market-watch-light";
import PositionDisplayLight from "./position-display-light";
import AlgoTraderLight from "./algo-trader-light";
import TotalPortfolioLight from "./total-portfolio-light";
import AutomatedTrading from "../mt4/right-panels/automated-trading";
import useOverlayStore from "@/store/overlayStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import useSiteSettingsStore from "@/store/siteSettingStore";

export function TradingPlatformLight() {
  const { automatedTrading, selectedAdvisorId } = useOverlayStore();
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  const isMobile = useMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const settings = useSiteSettingsStore((state) => state.settings);

  const Sidebar = () => (
    <div
      className={`w-full md:w-96 ${
        isDarkMode
          ? "bg-slate-900 border-slate-600"
          : "bg-white border-slate-300"
      } border-r flex flex-col h-full`}
    >
      <div
        className={`${
          settings?.expert_advisor ? "h-[75%]" : "h-full"
        } overflow-auto`}
      >
        <MarketWatch />
      </div>
      {settings?.expert_advisor && (
        <div className="h-[25%] overflow-auto">
          <AlgoTraderLight />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`h-screen ${
        isDarkMode ? "bg-slate-950" : "bg-slate-100"
      } flex flex-col font-sans text-sm`}
    >
      <TitleBar />
      <Toolbar
        isMobile={isMobile}
        onToggleSidebar={() => setIsSheetOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sheet for Mobile */}
        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent side="left" className="p-0 w-full sm:w-96 z-">
              <Sidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar />
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col relative ${
            isDarkMode ? "bg-slate-900" : "bg-white"
          }`}
        >
          <ChartArea />
          {/* Automated Trading Panel */}
          {automatedTrading && (
            <div
              className={`top-0 left-0 z-50 absolute ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              <AutomatedTrading advisorId={selectedAdvisorId} />
            </div>
          )}
        </div>
      </div>

      {/* <TradingHistory /> */}
      <PositionDisplayLight />
      <TotalPortfolioLight />

      <StatusBar />
    </div>
  );
}

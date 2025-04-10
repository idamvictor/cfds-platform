import { useState, useEffect } from "react"
import { Maximize2, Camera, Settings, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ActiveView } from "./trading-platform"
import MarketWatchPanel from "./panels/market-watch-panel"
import ActiveOrdersPanel from "./panels/active-orders-panel"
import TradingHistoryPanel from "./panels/trading-history-panel"
import CalendarPanel from "./panels/calendar-panel"
import MarketNewsPanel from "./panels/market-news-panel"
import { useMobile } from "@/hooks/use-mobile"
import TradingViewWidget from "./trading-view-widget"
import useAssetStore from "@/store/assetStore"
import TradingInterface from "../trading-interface"
import OrderTable from "../order-table"

interface MainContentProps {
  sidebarExpanded: boolean
  activeView: ActiveView
  activePair: string
  addCurrencyPair: (pair: string) => void
}

export default function MainContent({ sidebarExpanded, activeView, activePair, addCurrencyPair }: MainContentProps) {
  const [chartHeight, setChartHeight] = useState(60) // Percentage of the container height
  const isMobile = useMobile()
  const isLargeScreen = useMobile(1024)

  const { activeAsset } = useAssetStore()
  console.log(sidebarExpanded)

  // Log when active asset changes
  useEffect(() => {
    console.log("MainContent - Active asset changed:", activeAsset)
  }, [activeAsset])


  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - shows based on active view (desktop only) */}
        {activeView && !isMobile && (
          <div className="w-[300px] border-r border-border overflow-y-auto hidden md:block">
            {activeView === "market-watch" && <MarketWatchPanel addCurrencyPair={addCurrencyPair} />}
            {activeView === "active-orders" && <ActiveOrdersPanel />}
            {activeView === "trading-history" && <TradingHistoryPanel />}
            {activeView === "calendar" && <CalendarPanel />}
            {activeView === "market-news" && <MarketNewsPanel />}
          </div>
        )}

        {/* Center - Chart and Orders */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart area */}
          <div className="relative border-b border-border bg-background h-full">
            {/* TradingView Chart */}
            <div className="w-full h-full bg-background border-muted border-[3px]">
              <TradingViewWidget />
            </div>
          </div>

          {/* Mobile Trading Interface - between chart and table */}
          {isLargeScreen && (
            <div className="border-b border-border">
              <TradingInterface />
            </div>
          )}

          {/* Orders table */}
          {/* <div className={`${isLargeScreen ? "h-auto" : "h-[200px]"} overflow-auto`}> */}
          <div className="h-auto overflow-auto">
            <OrderTable />
          </div>
        </div>

        {/* Right panel - Trading interface (only visible on desktop) */}
        {!isLargeScreen && (
          <div className="w-[300px] border-l border-border overflow-y-auto">
            <TradingInterface />
          </div>
        )}
      </div>
    {/* <Toaster /> */}
    </div>
  )
}

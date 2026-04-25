import type { ActiveView } from "./trading-platform";
import MarketWatchPanel from "./panels/market-watch-panel";
import ActiveOrdersPanel from "./panels/active-orders-panel";
import TradingHistoryPanel from "./panels/trading-history-panel";
import CalendarPanel from "./panels/calendar-panel";
import MarketNewsPanel from "./panels/market-news-panel";
import { useMobile } from "@/hooks/use-mobile";
import TradingViewWidget from "./trading-view-widget";
import TradingInterface from "../trading-interface";
import OrderTable from "../order-table";
import ChartToolbar from "../ChartToolbar";
import OrderBookPanel from "../OrderBookPanel";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  activeView: ActiveView;
  activePair: string;
  addCurrencyPair: (pair: string) => void;
  onClosePanel: () => void;
  onToggleView: (view: NonNullable<ActiveView>) => void;
}

export default function MainContent({
  activeView,
  addCurrencyPair,
  onClosePanel,
  onToggleView,
}: MainContentProps) {
  const isMobile = useMobile(768);

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Side panel overlay for mobile when a view is active */}
      {activeView && isMobile && (
        <SidePanelOverlay
          activeView={activeView}
          addCurrencyPair={addCurrencyPair}
          onClose={onClosePanel}
        />
      )}

      {/* Main grid: Chart + Right Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] min-h-0 overflow-hidden">
        {/* Left: Chart Panel */}
        <div className="flex flex-col min-w-0 min-h-0 border-r border-[rgba(255,255,255,0.06)]">
          <ChartToolbar activeView={activeView} onToggleView={onToggleView} />
          <div className="flex-1 min-h-0">
            <TradingViewWidget />
          </div>
        </div>

        {/* Right: Order Book + Order Form (desktop only) */}
        <div className="hidden lg:flex flex-col min-h-0 overflow-hidden bg-[rgba(255,255,255,0.02)]">
          {/* Order Book */}
          <div className="flex-1 min-h-0 overflow-y-auto border-b border-[rgba(255,255,255,0.06)]">
            <OrderBookPanel />
          </div>
          {/* Order Form */}
          <div className="border-t border-[rgba(255,255,255,0.06)] overflow-y-auto" style={{ maxHeight: "50%" }}>
            <TradingInterface />
          </div>
        </div>
      </div>

      {/* Mobile Order Form */}
      <div className="lg:hidden border-t border-[rgba(255,255,255,0.06)]">
        <TradingInterface />
      </div>

      {/* Bottom Panel: Orders Table */}
      <div className="border-t border-[rgba(255,255,255,0.06)] max-h-[180px] overflow-hidden">
        <OrderTable />
      </div>

      {/* Desktop side panel (when active view is set, shows as overlay on left) */}
      {activeView && !isMobile && (
        <SidePanelOverlay
          activeView={activeView}
          addCurrencyPair={addCurrencyPair}
          onClose={onClosePanel}
        />
      )}
    </div>
  );
}

function SidePanelOverlay({
  activeView,
  addCurrencyPair,
  onClose,
}: {
  activeView: NonNullable<ActiveView>;
  addCurrencyPair: (pair: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute left-0 top-0 h-full w-[320px] border-r border-[rgba(255,255,255,0.06)] shadow-xl overflow-y-auto"
        style={{
          background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)",
          color: "#eef2f7",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b border-[rgba(255,255,255,0.06)]">
          <span className="text-sm font-semibold capitalize text-[#eef2f7]">
            {activeView.replace("-", " ")}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#8b97a8] hover:text-[#eef2f7] hover:bg-[rgba(255,255,255,0.06)]" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeView === "market-watch" && (
            <MarketWatchPanel addCurrencyPair={addCurrencyPair} />
          )}
          {activeView === "active-orders" && <ActiveOrdersPanel />}
          {activeView === "trading-history" && <TradingHistoryPanel />}
          {activeView === "calendar" && <CalendarPanel />}
          {activeView === "market-news" && <MarketNewsPanel />}
        </div>
      </div>
    </div>
  );
}

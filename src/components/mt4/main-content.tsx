import ChartArea from "./main-content/chart-area";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import AutomatedTrading from "./right-panels/automated-trading";
import useOverlayStore from "@/store/overlayStore";
import PositionDisplay from "./main-content/position-display";
import RightPanels from "./main-content/right-panels";

export default function MainContent() {
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const isMobile = useMobile(768);
  const { automatedTrading } = useOverlayStore();

  return (
    <main className="flex-1 flex flex-col h-full">
      {/* Chart and Right Panels Container */}
      <div className="flex flex-1 min-h-0 relative">
        <ChartArea />

        {/* Automated Trading Panel */}
        {automatedTrading && (
          <div className="absolute z-30">
            <AutomatedTrading />
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsRightPanelVisible(!isRightPanelVisible)}
          className="absolute right-0 top-8 z-50 bg-slate-700 hover:bg-slate-600 
            text-slate-300 p-1 rounded-l-md shadow-lg border border-slate-600"
        >
          {isRightPanelVisible ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Right Panels with conditional classes */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            isMobile
              ? "fixed right-0 top-0 bottom-0 z-40" // Mobile overlay
              : "relative", // Desktop inline
            !isRightPanelVisible &&
              (isMobile ? "translate-x-full" : "w-0 opacity-0"),
            isRightPanelVisible &&
              (isMobile ? "translate-x-0" : "w-80 opacity-100")
          )}
        >
          <RightPanels />
        </div>

        {/* Overlay for mobile */}
        {isMobile && isRightPanelVisible && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsRightPanelVisible(false)}
          />
        )}
      </div>

      {/* Position Display - Full width of main content */}
      <PositionDisplay />
    </main>
  );
}

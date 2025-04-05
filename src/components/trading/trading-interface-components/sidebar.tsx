// import {
//   LineChart,
//   Clock,
//   BarChart3,
//   Calendar,
//   Newspaper,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import type { ActiveView } from "./trading-platform";

// interface SidebarProps {
//   expanded: boolean;
//   toggleSidebar: () => void;
//   activeView: ActiveView;
//   toggleView: (view: ActiveView) => void;
// }

// export default function Sidebar({
//   expanded,
//   toggleSidebar,
//   activeView,
//   toggleView,
// }: SidebarProps) {
//   const sidebarItems = [
//     { id: "market-watch", label: "MARKET WATCH", icon: LineChart },
//     { id: "active-orders", label: "ACTIVE ORDERS", icon: BarChart3 },
//     { id: "trading-history", label: "TRADING HISTORY", icon: Clock },
//     { id: "calendar", label: "CALENDAR", icon: Calendar },
//     { id: "market-news", label: "MARKET NEWS", icon: Newspaper },
//   ];

//   return (
//     <div
//       className={cn(
//         "flex flex-col bg-background border-r border-border transition-all duration-300 relative",
//         expanded ? "w-[92px]" : "w-[60px]"
//       )}
//     >
//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-border bg-background z-10"
//         onClick={toggleSidebar}
//       >
//         {expanded ? (
//           <ChevronLeft className="h-3 w-3" />
//         ) : (
//           <ChevronRight className="h-3 w-3" />
//         )}
//       </Button>

//       <div className="flex flex-col items-center py-4 space-y-6">
//         {sidebarItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = activeView === item.id;

//           return (
//             <button
//               key={item.id}
//               className={cn(
//                 "flex flex-col items-center justify-center w-full py-2 px-1 transition-colors",
//                 isActive
//                   ? "text-primary bg-primary/10"
//                   : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
//               )}
//               onClick={() => toggleView(item.id as ActiveView)}
//             >
//               <Icon className="h-5 w-5 mb-1" />
//               <span
//                 className={cn(
//                   "text-[9px] font-medium transition-all",
//                   expanded ? "opacity-100" : "opacity-0 h-0"
//                 )}
//               >
//                 {item.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  LineChart,
  Clock,
  BarChart3,
  Calendar,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import type { ActiveView } from "./trading-platform";
import MarketWatchPanel from "./panels/market-watch-panel";
import ActiveOrdersPanel from "./panels/active-orders-panel";
import TradingHistoryPanel from "./panels/trading-history-panel";
import CalendarPanel from "./panels/calendar-panel";
import MarketNewsPanel from "./panels/market-news-panel";

// Update the SidebarProps interface to include addCurrencyPair
interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
  activeView: ActiveView;
  toggleView: (view: ActiveView) => void;
  addCurrencyPair: (pair: string) => void;
}

// Then update the function signature to include the new prop
export default function Sidebar({
  expanded,
  toggleSidebar,
  activeView,
  toggleView,
  addCurrencyPair,
}: SidebarProps) {
  const isMobile = useMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("isMobile", isMobileMenuOpen);
  
  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  const sidebarItems = [
    { id: "market-watch", label: "MARKET WATCH", icon: LineChart },
    { id: "active-orders", label: "ACTIVE ORDERS", icon: BarChart3 },
    { id: "trading-history", label: "TRADING HISTORY", icon: Clock },
    { id: "calendar", label: "CALENDAR", icon: Calendar },
    { id: "market-news", label: "MARKET NEWS", icon: Newspaper },
  ];

  // Mobile sidebar with Sheet component
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar - collapsed state (icons only) */}
        <div className="flex flex-col bg-background border-r border-border w-[60px] z-10">
          <div className="flex flex-col items-center py-4 space-y-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  className={cn(
                    "flex flex-col items-center justify-center w-full py-2 px-1 transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => toggleView(item.id as ActiveView)}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile sidebar - expanded state (overlay) */}
        {activeView && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => toggleView(activeView)}
          >
            <div
              className="absolute left-[60px] top-0 h-full w-[300px] bg-background border-r border-border overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {activeView === "market-watch" && (
                <MobilePanelWrapper
                  title="Market Watch"
                  onClose={() => toggleView(activeView)}
                >
                  <MarketWatchPanel addCurrencyPair={addCurrencyPair} />
                </MobilePanelWrapper>
              )}
              {activeView === "active-orders" && (
                <MobilePanelWrapper
                  title="Active Orders"
                  onClose={() => toggleView(activeView)}
                >
                  <ActiveOrdersPanel />
                </MobilePanelWrapper>
              )}
              {activeView === "trading-history" && (
                <MobilePanelWrapper
                  title="Trading History"
                  onClose={() => toggleView(activeView)}
                >
                  <TradingHistoryPanel />
                </MobilePanelWrapper>
              )}
              {activeView === "calendar" && (
                <MobilePanelWrapper
                  title="Calendar"
                  onClose={() => toggleView(activeView)}
                >
                  <CalendarPanel />
                </MobilePanelWrapper>
              )}
              {activeView === "market-news" && (
                <MobilePanelWrapper
                  title="Market News"
                  onClose={() => toggleView(activeView)}
                >
                  <MarketNewsPanel />
                </MobilePanelWrapper>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "flex flex-col bg-background border-r border-border transition-all duration-300 relative",
        expanded ? "w-[92px]" : "w-[60px]"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-border bg-background z-10"
        onClick={toggleSidebar}
      >
        {expanded ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>

      <div className="flex flex-col items-center py-4 space-y-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-center justify-center w-full py-2 px-1 transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => toggleView(item.id as ActiveView)}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span
                className={cn(
                  "text-[9px] font-medium transition-all",
                  expanded ? "opacity-100" : "opacity-0 h-0"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Helper component for mobile panel headers
function MobilePanelWrapper({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-medium">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}


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
import type { ActiveView } from "./trading-platform";

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
  activeView: ActiveView;
  toggleView: (view: ActiveView) => void;
}

export default function Sidebar({
  expanded,
  toggleSidebar,
  activeView,
  toggleView,
}: SidebarProps) {
  const sidebarItems = [
    { id: "market-watch", label: "MARKET WATCH", icon: LineChart },
    { id: "active-orders", label: "ACTIVE ORDERS", icon: BarChart3 },
    { id: "trading-history", label: "TRADING HISTORY", icon: Clock },
    { id: "calendar", label: "CALENDAR", icon: Calendar },
    { id: "market-news", label: "MARKET NEWS", icon: Newspaper },
  ];

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

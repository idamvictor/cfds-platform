import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, LineChart, Clock, Calendar, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { ActiveView } from "./trading-interface-components/trading-platform";

const TIMEFRAMES = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"] as const;
const INDICATORS = ["SMA", "EMA", "BOLL", "VOL"] as const;

const PANEL_BUTTONS: {
  view: NonNullable<ActiveView>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { view: "active-orders", label: "Active Orders", icon: BarChart3 },
  { view: "trading-history", label: "History", icon: Clock },
  { view: "calendar", label: "Calendar", icon: Calendar },
  { view: "market-news", label: "News", icon: Newspaper },
];

interface ChartToolbarProps {
  activeView?: ActiveView;
  onToggleView?: (view: NonNullable<ActiveView>) => void;
}

export default function ChartToolbar({
  activeView,
  onToggleView,
}: ChartToolbarProps) {
  const navigate = useNavigate();
  const [activeTimeframe, setActiveTimeframe] = useState("1H");
  const [activeChartType, setActiveChartType] = useState<"candle" | "line">("candle");

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/20 bg-muted/30 shrink-0">
      {/* Timeframe buttons */}
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
            activeTimeframe === tf
              ? "bg-emerald-500/10 text-emerald-500"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          onClick={() => setActiveTimeframe(tf)}
        >
          {tf}
        </button>
      ))}

      {/* Separator */}
      <div className="w-px h-3.5 bg-border/40 mx-1" />

      {/* Chart type */}
      <button
        className={cn(
          "p-1 rounded transition-colors",
          activeChartType === "candle"
            ? "bg-emerald-500/10 text-emerald-500"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setActiveChartType("candle")}
      >
        <BarChart3 className="h-3 w-3" />
      </button>
      <button
        className={cn(
          "p-1 rounded transition-colors",
          activeChartType === "line"
            ? "bg-emerald-500/10 text-emerald-500"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setActiveChartType("line")}
      >
        <LineChart className="h-3 w-3" />
      </button>

      {/* Separator */}
      <div className="w-px h-3.5 bg-border/40 mx-1" />

      {/* Indicators */}
      {INDICATORS.map((ind) => (
        <button
          key={ind}
          className="px-2 py-0.5 rounded text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {ind}
        </button>
      ))}

      {/* Separator — panels group */}
      {onToggleView && (
        <>
          <div className="w-px h-3.5 bg-border/40 mx-1 ml-auto" />

          {/* Market Watch — navigates to /main/market instead of toggling a panel */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-1 rounded transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => navigate("/main/market")}
              >
                <LineChart className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Market Watch</TooltipContent>
          </Tooltip>

          {PANEL_BUTTONS.map(({ view, label, icon: Icon }) => (
            <Tooltip key={view}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "p-1 rounded transition-colors",
                    activeView === view
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => onToggleView(view)}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
          ))}
        </>
      )}
    </div>
  );
}

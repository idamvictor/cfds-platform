import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import useTradeStore from "@/store/tradeStore";

interface TradingStrengthIndicatorProps {
  onClick?: () => void;
}

export default function TradingStrengthIndicator({ onClick }: TradingStrengthIndicatorProps) {
  const accountSummary = useTradeStore((state) => state.accountSummary);

  // Parse margin level (comes as string like "250.00%" or a number)
  const rawLevel = accountSummary?.marginLevel;
  let pct = 75; // default
  if (rawLevel) {
    const parsed = typeof rawLevel === "string" ? parseFloat(rawLevel) : rawLevel;
    if (!isNaN(parsed)) {
      // Clamp to 0-100 for display; marginLevel can be >100%
      pct = Math.min(100, Math.max(0, parsed > 200 ? 100 : (parsed / 200) * 100));
    }
  }

  const state =
    pct > 60 ? "strong" : pct > 40 ? "moderate" : pct > 20 ? "caution" : "critical";

  const colorMap = {
    strong: { text: "text-emerald-500", bg: "bg-emerald-500", fill: "bg-emerald-500" },
    moderate: { text: "text-blue-500", bg: "bg-blue-500", fill: "bg-blue-500" },
    caution: { text: "text-orange-500", bg: "bg-orange-500", fill: "bg-orange-500" },
    critical: { text: "text-red-500", bg: "bg-red-500", fill: "bg-red-500" },
  };

  const colors = colorMap[state];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1 rounded-lg",
        "bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
      )}
      title="Trading Strength"
    >
      <Zap className={cn("h-3 w-3", colors.text)} />
      <div className="w-10 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-400", colors.fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={cn("font-mono text-[10px] font-bold", colors.text)}>
        {Math.round(pct)}%
      </span>
    </button>
  );
}

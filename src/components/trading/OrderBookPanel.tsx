import { useState } from "react";
import { cn } from "@/lib/utils";
import OrderBook from "./OrderBook";

export default function OrderBookPanel() {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border/20 bg-muted/20 shrink-0">
        <button
          className={cn(
            "flex-1 py-2 text-center text-[11px] font-bold transition-colors border-b-2 border-transparent",
            activeTab === "book"
              ? "text-emerald-500 border-emerald-500"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("book")}
        >
          Order Book
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-center text-[11px] font-bold transition-colors border-b-2 border-transparent",
            activeTab === "trades"
              ? "text-emerald-500 border-emerald-500"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("trades")}
        >
          Trades
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "book" ? (
          <OrderBook />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-4">
            No recent trades
          </div>
        )}
      </div>
    </div>
  );
}

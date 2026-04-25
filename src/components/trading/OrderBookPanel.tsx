import { useState } from "react";
import { cn } from "@/lib/utils";
import OrderBook from "./OrderBook";

export default function OrderBookPanel() {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] shrink-0">
        <button
          className={cn(
            "flex-1 py-2 text-center text-[11px] font-bold transition-colors border-b-2 border-transparent",
            activeTab === "book"
              ? "text-[#00dfa2] border-[#00dfa2]"
              : "text-[#8b97a8] hover:text-[#eef2f7]"
          )}
          onClick={() => setActiveTab("book")}
        >
          Order Book
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-center text-[11px] font-bold transition-colors border-b-2 border-transparent",
            activeTab === "trades"
              ? "text-[#00dfa2] border-[#00dfa2]"
              : "text-[#8b97a8] hover:text-[#eef2f7]"
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
          <div className="flex items-center justify-center h-full text-xs text-[#4a5468] p-4">
            No recent trades
          </div>
        )}
      </div>
    </div>
  );
}

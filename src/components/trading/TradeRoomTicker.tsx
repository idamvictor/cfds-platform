import { useMemo } from "react";
import useAssetStore from "@/store/assetStore";

export default function TradeRoomTicker() {
  const assets = useAssetStore((state) => state.assets);

  const tickerItems = useMemo(() => {
    if (!assets.length) return [];
    // Pick up to 20 assets for the ticker
    return assets.slice(0, 20).map((a) => ({
      sym: a.sy || a.symbol_display || a.symbol,
      price: Number(a.rate || 0),
      change: Number(a.change_percent || a.change || 0),
    }));
  }, [assets]);

  if (!tickerItems.length) return null;

  // Duplicate items for seamless infinite scroll
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.05)] overflow-hidden whitespace-nowrap h-7 flex items-center shrink-0">
      <div className="inline-flex animate-ticker-scroll hover:[animation-play-state:paused]">
        {doubled.map((item, i) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 px-4 border-r border-[rgba(255,255,255,0.05)]"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isUp ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="font-mono text-[10px] font-bold text-[#eef2f7]">
                {item.sym}
              </span>
              <span className="font-mono text-[10px] text-[#8b97a8]">
                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`font-mono text-[10px] font-bold ${
                  isUp ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {isUp ? "+" : ""}
                {item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

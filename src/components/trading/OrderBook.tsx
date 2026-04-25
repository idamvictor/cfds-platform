import { useState, useEffect, useCallback } from "react";
import useAssetStore from "@/store/assetStore";

interface OrderRow {
  price: string;
  size: string;
  total: string;
  depthPct: number;
}

export default function OrderBook() {
  const activeAsset = useAssetStore((state) => state.activeAsset);
  const basePrice = Number(activeAsset?.rate || 0);

  const generateRows = useCallback((): { asks: OrderRow[]; bids: OrderRow[]; spread: string } => {
    if (basePrice <= 0) {
      return { asks: [], bids: [], spread: "—" };
    }

    const asks: OrderRow[] = [];
    const bids: OrderRow[] = [];
    const dp = basePrice > 100 ? 2 : basePrice > 1 ? 4 : 6;

    for (let i = 0; i < 8; i++) {
      const askP = basePrice + (i + 1) * (Math.random() * basePrice * 0.0003 + basePrice * 0.0001);
      const bidP = basePrice - (i + 1) * (Math.random() * basePrice * 0.0003 + basePrice * 0.0001);
      const askS = (Math.random() * 1.5 + 0.01).toFixed(4);
      const bidS = (Math.random() * 1.5 + 0.01).toFixed(4);

      asks.push({
        price: askP.toFixed(dp),
        size: askS,
        total: (askP * parseFloat(askS)).toFixed(2),
        depthPct: 0,
      });
      bids.push({
        price: bidP.toFixed(dp),
        size: bidS,
        total: (bidP * parseFloat(bidS)).toFixed(2),
        depthPct: 0,
      });
    }

    // Calculate depth percentages
    const maxAskTotal = Math.max(...asks.map((a) => parseFloat(a.total)));
    const maxBidTotal = Math.max(...bids.map((b) => parseFloat(b.total)));
    asks.forEach((a) => (a.depthPct = (parseFloat(a.total) / maxAskTotal) * 100));
    bids.forEach((b) => (b.depthPct = (parseFloat(b.total) / maxBidTotal) * 100));

    // Reverse asks so highest price is at top
    asks.reverse();

    const spreadVal = Math.abs(
      parseFloat(asks[asks.length - 1]?.price || "0") - parseFloat(bids[0]?.price || "0")
    );

    return {
      asks,
      bids,
      spread: spreadVal.toFixed(dp),
    };
  }, [basePrice]);

  const [data, setData] = useState(() => generateRows());

  useEffect(() => {
    setData(generateRows());
    const interval = setInterval(() => setData(generateRows()), 4000);
    return () => clearInterval(interval);
  }, [generateRows]);

  if (basePrice <= 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-[#4a5468] p-4">
        Select an asset to view order book
      </div>
    );
  }

  return (
    <div className="px-2.5 py-2 text-xs">
      {/* Header */}
      <div className="grid grid-cols-3 gap-1 px-0.5 pb-1.5 text-[9px] font-bold uppercase tracking-wider text-[#4a5468]">
        <span>Price</span>
        <span>Size</span>
        <span>Total</span>
      </div>

      {/* Ask side (red) */}
      {data.asks.map((row, i) => (
        <div key={`ask-${i}`} className="grid grid-cols-3 gap-1 py-0.5 px-0.5 relative font-mono text-[11px]">
          <div
            className="absolute inset-y-0 right-0 bg-red-500/8 rounded-sm"
            style={{ width: `${row.depthPct}%` }}
          />
          <span className="text-red-500 relative z-10">{row.price}</span>
          <span className="text-[#8b97a8] relative z-10">{row.size}</span>
          <span className="text-[#8b97a8] relative z-10">{row.total}</span>
        </div>
      ))}

      {/* Spread */}
      <div className="text-center py-1.5 text-[10px] text-[#8b97a8] font-semibold border-y border-[rgba(255,255,255,0.06)] my-1">
        Spread: <span className="font-mono font-bold text-[#eef2f7]">{data.spread}</span>
      </div>

      {/* Bid side (green) */}
      {data.bids.map((row, i) => (
        <div key={`bid-${i}`} className="grid grid-cols-3 gap-1 py-0.5 px-0.5 relative font-mono text-[11px]">
          <div
            className="absolute inset-y-0 right-0 bg-emerald-500/8 rounded-sm"
            style={{ width: `${row.depthPct}%` }}
          />
          <span className="text-emerald-500 relative z-10">{row.price}</span>
          <span className="text-[#8b97a8] relative z-10">{row.size}</span>
          <span className="text-[#8b97a8] relative z-10">{row.total}</span>
        </div>
      ))}
    </div>
  );
}

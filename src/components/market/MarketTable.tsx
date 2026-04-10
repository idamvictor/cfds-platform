import { useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Asset } from "@/store/assetStore";

export interface TableQuote {
  rate: number;
  changePercent: number;
}

export interface MarketTab<T extends string = string> {
  key: T;
  label: string;
}

interface MarketTableProps<T extends string> {
  tabs: readonly MarketTab<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  assets: Asset[];
  getQuote: (asset: Asset) => TableQuote;
  onTradeClick: (asset: Asset, e?: React.MouseEvent) => void;
  formatPrice: (price: number) => string;
  formatVolume: (vol: string | null) => string;
  formatMarketCap: (cap: string | null) => string;
  maxRows?: number;
}

function Sparkline({
  positive,
  width = 160,
  height = 56,
}: {
  positive: boolean;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    c.width = width * dpr;
    c.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pts: number[] = [];
    let v = 20 + Math.random() * 16;
    for (let j = 0; j < 30; j++) {
      v += (Math.random() - 0.48) * 3 * (positive ? 1.1 : 0.9);
      v = Math.max(6, Math.min(height - 6, v));
      pts.push(v);
    }

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    for (let j = 0; j < pts.length; j++) {
      const x = j * (width / 29);
      if (j === 0) ctx.moveTo(x, pts[j]);
      else ctx.lineTo(x, pts[j]);
    }
    ctx.strokeStyle = positive ? "#1ED760" : "#f43f5e";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, positive ? "rgba(30,215,96,.12)" : "rgba(244,63,94,.12)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fill();
  }, [positive, width, height]);

  return <canvas ref={canvasRef} style={{ width, height, display: "block" }} />;
}

export function MarketTable<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  assets,
  getQuote,
  onTradeClick,
  formatPrice,
  formatVolume,
  formatMarketCap,
  maxRows = 50,
}: MarketTableProps<T>) {
  return (
    <div
      className="mb-7 overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.06)]"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
      }}
    >
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] px-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-[0.74rem] font-bold transition-colors ${
                active
                  ? "border-[#00dfa2] text-[#00dfa2]"
                  : "border-transparent text-[#4a5468] hover:text-[#eef2f7]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                "#",
                "Asset",
                "Price",
                "24h Change",
                "24h Volume",
                "Market Cap",
                "7d Chart",
                "",
              ].map((label, i) => (
                <th
                  key={i}
                  className={`px-4 py-2.5 text-left text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#4a5468] ${
                    i === 4 ? "hidden md:table-cell" : ""
                  } ${i === 5 || i === 6 ? "hidden lg:table-cell" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-[0.85rem] text-[#4a5468]"
                >
                  No assets found
                </td>
              </tr>
            ) : (
              assets.slice(0, maxRows).map((asset, i) => {
                const quote = getQuote(asset);
                const chg = quote.changePercent;
                const up = chg >= 0;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => onTradeClick(asset)}
                    className="cursor-pointer border-b border-[rgba(255,255,255,0.04)] transition-colors last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]"
                  >
                    <td className="px-4 py-3 text-[0.74rem] text-[#4a5468]">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-extrabold text-[#00dfa2]"
                          style={{ background: "rgba(0,223,162,0.1)" }}
                        >
                          {(asset.sy || asset.symbol).substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-[0.78rem] font-bold text-[#eef2f7]">
                            {asset.sy || asset.symbol}
                          </div>
                          <div className="text-[0.66rem] text-[#4a5468]">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[0.78rem] font-bold text-[#eef2f7]">
                      ${formatPrice(quote.rate)}
                    </td>
                    <td
                      className={`px-4 py-3 font-mono text-[0.78rem] font-bold ${
                        up ? "text-[#00dfa2]" : "text-[#f43f5e]"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {up ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {up ? "+" : ""}
                        {chg.toFixed(2)}%
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-[0.74rem] text-[#4a5468] md:table-cell">
                      {formatVolume(asset.volume)}
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-[0.74rem] text-[#4a5468] lg:table-cell">
                      {formatMarketCap(asset.market_cap)}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <Sparkline positive={up} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => onTradeClick(asset, e)}
                        className="rounded-md border border-[rgba(0,223,162,0.15)] bg-[rgba(0,223,162,0.1)] px-3 py-1 text-[0.64rem] font-bold text-[#00dfa2] transition-colors hover:bg-[#00dfa2] hover:text-[#07080c]"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

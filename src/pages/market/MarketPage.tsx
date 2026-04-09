import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Search,
  Landmark,
  Flame,
  Newspaper,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import useAssetStore, { type Asset } from "@/store/assetStore";
import { useMarketWatchSyntheticTicker } from "@/hooks/useMarketWatchSyntheticTicker";

// ---------------------------------------------------------------------------
// Static / mock data for sections with no existing API
// ---------------------------------------------------------------------------

const GLOBAL_INDICES = [
  { name: "S&P 500", sym: "SPX", val: 5582.24, chg: 0.45, pts: "+24.82", flag: "\u{1F1FA}\u{1F1F8}" },
  { name: "NASDAQ", sym: "IXIC", val: 17648.3, chg: 1.02, pts: "+178.40", flag: "\u{1F1FA}\u{1F1F8}" },
  { name: "Dow Jones", sym: "DJI", val: 42188.12, chg: -0.22, pts: "-92.40", flag: "\u{1F1FA}\u{1F1F8}" },
  { name: "FTSE 100", sym: "UKX", val: 8124.5, chg: 0.31, pts: "+25.18", flag: "\u{1F1EC}\u{1F1E7}" },
];

const MARKET_STATS = [
  { label: "Total Market Cap", value: "$2.87T", sub: "+1.24%", subColor: "text-emerald-500" },
  { label: "24h Volume", value: "$142.8B", sub: "Global trading", subColor: "text-muted-foreground" },
  { label: "BTC Dominance", value: "52.4%", sub: "-0.3%", subColor: "text-red-500" },
  { label: "Active Coins", value: "12,847", sub: "Listed assets", subColor: "text-muted-foreground" },
  { label: "Fear & Greed", value: "72", sub: "Greed", subColor: "text-emerald-500", valueColor: "text-emerald-500" },
];

const MOCK_NEWS = [
  { tag: "breaking" as const, title: "Bitcoin Surges Past $67K as Institutional Demand Hits Record High", excerpt: "Major financial institutions have increased their BTC allocations by 40% this quarter, driving unprecedented demand in spot markets.", src: "Bloomberg", time: "12 min ago" },
  { tag: "analysis" as const, title: "Federal Reserve Signals Potential Rate Cut in Q3 2026", excerpt: "Fed Chair hints at easing monetary policy as inflation shows sustained cooling trend toward the 2% target.", src: "Reuters", time: "34 min ago" },
  { tag: "bullish" as const, title: "Ethereum ETF Inflows Surge to $2.1B in Single Week", excerpt: "Ethereum exchange-traded funds see record-breaking inflows as institutional investors diversify crypto portfolios beyond Bitcoin.", src: "CoinDesk", time: "1h ago" },
  { tag: "alert" as const, title: "SEC Approves New Crypto Regulatory Framework", excerpt: "The Securities and Exchange Commission has approved a comprehensive digital asset regulatory framework, providing clarity for exchanges.", src: "WSJ", time: "2h ago" },
  { tag: "analysis" as const, title: "Solana DeFi TVL Crosses $12B Milestone", excerpt: "Solana\u2019s total value locked in decentralized finance protocols reaches all-time high amid growing ecosystem activity.", src: "The Block", time: "3h ago" },
  { tag: "breaking" as const, title: "NASDAQ Futures Point to Higher Open Amid Tech Rally", excerpt: "Pre-market indicators suggest strong opening as AI and semiconductor stocks lead the charge in extended hours trading.", src: "CNBC", time: "4h ago" },
];

const TAG_STYLES: Record<string, string> = {
  breaking: "bg-red-500/10 text-red-500",
  analysis: "bg-blue-500/10 text-blue-400",
  bullish: "bg-emerald-500/10 text-emerald-500",
  alert: "bg-orange-500/10 text-orange-400",
};

// Tab filter keys that map to asset.type values
const MARKET_TABS = [
  { key: "all", label: "All Markets" },
  { key: "crypto", label: "Crypto" },
  { key: "forex", label: "Forex" },
  { key: "indices", label: "Indices" },
  { key: "commodities", label: "Commodities" },
  { key: "gainers", label: "Gainers" },
  { key: "losers", label: "Losers" },
] as const;

type TabKey = (typeof MARKET_TABS)[number]["key"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
}

function formatVolume(vol: string | null): string {
  if (!vol) return "-";
  const n = Number(vol);
  if (!Number.isFinite(n) || n === 0) return "-";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function formatMarketCap(cap: string | null): string {
  if (!cap) return "-";
  const n = Number(cap);
  if (!Number.isFinite(n) || n === 0) return "-";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

// ---------------------------------------------------------------------------
// Sparkline (canvas-based mini chart)
// ---------------------------------------------------------------------------

function Sparkline({ positive, width = 80, height = 28 }: { positive: boolean; width?: number; height?: number }) {
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

// ---------------------------------------------------------------------------
// UTC Clock
// ---------------------------------------------------------------------------

function UtcClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const n = new Date();
      setTime(
        `${String(n.getUTCHours()).padStart(2, "0")}:${String(n.getUTCMinutes()).padStart(2, "0")}:${String(n.getUTCSeconds()).padStart(2, "0")} UTC`
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono text-xs text-muted-foreground font-medium">{time}</span>;
}

// ---------------------------------------------------------------------------
// MarketPage
// ---------------------------------------------------------------------------

export default function MarketPage() {
  const navigate = useNavigate();
  const assets = useAssetStore((s) => s.assets);
  const setActiveAsset = useAssetStore((s) => s.setActiveAsset);
  const isLoading = useAssetStore((s) => s.isLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  // Synthetic ticker for live price updates
  const { getDisplayQuote } = useMarketWatchSyntheticTicker(assets);

  // ------ Filtered & sorted assets for heatmap + table ------
  const filteredAssets = useMemo(() => {
    let list = [...assets];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.symbol.toLowerCase().includes(q) ||
          a.sy.toLowerCase().includes(q) ||
          a.symbol_display.toLowerCase().includes(q)
      );
    }

    // Tab filter
    if (activeTab === "gainers") {
      list = list.filter((a) => Number(a.change_percent || 0) > 0);
      list.sort((a, b) => Number(b.change_percent || 0) - Number(a.change_percent || 0));
    } else if (activeTab === "losers") {
      list = list.filter((a) => Number(a.change_percent || 0) < 0);
      list.sort((a, b) => Number(a.change_percent || 0) - Number(b.change_percent || 0));
    } else if (activeTab !== "all") {
      list = list.filter((a) => a.type === activeTab);
    }

    return list;
  }, [assets, searchTerm, activeTab]);

  // Top crypto assets for the heatmap
  const heatmapAssets = useMemo(() => {
    return assets
      .filter((a) => a.type === "crypto")
      .slice(0, 18);
  }, [assets]);

  const handleTradeClick = useCallback(
    (asset: Asset, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setActiveAsset(asset);
      navigate("/trading");
    },
    [setActiveAsset, navigate]
  );

  // ------ Render ------

  if (isLoading && assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-muted-foreground text-sm">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground">
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6">

        {/* ─── Header ─── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-emerald-500" />
            Markets
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 w-[200px] sm:w-[240px] text-xs bg-white/[.03] border-white/[.06] focus:border-emerald-500"
              />
            </div>
            <UtcClock />
          </div>
        </div>

        {/* ─── Global Indices ─── */}
        <SectionTitle icon={<Landmark className="h-3.5 w-3.5" />} title="Global Indices" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {GLOBAL_INDICES.map((idx) => {
            const up = idx.chg >= 0;
            return (
              <div
                key={idx.sym}
                className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[.05] to-white/[.02] p-4 cursor-pointer transition-all duration-150 hover:border-white/10 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between mb-2 relative">
                  <span className="text-xs font-bold">{idx.name}</span>
                  <span className="text-sm">{idx.flag}</span>
                </div>
                <div className="font-mono text-lg font-extrabold mb-1 relative">
                  {idx.val.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2 relative">
                  <span className={cn("font-mono text-xs font-bold", up ? "text-emerald-500" : "text-red-500")}>
                    {up ? "+" : ""}{idx.chg.toFixed(2)}%
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{idx.pts}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Market Stats Strip ─── */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {MARKET_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[.04] bg-white/[.02] p-3.5 text-center"
            >
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                {stat.label}
              </div>
              <div className={cn("font-mono text-base font-extrabold", stat.valueColor)}>
                {stat.value}
              </div>
              <div className={cn("text-[10px] mt-0.5", stat.subColor)}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ─── Heatmap ─── */}
        {heatmapAssets.length > 0 && (
          <>
            <SectionTitle icon={<Flame className="h-3.5 w-3.5" />} title="Market Heatmap" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-1.5 mb-7">
              {heatmapAssets.map((asset) => {
                const quote = getDisplayQuote(asset);
                const chg = quote.changePercent;
                const up = chg >= 0;
                const strong = Math.abs(chg) > 3;
                return (
                  <div
                    key={asset.id}
                    onClick={() => handleTradeClick(asset)}
                    className={cn(
                      "relative overflow-hidden rounded-lg py-3 px-2.5 text-center cursor-pointer border border-transparent transition-all duration-150 hover:scale-[1.03] hover:z-10 hover:border-white/10",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 rounded-lg",
                        up ? "bg-emerald-500" : "bg-red-500",
                        strong ? "opacity-[.22]" : "opacity-[.12]"
                      )}
                    />
                    <div className="relative">
                      <div className="text-[11px] font-extrabold mb-1">{asset.sy || asset.symbol}</div>
                      <div className={cn("font-mono text-xs font-extrabold", up ? "text-emerald-500" : "text-red-500")}>
                        {up ? "+" : ""}{chg.toFixed(2)}%
                      </div>
                      <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
                        ${formatPrice(quote.rate)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ─── Market Table ─── */}
        <div className="rounded-xl border border-white/5 bg-gradient-to-br from-white/[.04] to-white/[.01] overflow-hidden mb-7">
          {/* Tabs */}
          <div className="flex border-b border-white/[.04] px-4 bg-white/[.015] overflow-x-auto">
            {MARKET_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab.key
                    ? "text-emerald-500 border-emerald-500"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-left">#</th>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-left">Asset</th>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-left">Price</th>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-left">24h Change</th>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-left hidden md:table-cell">24h Volume</th>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-left hidden lg:table-cell">Market Cap</th>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-left hidden lg:table-cell">7d Chart</th>
                  <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2.5 text-right" />
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                      No assets found
                    </td>
                  </tr>
                ) : (
                  filteredAssets.slice(0, 50).map((asset, i) => {
                    const quote = getDisplayQuote(asset);
                    const chg = quote.changePercent;
                    const up = chg >= 0;
                    return (
                      <tr
                        key={asset.id}
                        onClick={() => handleTradeClick(asset)}
                        className="cursor-pointer border-b border-white/[.02] transition-colors hover:bg-white/[.02]"
                      >
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/[.06] flex items-center justify-center text-[9px] font-extrabold text-emerald-500 shrink-0">
                              {(asset.sy || asset.symbol).substring(0, 2)}
                            </div>
                            <div>
                              <div className="text-xs font-bold">{asset.sy || asset.symbol}</div>
                              <div className="text-[10px] text-muted-foreground">{asset.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs font-bold">
                          ${formatPrice(quote.rate)}
                        </td>
                        <td className={cn("px-4 py-2.5 font-mono text-xs font-bold", up ? "text-emerald-500" : "text-red-500")}>
                          <span className="inline-flex items-center gap-1">
                            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {up ? "+" : ""}{chg.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground hidden md:table-cell">
                          {formatVolume(asset.volume)}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground hidden lg:table-cell">
                          {formatMarketCap(asset.market_cap)}
                        </td>
                        <td className="px-4 py-2.5 hidden lg:table-cell">
                          <Sparkline positive={up} />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={(e) => handleTradeClick(asset, e)}
                            className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/15 transition-colors hover:bg-emerald-500 hover:text-background"
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

        {/* ─── Market News ─── */}
        <SectionTitle icon={<Newspaper className="h-3.5 w-3.5" />} title="Market Updates" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
          {MOCK_NEWS.map((news, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-gradient-to-br from-white/[.04] to-white/[.015] p-4 cursor-pointer transition-all duration-150 hover:border-white/10 hover:-translate-y-0.5"
            >
              <span className={cn("inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2", TAG_STYLES[news.tag])}>
                {news.tag}
              </span>
              <div className="text-sm font-bold mb-1.5 leading-snug">{news.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2">{news.excerpt}</div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <span className="font-bold text-muted-foreground">{news.src}</span>
                <span>&bull;</span>
                <span>{news.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section title helper
// ---------------------------------------------------------------------------

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="text-sm font-extrabold mb-3 flex items-center gap-2">
      <span className="text-emerald-500">{icon}</span>
      {title}
    </h2>
  );
}

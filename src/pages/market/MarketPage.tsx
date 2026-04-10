import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, Flame, Newspaper } from "lucide-react";
import useAssetStore, { type Asset } from "@/store/assetStore";
import { useMarketWatchSyntheticTicker } from "@/hooks/useMarketWatchSyntheticTicker";

import { TickerBar } from "@/components/dashboard/TickerBar";
import { MarketSidebar } from "@/components/market/MarketSidebar";
import { MarketHeader } from "@/components/market/MarketHeader";
import { MarketSection } from "@/components/market/MarketSection";
import { GlobalIndicesRow } from "@/components/market/GlobalIndicesRow";
import { MarketStatsStrip } from "@/components/market/MarketStatsStrip";
import { MarketHeatmap } from "@/components/market/MarketHeatmap";
import { MarketTable } from "@/components/market/MarketTable";
import { MarketNewsGrid } from "@/components/market/MarketNewsGrid";

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
  { label: "Total Market Cap", value: "$2.87T", sub: "+1.24%", subColor: "text-[#00dfa2]" },
  { label: "24h Volume", value: "$142.8B", sub: "Global trading", subColor: "text-[#4a5468]" },
  { label: "BTC Dominance", value: "52.4%", sub: "-0.3%", subColor: "text-[#f43f5e]" },
  { label: "Active Coins", value: "12,847", sub: "Listed assets", subColor: "text-[#4a5468]" },
  { label: "Fear & Greed", value: "72", sub: "Greed", subColor: "text-[#00dfa2]", valueColor: "text-[#00dfa2]" },
];

const MOCK_NEWS = [
  { tag: "breaking" as const, title: "Bitcoin Surges Past $67K as Institutional Demand Hits Record High", excerpt: "Major financial institutions have increased their BTC allocations by 40% this quarter, driving unprecedented demand in spot markets.", src: "Bloomberg", time: "12 min ago" },
  { tag: "analysis" as const, title: "Federal Reserve Signals Potential Rate Cut in Q3 2026", excerpt: "Fed Chair hints at easing monetary policy as inflation shows sustained cooling trend toward the 2% target.", src: "Reuters", time: "34 min ago" },
  { tag: "bullish" as const, title: "Ethereum ETF Inflows Surge to $2.1B in Single Week", excerpt: "Ethereum exchange-traded funds see record-breaking inflows as institutional investors diversify crypto portfolios beyond Bitcoin.", src: "CoinDesk", time: "1h ago" },
  { tag: "alert" as const, title: "SEC Approves New Crypto Regulatory Framework", excerpt: "The Securities and Exchange Commission has approved a comprehensive digital asset regulatory framework, providing clarity for exchanges.", src: "WSJ", time: "2h ago" },
  { tag: "analysis" as const, title: "Solana DeFi TVL Crosses $12B Milestone", excerpt: "Solana\u2019s total value locked in decentralized finance protocols reaches all-time high amid growing ecosystem activity.", src: "The Block", time: "3h ago" },
  { tag: "breaking" as const, title: "NASDAQ Futures Point to Higher Open Amid Tech Rally", excerpt: "Pre-market indicators suggest strong opening as AI and semiconductor stocks lead the charge in extended hours trading.", src: "CNBC", time: "4h ago" },
];

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
// Helpers (UNCHANGED)
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
// MarketPage
// ---------------------------------------------------------------------------

export default function MarketPage() {
  const navigate = useNavigate();
  const assets = useAssetStore((s) => s.assets);
  const setActiveAsset = useAssetStore((s) => s.setActiveAsset);
  const isLoading = useAssetStore((s) => s.isLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Synthetic ticker for live price updates (UNCHANGED)
  const { getDisplayQuote } = useMarketWatchSyntheticTicker(assets);

  // Hide MainLayout chrome while this page is mounted
  useEffect(() => {
    document.body.classList.add("market-active");
    return () => {
      document.body.classList.remove("market-active");
    };
  }, []);

  // ------ Filtered & sorted assets for heatmap + table (UNCHANGED) ------
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

  // Top crypto assets for the heatmap (UNCHANGED)
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

  return (
    <>
      {/* Hide the global MainLayout chrome on this route only */}
      <style>{`
        body.market-active .fixed.top-0.left-0.right-0.z-20,
        body.market-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.market-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.market-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }
      `}</style>

      <div
        className="fixed inset-0 z-30 flex flex-col font-[Inter,-apple-system,sans-serif]"
        style={{
          background:
            "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)",
          color: "#eef2f7",
        }}
      >
        {/* Top scrolling ticker bar */}
        <TickerBar />

        {/* Page wrap: market sidebar + main */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-[60px_1fr] min-h-0">
          <MarketSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="overflow-y-auto px-4 py-7 md:px-8" style={{ maxHeight: "100%" }}>
            {isLoading && assets.length === 0 ? (
              <div className="flex h-[60vh] items-center justify-center">
                <div className="text-sm text-[#4a5468]">Loading market data...</div>
              </div>
            ) : (
              <>
                {/* Header — title + search + clock */}
                <MarketHeader
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onToggleSidebar={() => setIsSidebarOpen(true)}
                />

                {/* Global Indices */}
                <MarketSection icon={<Landmark className="h-3.5 w-3.5" />} title="Global Indices" />
                <GlobalIndicesRow indices={GLOBAL_INDICES} />

                {/* Stats Strip */}
                <MarketStatsStrip stats={MARKET_STATS} />

                {/* Heatmap */}
                {heatmapAssets.length > 0 && (
                  <>
                    <MarketSection icon={<Flame className="h-3.5 w-3.5" />} title="Market Heatmap" />
                    <MarketHeatmap
                      assets={heatmapAssets}
                      getQuote={getDisplayQuote}
                      onAssetClick={handleTradeClick}
                      formatPrice={formatPrice}
                    />
                  </>
                )}

                {/* Market Table */}
                <MarketTable
                  tabs={MARKET_TABS}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  assets={filteredAssets}
                  getQuote={getDisplayQuote}
                  onTradeClick={handleTradeClick}
                  formatPrice={formatPrice}
                  formatVolume={formatVolume}
                  formatMarketCap={formatMarketCap}
                />

                {/* Market News */}
                <MarketSection icon={<Newspaper className="h-3.5 w-3.5" />} title="Market Updates" />
                <MarketNewsGrid news={MOCK_NEWS} />
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

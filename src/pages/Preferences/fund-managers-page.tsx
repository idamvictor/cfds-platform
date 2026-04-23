import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  CheckCircle,
  Info,
  Menu,
  X,
} from "lucide-react";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { TickerBar } from "@/components/dashboard/TickerBar";

/* ──────────────────────────────────────────────────────────────
   PRESENTATIONAL DEMO CONSTANTS
   The reference (html_files/fund-managers.html) itself embeds a
   hardcoded managers array and a demo leaderboard fallback — it
   shows a "representative demo data" notice by design.
   These values are copied verbatim from the reference so the UI
   matches 1:1. NO store, NO service, NO API, NO external fetch.
   Pure presentation.
   ────────────────────────────────────────────────────────────── */

interface Manager {
  id: number;
  name: string;
  role: string;
  roi: number;
  aum: number;
  followers: number;
  winRate: number;
  since: string;
  mgmtFee: number;
  perfFee: number;
  monthlyReturns: number[];
}

const MANAGERS: Manager[] = [
  {
    id: 1,
    name: "Alexander Kovac",
    role: "Verified",
    roi: 127.4,
    aum: 78.5,
    followers: 1203,
    winRate: 92.3,
    since: "Jan 2024",
    mgmtFee: 1.5,
    perfFee: 15,
    monthlyReturns: [8, 12, -2, 15, 18, 9, 11, 16, 7, 14, 21, 11],
  },
  {
    id: 2,
    name: "Maria Santoro",
    role: "Verified",
    roi: 89.2,
    aum: 45.2,
    followers: 876,
    winRate: 85.6,
    since: "Mar 2023",
    mgmtFee: 1.0,
    perfFee: 20,
    monthlyReturns: [6, 8, 10, 7, 9, 11, 8, 12, 10, 6, 9, 7],
  },
  {
    id: 3,
    name: "James Chen",
    role: "Verified",
    roi: 156.8,
    aum: 120.0,
    followers: 1547,
    winRate: 88.2,
    since: "Jul 2022",
    mgmtFee: 2.0,
    perfFee: 25,
    monthlyReturns: [12, 15, 9, 18, 22, 16, 13, 19, 14, 20, 17, 15],
  },
  {
    id: 4,
    name: "Sarah Williams",
    role: "Verified",
    roi: 203.4,
    aum: 89.7,
    followers: 2103,
    winRate: 91.0,
    since: "Sep 2022",
    mgmtFee: 1.75,
    perfFee: 20,
    monthlyReturns: [14, 18, 12, 20, 25, 19, 16, 22, 18, 24, 21, 19],
  },
  {
    id: 5,
    name: "David Park",
    role: "Verified",
    roi: 78.5,
    aum: 56.3,
    followers: 923,
    winRate: 84.2,
    since: "Dec 2023",
    mgmtFee: 1.25,
    perfFee: 15,
    monthlyReturns: [5, 7, 9, 6, 8, 10, 7, 9, 8, 11, 10, 8],
  },
  {
    id: 6,
    name: "Lisa Rosenberg",
    role: "Verified",
    roi: 245.6,
    aum: 145.8,
    followers: 3012,
    winRate: 89.8,
    since: "May 2022",
    mgmtFee: 2.5,
    perfFee: 30,
    monthlyReturns: [16, 20, 14, 22, 28, 21, 18, 25, 20, 26, 23, 21],
  },
];

interface LbTrader {
  rank: number;
  uid: string;
  name: string;
  initials: string;
  roi: number;
  pnl: number;
  winRate: number;
  txCount: number;
  followers: number;
  addr: string;
}

// Demo leaderboard data — same shape as the reference's lbDemoData().
const LB_DEMO_NAMES = [
  "CryptoWhale_BSC",
  "AlphaTrader",
  "BullRunKing",
  "SatoshiPro",
  "DeFi_Master",
  "BSC_Legend",
  "HodlGod",
  "MoonSniper",
  "WhaleAlert",
  "GreenCandle",
  "PolyBull",
  "NightTrader",
  "LayerZero_X",
  "PumpKing",
  "SolFlash",
  "ArbMaster",
  "BTCMaxi",
  "ETHGhost",
  "ChainBreaker",
  "ZeroDelta",
];

type Period = "7d" | "30d" | "90d" | "all";

// Deterministic, per-period presentational leaderboard datasets.
// Each period gets its own baseline so the tabs visibly change content, but
// NO network fetching, NO store, NO service. Reference behavior is "swap
// visible data on period change"; we honor that with local constants.
function buildLeaderboardFor(period: Period): LbTrader[] {
  // Per-period scaling + offset so each tab renders a distinct dataset.
  const profile = {
    "7d":  { roiBase: 380, roiStep: 17, pnlBase: 2_800_000, pnlStep: 120_000, winBase: 91, txBase: 820, txStep: 35, folBase: 12_400, folStep: 520 },
    "30d": { roiBase: 520, roiStep: 22, pnlBase: 4_100_000, pnlStep: 175_000, winBase: 89, txBase: 2_640, txStep: 118, folBase: 13_200, folStep: 540 },
    "90d": { roiBase: 710, roiStep: 31, pnlBase: 6_900_000, pnlStep: 285_000, winBase: 87, txBase: 6_800, txStep: 310, folBase: 14_050, folStep: 580 },
    "all": { roiBase: 980, roiStep: 42, pnlBase: 11_500_000, pnlStep: 470_000, winBase: 85, txBase: 18_400, txStep: 860, folBase: 14_980, folStep: 610 },
  }[period];

  return LB_DEMO_NAMES.map((n, i) => ({
    rank: i + 1,
    uid: `${period}-${i}`,
    name: n,
    initials: n.slice(0, 2).toUpperCase(),
    roi: Math.round((profile.roiBase - i * profile.roiStep + (i % 3) * 5) * 10) / 10,
    pnl: Math.round(profile.pnlBase - i * profile.pnlStep + (i % 4) * 30000),
    winRate: Math.round((profile.winBase - i * 1.8 + (i % 3)) * 10) / 10,
    txCount: Math.round(profile.txBase - i * profile.txStep + (i % 5) * 12),
    followers: Math.round(profile.folBase - i * profile.folStep + (i % 4) * 80),
    addr:
      i < 5
        ? ""
        : "0x" +
          Array.from({ length: 8 })
            .map((_, k) => ((i * 31 + k * 7) % 16).toString(16))
            .join("") +
          "…",
  }));
}

const LEADERBOARDS: Record<Period, LbTrader[]> = {
  "7d": buildLeaderboardFor("7d"),
  "30d": buildLeaderboardFor("30d"),
  "90d": buildLeaderboardFor("90d"),
  "all": buildLeaderboardFor("all"),
};

const SUMMARY_STATS = {
  activeTraders: "12,847",
  totalAum: "$2.1B",
  avgWinRate: "87.3%",
};

/* ──────────────────────────────────────────────────────────────
   NAV LINKS — only items with real existing routes in the workspace.
   (Reference lines 1133–1143 contain 9 items; "Fund Protection" and
   "Retirement Staking™" have no route in this app and are removed.)
   ────────────────────────────────────────────────────────────── */
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/main/dashboard" },
  { label: "Markets", href: "/main/market" },
  { label: "Trade", href: "/main/dashboard" },
  { label: "Wallet", href: "/main/wallet" },
  { label: "Trading Plans", href: "/main/trading-plans" },
  { label: "Fund Managers", href: "/main/fund-managers" },
  { label: "Trade Access", href: "/main/trade-access" },
];

/* ──────────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────────── */
function initialsFromName(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

function fmtCompact(n: number, prefix = "$"): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const abs = Math.abs(n);
  const s =
    abs >= 1e9
      ? (abs / 1e9).toFixed(2) + "B"
      : abs >= 1e6
        ? (abs / 1e6).toFixed(2) + "M"
        : abs >= 1e3
          ? (abs / 1e3).toFixed(1) + "K"
          : abs.toFixed(2);
  return (n < 0 ? "-" : "+") + prefix + s;
}

function sparklinePath(
  values: number[],
  width: number,
  height: number,
  pad = 2,
): string {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((v, i) => {
      const x = pad + ((width - pad * 2) * i) / (values.length - 1);
      const y = height - pad - ((height - pad * 2) * (v - min)) / range;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/* ──────────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────────── */
type SortKey = "roi" | "pnl" | "followers";

export default function FundManagersPage() {
  const user = useUserStore((state) => state.user);
  const settings = useSiteSettingsStore((state) => state.settings);

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "JD";
  const brandName = settings?.name || "1 Trade Market";

  // Period tab drives the leaderboard dataset shown in the podium + table.
  const [period, setPeriod] = useState<Period>("7d");
  // Search + sort stay UI-only (reference binds no handlers to them).
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("roi");
  // Mobile nav dropdown open/close (< lg breakpoint).
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide MainLayout chrome while this page is mounted.
  useEffect(() => {
    document.body.classList.add("fm-active");
    return () => {
      document.body.classList.remove("fm-active");
    };
  }, []);

  // Load reference fonts (Outfit + Inter + JetBrains Mono) — scoped to page.
  useEffect(() => {
    if (document.querySelector<HTMLLinkElement>('link[data-fm-fonts="1"]'))
      return;
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    preconnect1.dataset.fmFonts = "1";
    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    preconnect2.dataset.fmFonts = "1";
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    fontLink.dataset.fmFonts = "1";
    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);
    return () => {
      try {
        document.head.removeChild(preconnect1);
        document.head.removeChild(preconnect2);
        document.head.removeChild(fontLink);
      } catch {
        /* noop */
      }
    };
  }, []);

  const activeLeaderboard = LEADERBOARDS[period];
  const top3 = useMemo(() => activeLeaderboard.slice(0, 3), [activeLeaderboard]);
  const rest = useMemo(() => activeLeaderboard.slice(3, 20), [activeLeaderboard]);

  return (
    <>
      {/* Page-scoped styling + MainLayout hide */}
      <style>{`
        body.fm-active .fixed.top-0.left-0.right-0.z-20,
        body.fm-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.fm-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.fm-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }

        /* Page-scoped TickerBar override (height 34px, 0.65 opacity bg, font sizes)
           same trick used on Trading Plans & Trade Access pages */
        .fm-ticker-wrap > div {
          height: 34px !important;
          background: rgba(7,8,12,0.65) !important;
          border-bottom: 1px solid rgba(255,255,255,0.04) !important;
        }
        .fm-ticker-wrap [data-ticker-price],
        .fm-ticker-wrap span:has(+ [data-ticker-price]) {
          font-size: 0.68rem !important;
        }
        .fm-ticker-wrap [data-ticker-price] ~ span {
          font-size: 0.65rem !important;
        }

        @keyframes fm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.5); }
        }
        .fm-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00dfa2;
          animation: fm-pulse 1.4s ease-in-out infinite;
        }

        .fm-period-tab.active {
          background: linear-gradient(135deg,#00dfa2,#00ffc3) !important;
          color: #000 !important;
          box-shadow: 0 4px 12px rgba(0,223,162,0.3), inset 0 1px 0 rgba(255,255,255,0.2) !important;
        }

        .fm-card-hover { transition: all 0.3s; }
        .fm-card-hover:hover {
          transform: translateY(-6px);
          border-color: #00dfa2;
          box-shadow: 0 12px 48px rgba(0,223,162,0.2), inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .fm-nav-link-active::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -8px;
          height: 2px;
          background: #00dfa2;
          border-radius: 1px;
        }

        /* Switch to hamburger/mobile-nav below lg (1024px) so the nav never crowds. */
        @media (max-width: 1023px) {
          .fm-nav-links { display: none !important; }
          .fm-mobile-toggle { display: inline-flex !important; }
        }
        @media (min-width: 1024px) {
          .fm-mobile-menu { display: none !important; }
        }
        @media (max-width: 900px) {
          .fm-banner-top { flex-direction: column !important; align-items: stretch !important; }
          .fm-banner-right { min-width: 0 !important; }
          .fm-podium-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .fm-managers-grid { grid-template-columns: 1fr !important; }
          .fm-table thead { display: none; }
          .fm-table tbody, .fm-table tr, .fm-table td { display: block; width: 100%; }
          .fm-table tr { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 8px 0; }
          .fm-table td { padding: 4px 16px !important; border-bottom: none !important; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-30 flex flex-col overflow-y-auto font-[Inter,system-ui,sans-serif]"
        style={{
          background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)",
          color: "#eef2f7",
        }}
      >
        {/* TICKER */}
        <div className="fm-ticker-wrap relative z-[299]">
          <TickerBar />
        </div>

        {/* NAV */}
        <nav
          className="sticky top-0 z-[100] flex items-center justify-between px-8 py-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {/* Left: brand + links */}
          <div className="flex items-center gap-12">
            <Link
              to="/main/dashboard"
              className="flex items-center gap-3 font-[Outfit,sans-serif] text-[1.1rem] font-bold text-[#eef2f7] transition-colors hover:text-[#00dfa2]"
            >
              <div
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[11px] font-black text-[0.75rem] text-[#07080c]"
                style={{
                  background: "linear-gradient(145deg,#00ffc3,#00dfa2,#00b881)",
                  boxShadow:
                    "0 0 24px rgba(0,223,162,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
                }}
              >
                1TM
              </div>
              {brandName}
            </Link>

            <ul className="fm-nav-links flex list-none gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === "/main/fund-managers";
                const cls = `relative text-[0.95rem] font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#00dfa2] fm-nav-link-active"
                    : "text-[#8b97a8] hover:text-[#eef2f7]"
                }`;
                return (
                  <li key={link.label}>
                    <Link to={link.href} className={cls}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: hamburger (mobile) + avatar */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              className="fm-mobile-toggle hidden h-10 w-10 items-center justify-center rounded-[10px] text-[#8b97a8] transition-colors hover:text-[#eef2f7]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {mobileMenuOpen ? (
                <X className="h-[1.05rem] w-[1.05rem]" />
              ) : (
                <Menu className="h-[1.05rem] w-[1.05rem]" />
              )}
            </button>
            <div
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-transparent font-bold text-[0.9rem] text-black transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#00dfa2,#00ffc3)",
              }}
              title={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Account"}
            >
              {initials}
            </div>
          </div>
        </nav>

        {/* Mobile dropdown panel — only rendered when open; hidden ≥ lg by CSS */}
        {mobileMenuOpen && (
          <div
            className="fm-mobile-menu sticky top-[72px] z-[99] flex flex-col gap-1 px-4 py-3"
            style={{
              background: "rgba(10,13,21,0.95)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/main/fund-managers";
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-[8px] px-3 py-2.5 text-[0.9rem] font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-[rgba(0,223,162,0.1)] text-[#00dfa2]"
                      : "text-[#8b97a8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#eef2f7]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* LEADERBOARD BANNER */}
        <div
          className="mb-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "2rem",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          <div
            className="fm-banner-top mx-auto mb-6 flex max-w-[1400px] flex-wrap items-center justify-between gap-8"
          >
            {/* Left: title + live badge */}
            <div>
              <h1 className="flex items-center gap-3 font-[Outfit,sans-serif] text-[28px] font-bold leading-none text-[#eef2f7]">
                Fund Managers
                <span
                  className="inline-flex items-center gap-1.5 rounded-[20px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.5px] text-[#00dfa2]"
                  style={{
                    background: "rgba(0,223,162,0.10)",
                    border: "1px solid #00dfa2",
                  }}
                >
                  <span className="fm-live-dot" />
                  Live
                </span>
              </h1>
            </div>

            {/* Center: period tabs */}
            <div className="text-center">
              <div
                className="inline-flex gap-1.5 rounded-lg p-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                {(["7d", "30d", "90d", "all"] as Period[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`fm-period-tab rounded-md border-none bg-transparent px-4 py-1.5 text-[13px] font-semibold tracking-[0.3px] text-[#8b97a8] transition-all duration-200 ${
                      period === p ? "active" : "hover:text-[#eef2f7]"
                    }`}
                  >
                    {p === "all" ? "All" : p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: search + sort */}
            <div className="fm-banner-right flex min-w-[300px] gap-4">
              <div
                className="relative flex flex-1 items-center rounded-lg px-2.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                <Search className="mr-2 h-[0.82rem] w-[0.82rem] text-[#4a5468]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search trader..."
                  className="flex-1 border-none bg-transparent py-2 text-[13px] text-[#eef2f7] outline-none placeholder:text-[#4a5468]"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-[#eef2f7] outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                <option value="roi">Sort by ROI</option>
                <option value="pnl">Sort by PnL</option>
                <option value="followers">Sort by Followers</option>
              </select>
            </div>
          </div>

          {/* Summary stats row */}
          <div
            className="mx-auto flex max-w-[1400px] flex-wrap gap-8 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-[#8b97a8]">
                Active Traders:
              </span>
              <span className="font-[JetBrains_Mono,monospace] text-[14px] font-bold text-[#eef2f7]">
                {SUMMARY_STATS.activeTraders}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-[#8b97a8]">
                Total AUM:
              </span>
              <span className="font-[JetBrains_Mono,monospace] text-[14px] font-bold text-[#eef2f7]">
                {SUMMARY_STATS.totalAum}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-[#8b97a8]">
                Avg Win Rate:
              </span>
              <span className="font-[JetBrains_Mono,monospace] text-[14px] font-bold text-[#eef2f7]">
                {SUMMARY_STATS.avgWinRate}
              </span>
            </div>
          </div>
        </div>

        {/* TOP 3 PODIUM */}
        <div className="mx-auto mb-8 w-full max-w-[1400px] px-8">
          <div
            className="fm-podium-grid grid gap-4"
            style={{ gridTemplateColumns: "1fr 1.15fr 1fr" }}
          >
            {top3.map((t, i) => {
              const rankKind = i === 0 ? "rank1" : i === 1 ? "rank2" : "rank3";
              const medals = ["🥇", "🥈", "🥉"];
              const rankBadgeStyle: React.CSSProperties =
                i === 0
                  ? {
                      background: "linear-gradient(135deg,#00dfa2,#00ffc3)",
                      color: "#000",
                    }
                  : i === 1
                    ? {
                        background: "linear-gradient(135deg,#C0C0C0,#E0E0E0)",
                        color: "#000",
                      }
                    : {
                        background: "linear-gradient(135deg,#CD7F32,#D4A574)",
                        color: "#fff",
                      };
              const cardStyle: React.CSSProperties =
                i === 0
                  ? {
                      background:
                        "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,223,162,0.08))",
                      border: "1px solid rgba(0,223,162,0.4)",
                      backdropFilter: "blur(40px)",
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(40px)",
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
                    };

              return (
                <div
                  key={`${rankKind}-${t.uid}`}
                  className="fm-card-hover relative overflow-hidden rounded-2xl p-5"
                  style={cardStyle}
                >
                  {/* Rank badge */}
                  <div
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full font-bold text-[18px]"
                    style={rankBadgeStyle}
                    aria-label={`Rank ${i + 1}`}
                  >
                    {medals[i]}
                  </div>

                  {/* Avatar */}
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-full font-[JetBrains_Mono,monospace] font-bold text-[16px] text-black"
                    style={{
                      background: "linear-gradient(135deg,#00dfa2,#00b881)",
                      border:
                        i === 0
                          ? "2px solid rgba(0,223,162,0.6)"
                          : "2px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {t.initials}
                  </div>

                  {/* Name */}
                  <div className="mb-1 text-[15px] font-bold text-[#eef2f7]">
                    {t.name}
                  </div>
                  <div className="mb-3 font-[JetBrains_Mono,monospace] text-[11px] text-[#8b97a8]">
                    {t.addr || (t.uid ? t.uid.slice(0, 10) + "…" : "BSC Network")}
                  </div>

                  {/* ROI */}
                  <div className="mb-1.5 font-[JetBrains_Mono,monospace] text-[32px] font-bold leading-none text-[#00dfa2]">
                    {t.roi >= 0 ? "+" : ""}
                    {t.roi.toFixed(1)}%
                  </div>

                  {/* ROI bar */}
                  <div
                    className="mb-3 h-1 w-full overflow-hidden rounded-sm"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${Math.min(100, (t.roi / 380) * 100)}%`,
                        background: "linear-gradient(90deg,#00dfa2,#00ffc3)",
                      }}
                    />
                  </div>

                  {/* Stat chips */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <StatChip label="PnL" value={fmtCompact(t.pnl).replace("$", "")} />
                    <StatChip
                      label="Win"
                      value={t.winRate > 0 ? t.winRate.toFixed(1) + "%" : "—"}
                    />
                    <StatChip
                      label="Trades"
                      value={t.txCount > 0 ? t.txCount.toLocaleString() : "—"}
                    />
                    <StatChip
                      label="Followers"
                      value={
                        t.followers > 0 ? t.followers.toLocaleString() : "—"
                      }
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 cursor-pointer rounded-lg border-none bg-gradient-to-br from-[#00dfa2] to-[#00ffc3] px-2.5 py-2.5 text-[13px] font-bold text-black transition-all duration-200 hover:-translate-y-0.5"
                      style={{ boxShadow: "0 4px 12px rgba(0,223,162,0.3)" }}
                    >
                      Follow
                    </button>
                    <button
                      type="button"
                      className="flex-1 cursor-pointer rounded-lg px-2.5 py-2.5 text-[13px] font-bold text-[#eef2f7] transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                      }}
                    >
                      Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="mx-auto mb-12 w-full max-w-[1400px] px-8">
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <div
              className="px-6 py-4 font-[Outfit,sans-serif] text-[16px] font-bold text-[#eef2f7]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              Leaderboard Rankings
            </div>
            <div className="overflow-x-auto">
              <table className="fm-table w-full border-collapse">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["#", "Trader", "ROI (30D)", "PnL", "Win Rate", "Max DD", "Trades", "Followers", "Action"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.4px] text-[#8b97a8]"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rest.map((t) => (
                    <tr
                      key={t.uid}
                      className="transition-colors hover:bg-[rgba(0,223,162,0.05)]"
                    >
                      <td
                        className="w-10 px-4 py-3.5 font-[JetBrains_Mono,monospace] text-[13px] font-bold text-[#8b97a8]"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        #{t.rank}
                      </td>
                      <td
                        className="px-4 py-3.5 text-[13px] text-[#eef2f7]"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-[JetBrains_Mono,monospace] text-[12px] font-bold text-black"
                            style={{
                              background:
                                "linear-gradient(135deg,#00dfa2,#00b881)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {t.initials}
                          </div>
                          <div className="flex-1">
                            <div className="text-[13px] font-bold text-[#eef2f7]">
                              {t.name}
                            </div>
                            {t.addr && (
                              <div className="font-[JetBrains_Mono,monospace] text-[11px] text-[#8b97a8]">
                                {t.addr}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="relative px-4 py-3.5 font-[JetBrains_Mono,monospace] text-[13px] font-bold text-[#00dfa2]"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {t.roi >= 0 ? "+" : ""}
                        {t.roi.toFixed(1)}%
                        <div
                          className="absolute bottom-0.5 left-0 h-0.5 rounded-sm"
                          style={{
                            background: "#00dfa2",
                            width: `${Math.min(100, (t.roi / 380) * 100)}%`,
                          }}
                        />
                      </td>
                      <td
                        className={`px-4 py-3.5 font-[JetBrains_Mono,monospace] text-[13px] font-bold ${t.pnl >= 0 ? "text-[#00dfa2]" : "text-[#ff6b6b]"}`}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {fmtCompact(t.pnl)}
                      </td>
                      <td
                        className="px-4 py-3.5 text-[13px] text-[#eef2f7]"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {t.winRate > 0 ? t.winRate.toFixed(1) + "%" : "—"}
                      </td>
                      <td
                        className="px-4 py-3.5 text-[13px] text-[#eef2f7]"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        —
                      </td>
                      <td
                        className="px-4 py-3.5 text-[13px] text-[#eef2f7]"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {t.txCount > 0 ? t.txCount.toLocaleString() : "—"}
                      </td>
                      <td
                        className="px-4 py-3.5 text-[13px] text-[#eef2f7]"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {t.followers > 0 ? t.followers.toLocaleString() : "—"}
                      </td>
                      <td
                        className="px-4 py-3.5"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <button
                          type="button"
                          className="cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-bold text-[#00dfa2] transition-all duration-200 hover:bg-[#00dfa2] hover:text-black"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid #00dfa2",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                          }}
                        >
                          Follow
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Representative demo data notice (reference shows this exact copy) */}
          <div
            className="mt-2 flex items-center gap-2 rounded-lg p-2.5 text-[12px] text-[#8b97a8]"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <Info className="h-3.5 w-3.5 flex-shrink-0 text-[#00dfa2]" />
            <span>
              Live data unavailable (CORS restriction on local file). Showing
              representative demo data — deploy to a web server for real Binance
              BSC live feed.
            </span>
          </div>
        </div>

        {/* VERIFIED MANAGERS */}
        <div className="mx-auto mb-12 w-full max-w-[1400px] px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-[Outfit,sans-serif] text-[20px] font-bold text-[#eef2f7]">
              Platform Verified Managers
            </h2>
            <a
              href="#"
              className="text-[13px] text-[#8b97a8] transition-colors duration-200 hover:text-[#00dfa2]"
              onClick={(e) => e.preventDefault()}
            >
              Manage →
            </a>
          </div>

          <div
            className="fm-managers-grid grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            }}
          >
            {MANAGERS.map((m) => (
              <ManagerCard key={m.id} manager={m} />
            ))}
          </div>
        </div>

        <div className="h-12" />
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   LOCAL SUBCOMPONENTS
   ────────────────────────────────────────────────────────────── */

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg p-2 text-center text-[11px]"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      <span className="mb-0.5 block text-[10px] text-[#4a5468]">{label}</span>
      <span className="block font-[JetBrains_Mono,monospace] font-bold text-[#eef2f7]">
        {value}
      </span>
    </div>
  );
}

function ManagerCard({ manager }: { manager: Manager }) {
  const [following, setFollowing] = useState(false);
  const sparkW = 220;
  const sparkH = 44;

  return (
    <div
      className="fm-card-hover relative rounded-2xl p-4.5"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "18px",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {/* Verified top badge */}
      <span
        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase text-[#00dfa2]"
        style={{
          background: "rgba(0,223,162,0.15)",
          border: "1px solid #00dfa2",
        }}
      >
        <Star className="h-[0.58rem] w-[0.58rem] fill-current" /> Verified
      </span>

      {/* Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-[JetBrains_Mono,monospace] text-[14px] font-bold text-black"
          style={{
            background: "linear-gradient(135deg,#00dfa2,#00b881)",
            border: "2px solid rgba(255,255,255,0.08)",
          }}
        >
          {initialsFromName(manager.name)}
        </div>
        <div className="flex-1">
          <div className="mb-1 text-[14px] font-bold text-[#eef2f7]">
            {manager.name}
          </div>
          <div
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-[#00dfa2]"
            style={{ background: "rgba(0,223,162,0.10)" }}
          >
            <CheckCircle className="h-[0.6rem] w-[0.6rem]" /> {manager.role}
          </div>
        </div>
      </div>

      {/* ROI */}
      <div className="mb-3 font-[JetBrains_Mono,monospace] text-[28px] font-bold leading-none text-[#00dfa2]">
        {manager.roi > 0 ? "+" : ""}
        {manager.roi.toFixed(1)}%
      </div>

      {/* Stats row */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <ManagerStatCell label="ROI 12M" value={`${manager.roi.toFixed(1)}%`} />
        <ManagerStatCell label="AUM" value={`${manager.aum.toFixed(1)}M`} />
        <ManagerStatCell
          label="Win Rate"
          value={`${manager.winRate.toFixed(1)}%`}
        />
      </div>

      {/* Sparkline */}
      <div className="mb-3 h-11">
        <svg
          viewBox={`0 0 ${sparkW} ${sparkH}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d={`${sparklinePath(manager.monthlyReturns, sparkW, sparkH)} L${sparkW - 2},${sparkH - 2} L2,${sparkH - 2} Z`}
            fill="rgba(0,223,162,0.15)"
          />
          <path
            d={sparklinePath(manager.monthlyReturns, sparkW, sparkH)}
            fill="none"
            stroke="#00dfa2"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Footer meta */}
      <div className="mb-3 flex justify-between text-[11px] text-[#8b97a8]">
        <span>Followers: {manager.followers.toLocaleString()}</span>
        <span>
          Fee: {manager.mgmtFee}% + {manager.perfFee}%
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFollowing((v) => !v)}
          className="flex-1 cursor-pointer rounded-lg border-none px-2.5 py-2 text-[12px] font-bold text-black transition-all duration-200"
          style={{
            background: "linear-gradient(135deg,#00dfa2,#00ffc3)",
            boxShadow: "0 4px 12px rgba(0,223,162,0.3)",
          }}
        >
          {following ? "Following" : "Copy Trade"}
        </button>
        <button
          type="button"
          className="flex-1 cursor-pointer rounded-lg px-2.5 py-2 text-[12px] font-bold text-[#eef2f7] transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}

function ManagerStatCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-lg p-2 text-center"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      <div className="mb-0.5 text-[10px] text-[#4a5468]">{label}</div>
      <div className="font-[JetBrains_Mono,monospace] text-[12px] font-bold text-[#eef2f7]">
        {value}
      </div>
    </div>
  );
}

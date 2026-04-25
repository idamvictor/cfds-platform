import { lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  Check,
  Coins,
  Landmark,
  Menu,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopStoriesWidget } from "@/components/dashboard/TopStoriesWidget";
import { TickerBar } from "@/components/dashboard/TickerBar";
import DashboardNavbar from "@/components/nav/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useCurrency } from "@/hooks/useCurrency";
import useUserStore from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";

const TradingResultsChart = lazy(() =>
  import("@/components/dashboard/TradingResultsChart").then((module) => ({
    default: module.TradingResultsChart,
  })),
);
const SuccessRateCard = lazy(() =>
  import("@/components/dashboard/SuccessRateCard").then((module) => ({
    default: module.SuccessRateCard,
  })),
);

const marketTickers = [
  { symbol: "EUR/USD", value: "1.1583", change: "+0.42%", positive: true },
  { symbol: "GBP/USD", value: "1.3198", change: "-0.11%", positive: false },
  { symbol: "BTC/USD", value: "68,240", change: "+3.14%", positive: true },
  { symbol: "IXIC", value: "17,648", change: "+3.87%", positive: true },
  { symbol: "DJI", value: "42,188", change: "+1.02%", positive: true },
  { symbol: "SPX", value: "5,582", change: "-0.08%", positive: false },
  { symbol: "NKE", value: "74.90", change: "-8.94%", positive: false },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const { formatCurrency } = useCurrency();
  const balance = user?.balance || 0;
  const tradesSummary = user?.trades_summary || {
    total_pnl: 0,
    total_wins: 0,
    total_losses: 0,
    trades_count: 0,
    total_deposit: 0,
    win_rate: 0,
  };

  const isVerified = user?.verification_status === "approved";
  const settings = useSiteSettingsStore((state) => state.settings);
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "Customer User";

  const now = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

  // Hide the parent MainLayout header + sidebar when dashboard mounts
  useEffect(() => {
    document.body.classList.add("dashboard-active");
    return () => {
      document.body.classList.remove("dashboard-active");
    };
  }, []);

  const dashboardCardFallback = (
    <div className="min-h-[240px] animate-pulse rounded-2xl border-[1.5px] border-white/[0.06] bg-[#111319]" />
  );

  return (
    <>
      {/* CSS to hide the parent layout header + sidebar on dashboard only */}
      <style>{`
        body.dashboard-active .fixed.top-0.left-0.right-0.z-20,
        body.dashboard-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.dashboard-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.dashboard-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }

        /* Top Stories widget — dashboard only: mute to match page palette */
        body.dashboard-active .top-stories-widget {
          opacity: 0.7;
          filter: brightness(0.85) saturate(0.6);
          font-family: Inter, -apple-system, sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 0.75rem;
          font-weight: 600;
        }
        body.dashboard-active .top-stories-widget * {
          font-family: inherit !important;
          text-transform: inherit !important;
          letter-spacing: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
        }
        body.dashboard-active .top-stories-widget .tradingview-widget-copyright,
        body.dashboard-active .top-stories-widget .tradingview-widget-copyright a,
        body.dashboard-active .top-stories-widget .tradingview-widget-copyright span {
          color: #5f6b82 !important;
          font-size: 0.75rem !important;
        }
      `}</style>

      {/* ═══ FULL DASHBOARD SHELL ═══ */}
      <div
        className="fixed inset-0 z-30 flex flex-col font-[Inter,-apple-system,sans-serif]"
        style={{
          background: "linear-gradient(135deg, #07080c 0%, #0a0d15 100%)",
          color: "#eef2f7",
        }}
      >
        {/* ═══ TICKER BAR ═══ */}
        <TickerBar />

        {/* ═══ DASHBOARD NAVBAR ═══ */}
        <DashboardNavbar />

        {/* ═══ PAGE WRAP: sidebar + main ═══ */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-[60px_1fr] min-h-0">
          {/* Dashboard-specific sidebar (HTML match) */}
          <DashboardSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* ═══ MAIN SCROLLABLE AREA ═══ */}
          <main className="overflow-y-auto px-4 py-7 md:px-8" style={{ maxHeight: "100%" }}>

            {/* ═══ HEADER ═══ */}
            <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Mobile sidebar toggle */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open navigation"
                  className="md:hidden mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-[#8b97a8] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
                >
                  <Menu className="h-[1.1rem] w-[1.1rem]" />
                </button>

                <div>
                  <h1 className="font-[Outfit,sans-serif] text-[1.3rem] sm:text-[1.65rem] font-extrabold tracking-[-0.03em] leading-tight">
                    Welcome back,{" "}
                    <span className="text-[#00dfa2]">{displayName}</span>
                  </h1>
                  <div className="mt-0.5 text-[0.8rem] font-medium text-[#4a5468]">
                    {settings?.name || "Test Platform"}
                    <sup>&reg;</sup> Platform &middot;{" "}
                    <span className="font-bold text-[#00dfa2]">
                      {user?.account_type?.title || "Starter"}
                    </span>{" "}
                    Account
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-[14px]">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-[20px] border border-[rgba(0,223,162,0.25)] bg-[rgba(0,223,162,0.1)] px-4 py-1.5 text-[0.72rem] font-bold text-[#00dfa2]">
                    <Check className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-[20px] border border-[rgba(244,63,94,0.15)] bg-[rgba(244,63,94,0.08)] px-4 py-1.5 text-[0.72rem] font-bold text-[#f43f5e]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f43f5e] shadow-[0_0_8px_#f43f5e] animate-[pulse_2s_ease-in-out_infinite]" />
                    Unverified
                  </span>
                )}

                <span className="rounded-[20px] border border-white/[0.05] bg-white/[0.03] px-4 py-1.5 font-mono text-[0.78rem] font-medium text-[#8b97a8]">
                  {now}
                </span>
              </div>
            </div>

            {/* ═══ STAT CARDS ═══ */}
            <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_0.9fr]">
              {/* Account Balance — special card */}
              <div className="scard relative overflow-hidden rounded-2xl border-[1.5px] border-white/[0.06] bg-[#111319] p-[22px_24px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(175deg,rgba(255,255,255,0.03),transparent_40%)]" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#4a5468]">
                      Account Balance
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[rgba(0,223,162,0.1)] text-[#00dfa2]">
                      <BadgeDollarSign className="h-[0.82rem] w-[0.82rem]" />
                    </div>
                  </div>

                  <div className="mb-4 font-mono text-[1.45rem] font-extrabold tracking-[-0.02em] text-[#00dfa2]">
                    {formatCurrency(balance)}
                  </div>

                  <div className="flex flex-col gap-2 border-t border-white/[0.04] pt-[14px]">
                    <div className="flex items-center justify-between text-[0.78rem]">
                      <span className="font-medium text-[#4a5468]">Leverage</span>
                      <span className="font-mono font-bold text-[#00dfa2]">
                        1:{user?.account_type?.leverage || "1"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[0.78rem]">
                      <span className="font-medium text-[#4a5468]">
                        {user?.custom_wallet || "Credit Balance"}
                      </span>
                      <span className="font-mono font-bold text-[#8b97a8]">
                        {formatCurrency(user?.credit_balance || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[0.78rem]">
                      <span className="font-medium text-[#4a5468]">
                        Account Type
                      </span>
                      <span className="font-mono font-bold text-[#00dfa2]">
                        {user?.account_type?.title || "Starter"}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] border-none bg-[linear-gradient(135deg,#00dfa2,#00b881)] py-3 text-[0.82rem] font-bold tracking-[0.02em] text-[#07080c] shadow-[0_4px_16px_rgba(0,223,162,0.2)] transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,223,162,0.3)]"
                    onClick={() => navigate("/trading")}
                  >
                    Open Trade Room
                  </Button>
                </div>
              </div>

              <StatCard
                title="Total PNL"
                value={formatCurrency(tradesSummary.total_pnl)}
                icon={<Coins className="h-5 w-5" />}
                footnote="Based on current exchange rate"
                metaValue={`${tradesSummary.win_rate.toFixed(2)}%`}
                iconTone="blue"
              />

              <StatCard
                title="Total Deposits"
                value={formatCurrency(tradesSummary.total_deposit || 0)}
                icon={<Landmark className="h-5 w-5" />}
                metaValue={`No deposits yet`}
                iconTone="violet"
              />

              <StatCard
                title="Profitable Orders"
                value={`${tradesSummary.total_wins}`}
                secondaryValue={`/${tradesSummary.trades_count}`}
                icon={<BriefcaseBusiness className="h-3 w-3" />}
                metaValue={`No orders placed`}
                iconTone="amber"
              />
            </div>

            {/* ═══ MARKET STRIP ═══ */}
            <div className="mb-6 grid gap-3 grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
              {marketTickers.map((ticker) => (
                <div
                  key={ticker.symbol}
                  className="rounded-xl border border-white/6 bg-[#111319] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {ticker.symbol}
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          ticker.positive ? "text-[#16e28d]" : "text-[#ff5876]"
                        }`}
                      >
                        {ticker.change}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold leading-none text-white/90">
                        {ticker.value}
                      </div>
                      <div
                        className={`mt-1 inline-flex items-center gap-1 text-[10px] ${
                          ticker.positive ? "text-[#16e28d]" : "text-[#ff5876]"
                        }`}
                      >
                        <TrendingUp
                          className={`h-3.5 w-3.5 ${ticker.positive ? "" : "rotate-180"}`}
                        />
                        <span>{ticker.positive ? "Bullish" : "Bearish"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ═══ BOTTOM GRID: Chart + Success Rate ═══ */}
            <div className="mb-6 grid gap-5 grid-cols-1 lg:grid-cols-[1fr_340px]">
              {/* Trading Results */}
              <div className="gcard relative overflow-hidden rounded-2xl border-[1.5px] border-white/[0.06] bg-[#111319] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(175deg,rgba(255,255,255,0.03),transparent_40%)]" />
                <div className="relative">
                  <Suspense fallback={dashboardCardFallback}>
                    <TradingResultsChart />
                  </Suspense>
                </div>
              </div>

              {/* Success Rate */}
              <div className="gcard relative overflow-hidden rounded-2xl border-[1.5px] border-white/[0.06] bg-[#111319] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(175deg,rgba(255,255,255,0.03),transparent_40%)]" />
                <div className="relative">
                  <Suspense fallback={dashboardCardFallback}>
                    <SuccessRateCard />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* ═══ TOP STORIES ═══ */}
            <div className="gcard relative overflow-hidden rounded-2xl border-[1.5px] border-white/[0.06] bg-[#111319] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(175deg,rgba(255,255,255,0.03),transparent_40%)]" />
              <div className="relative">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f6b82]">
                    Top Market Stories
                  </h2>
                  <a
                    href="https://www.tradingview.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5f6b82] transition hover:text-[#eef2f7]"
                  >
                    Track all markets on TradingView
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <TopStoriesWidget />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

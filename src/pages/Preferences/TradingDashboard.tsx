import { lazy, Suspense } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  Check,
  Coins,
  Landmark,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopStoriesWidget } from "@/components/dashboard/TopStoriesWidget";
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

  const dashboardCardFallback = (
    <div className="min-h-[320px] animate-pulse rounded-xl border border-white/6 bg-[#0d131d]" />
  );

  return (
    <div className="min-h-screen text-[#485262] font_fam">
      <div className="mx-auto max-w-[1400px]  bg-[#090e16] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)]- sm:p-6- ">
        <div className="mb-6 flex flex-col gap-5 rounded-[28px] p-5-  lg:p-">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              {/* <div className="flex items-center gap-2 text-sm text-[#72819d]">
                <span>Home</span>
                <span className="text-[#465065]">›</span>
                <span className="text-[#9ba7bd]">Dashboard</span>
              </div> */}

              <div>
                <h1 className="title_header tracking-tight text-white ">
                  Welcome back,{" "}
                  <span className="text-[#16e28d]">{displayName}</span>
                </h1>
                <p className="mt-1 sub_header font-semibold text-[#6d7a92] !capitalize ">
                  {settings?.name || "Test Platform"} ®{" "}
                  <span className="mx-1"> Platform</span>
                  <span className="text-[#4d586d] !capitalize ">—</span>{" "}
                  {user?.account_type?.title || "Starter Account"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  isVerified
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border border-amber-400/15 bg-amber-400/10 text-amber-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isVerified ? "bg-emerald-400" : "bg-amber-300"
                  }`}
                />
                <span>{isVerified ? "Verified" : "Unverified"}</span>
                {isVerified && <Check className="h-3.5 w-3.5" />}
              </div>

              <div className="rounded-2xl border border-white/6 bg-[#101722] px-4 py-2 font-mono text-sm text-[#7f8ca3]">
                {now}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
            <div
              className="rounded-xl border border-[#0f5d45] bg-[linear-gradient(135deg,rgba(9,22,21,0.96),rgba(13,29,23,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_70px_rgba(15,226,141,0.08)]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at top right, rgba(18, 226, 142, 0.12), transparent 28%), linear-gradient(135deg, rgba(9,22,21,0.96), rgba(13,29,23,0.92))",
              }}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="sub_header font-bold uppercase text-[#6e7c92] word-spacing-[4.5rem]">
                    Account <span className="ms-1">Balance</span>
                  </p>
                  <div className="mt-4 font-semibold leading-none text-[#15e28d] header">
                    {formatCurrency(balance)}
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2b22] text-[#15e28d] shadow-[0_0_22px_rgba(21,226,141,0.12)]">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-1 border-t border-white/8 pt-2 body">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6f7c92]">Leverage</span>
                  <span className="font-semibold tracking-wide text-[#73a8ff]">
                    1:{user?.account_type?.leverage || "1"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 body">
                  <span className="text-[#6f7c92]">
                    {user?.custom_wallet || "Credit Balance"}
                  </span>
                  <span className="font-semibold- text-white/90">
                    {formatCurrency(user?.credit_balance || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 body">
                  <span className="text-[#6f7c92]">Account Type</span>
                  <span className="font-semibold text-[#16e28d]">
                    {user?.account_type?.title || "Starter"}
                  </span>
                </div>
              </div>

              <Button
                className="mt-6 h-8 w-full rounded-xl border border-[#22f59e]/30 bg-[#10d17f] text-xs text-white font-semibold  shadow-[0_14px_30px_rgba(16,209,127,0.35)] transition hover:bg-[#19e58c]"
                onClick={() => navigate("/trading")}
              >
                Open Trade Room
              </Button>
            </div>

            <StatCard
              title="Total PNL"
              value={formatCurrency(tradesSummary.total_pnl)}
              icon={<Coins className="h-5 w-5" />}
              footnote="* using current exchange rate"
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
              secondaryValue={`/ ${tradesSummary.trades_count}`}
              icon={<BriefcaseBusiness className="h-3 w-3" />}
              metaValue={`No orders placed`}
              iconTone="amber"
            />
          </div>
        </div>

        <div className="mb-6 grid gap-3 grid-cols-2  md:grid-cols-4 xl:grid-cols-7 ">
          {marketTickers.map((ticker) => (
            <div
              key={ticker.symbol}
              className="rounded-xl border border-white/6 bg-[#0d131d] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
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

        <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-xl border border-white/6 bg-[#0b111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6">
            <Suspense fallback={dashboardCardFallback}>
              <TradingResultsChart />
            </Suspense>
          </section>

          <section className="rounded-xl border border-white/6 bg-[#0b111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6">
            <Suspense fallback={dashboardCardFallback}>
              <SuccessRateCard />
            </Suspense>
          </section>
        </div>

        <section className="rounded-xl border border-white/6 bg-[#0b111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[15px] sm:text-[17px]  font-semibold tracking-tight text-white">
              Top Market Stories
            </h2>
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#16e28d] transition hover:text-[#41efab]"
            >
              Track all markets on TradingView
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <TopStoriesWidget />
        </section>
      </div>
    </div>
  );
}

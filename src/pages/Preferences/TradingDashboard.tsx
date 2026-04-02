import { Check, Wallet, Coins, Building2, PiggyBank } from "lucide-react";
import { SuccessRateCard } from "@/components/dashboard/SuccessRateCard";
import { TradingResultsChart } from "@/components/dashboard/TradingResultsChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopStoriesWidget } from "@/components/dashboard/TopStoriesWidget";
import { useCurrency } from "@/hooks/useCurrency";
import useUserStore from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";

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

  return (
    <div className="min-h-screen bg-[#0e111b] px-3 py-4 text-white sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#202635_0%,#161b27_8%,#131826_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
          {/* Top Bar */}
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.22),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#7ca2ff,#4d6bff)] text-lg font-semibold text-white">
                  C
                </div>
                <div className="text-2xl font-medium tracking-[-0.03em] text-white">
                  {settings?.name || "Cryven"}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-white/65">
                <div className="rounded-full bg-white/[0.08] px-4 py-2 text-white">
                  Dashboard
                </div>
                {/* <div className="px-2 py-2">Market</div>
                <div className="px-2 py-2">Trade</div>
                <div className="px-2 py-2">Portfolio</div>
                <div className="px-2 py-2">Assets</div> */}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7ca2ff]" />
                  <span>
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm">
                  <span className="text-white/45">Status</span>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[#8bc5ff]">
                      Verified <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="text-red-400">UnVerified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.42fr)_320px] lg:p-5">
            {/* Left */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_65%_15%,rgba(110,146,255,0.2),transparent_22%),linear-gradient(180deg,#171d2c_0%,#121827_100%)]">
                <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-white/85">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7931a] text-sm font-semibold text-white">
                        ₿
                      </span>
                      <span className="text-xl font-medium tracking-[-0.03em]">
                        BTC/USD
                      </span>
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                      <h2 className="text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl">
                        {formatCurrency(balance)}
                      </h2>
                      <span className="mb-1 text-base text-[#8bc5ff]">
                        + {tradesSummary.win_rate}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                      1h
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                      24h
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                      1w
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-white">
                      1m
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                      6m
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                      1y
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <TradingResultsChart />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:grid-cols-4">
                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#232938,#171b26)] p-1">
                  <StatCard
                    title="Total Balance"
                    value={formatCurrency(balance)}
                    icon={<Wallet className="h-7 w-7 text-accent" />}
                  />
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#232938,#171b26)] p-1">
                  <StatCard
                    title="Total PNL"
                    value={formatCurrency(tradesSummary.total_pnl)}
                    icon={<Coins className="h-7 w-7 text-accent" />}
                    footnote="* using current exchange rate"
                  />
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#232938,#171b26)] p-1">
                  <StatCard
                    title="Total Deposits"
                    value={formatCurrency(tradesSummary.total_deposit || 0)}
                    icon={<Building2 className="h-7 w-7 text-accent" />}
                    valueClassName="text-success"
                  />
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#232938,#171b26)] p-1">
                  <StatCard
                    title="Profitable Orders"
                    value={`${tradesSummary.total_wins} / ${tradesSummary.trades_count}`}
                    icon={<PiggyBank className="h-7 w-7 text-accent" />}
                  />
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]-">
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#1a1f2d,#141925)]">
                  <div className="border-b border-white/10 px-4 py-4 sm:px-5">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                      Market Pulse
                    </div>
                    <h3 className="mt-1.5 text-lg font-medium tracking-[-0.03em] text-white">
                      Top Stories
                    </h3>
                  </div>
                  <div className="p-4 sm:p-5">
                    <TopStoriesWidget />
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#202635,#151a26)]">
                <div className="border-b border-white/10 p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-white/[0.09] px-4 py-2 text-center text-white">
                      BUY
                    </div>
                    <div className="rounded-xl bg-black/20 px-4 py-2 text-center text-white/60">
                      SELL
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-3">
                  <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,#1a1f2d,#121621)] px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                      Welcome
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">
                      Welcome{" "}
                      <span className="text-[#8bc5ff]">
                        {user?.first_name} {user?.last_name}
                      </span>
                    </h2>
                    <h3 className="mt-2 text-sm text-white/55">
                      to {settings?.name} ®
                    </h3>
                    <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70">
                      <span className="text-white/45">Account status:</span>
                      {isVerified ? (
                        <div className="flex items-center gap-1 font-medium text-[#8bc5ff]">
                          Verified <Check className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="font-medium text-red-400">
                          UnVerified
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,#1a1f2d,#121621)] px-4 py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-white/45">Balance</span>
                        <span className="text-lg font-medium text-white">
                          {formatCurrency(balance)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-white/45">Leverage</span>
                        <span className="text-lg font-medium text-[#8bc5ff]">
                          1:{user?.account_type?.leverage || "1"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-white/45">
                          {user?.custom_wallet}
                        </span>
                        <span className="text-lg font-medium text-[#8bc5ff]">
                          {formatCurrency(user?.credit_balance || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="h-11 w-full rounded-full bg-[#5b87ff] font-medium text-white transition hover:bg-[#6b92ff]"
                    onClick={() => navigate("/trading")}
                  >
                    Trade Now
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(124,162,255,0.18),transparent_28%),linear-gradient(180deg,#253150,#1b243d)] px-4 py-4 sm:px-5">
                <div className="text-sm text-white/65">Available Balance</div>
                <div className="mt-2 text-4xl font-medium tracking-[-0.05em] text-white">
                  {balance.toFixed(3)}
                </div>
                <div className="mt-1 text-base text-[#8bc5ff]">BTC</div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-white/55">
                  <div>
                    <div>Estimate fee</div>
                    <div className="mt-2 text-sm text-white">
                      {formatCurrency(tradesSummary.total_losses || 6.32)}
                    </div>
                  </div>
                  <div>
                    <div>You will receive</div>
                    <div className="mt-2 text-sm text-white">
                      {formatCurrency(tradesSummary.total_wins || 120.58)}
                    </div>
                  </div>
                  <div>
                    <div>Spread</div>
                    <div className="mt-2 text-sm text-white">0%</div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#1a1f2d,#141925)]">
                <div className="border-b border-white/10 px-4 py-4 sm:px-5">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                    Performance
                  </div>
                  <h3 className="mt-1.5 text-lg font-medium tracking-[-0.03em] text-white">
                    Success Rate
                  </h3>
                </div>
                <div className="p-3">
                  <SuccessRateCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

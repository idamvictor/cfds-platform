import { StatCard } from "../../components/dashboard/StatCard";
import { SuccessRateCard } from "../../components/dashboard/SuccessRateCard";
import { TradingResultsChart } from "../../components/dashboard/TradingResultsChart";
import { AccountSection } from "../../components/dashboard/AccountSection";
import { Wallet, Coins, PiggyBank, Building2 } from "lucide-react";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";

export default function TradingDashboard() {
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

  return (
    <div className="flex flex-col p-6 bg-background text-foreground min-h-screen">
      <div className="flex flex-col gap-6 bg-background text-foreground">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* First row */}
          <StatCard
            title="Total Balance"
            value={formatCurrency(balance)}
            icon={<Wallet className="h-10 w-10 text-accent" />}
          />

          <StatCard
            title="Total PNL"
            value={formatCurrency(tradesSummary.total_pnl)}
            icon={<Coins className="h-10 w-10 text-accent" />}
            footnote="* using current exchange rate"
          />

          {/* Success Rate Card spans 2 columns and full height */}
          <div className="md:col-span-2 md:row-span-2">
            <SuccessRateCard />
          </div>

          {/* Second row */}
          <StatCard
            title="Profitable Orders"
            value={`${tradesSummary.total_wins} / ${tradesSummary.trades_count}`}
            icon={<PiggyBank className="h-12 w-12 text-accent" />}
          />

          <StatCard
            title="Total Deposits"
            value={formatCurrency(tradesSummary.total_deposit || 0)} 
            icon={<Building2 className="h-10 w-10 text-accent" />}
            valueClassName="text-success"
          />
        </div>
        <TradingResultsChart />
      </div>
      <AccountSection />
    </div>
  );
}

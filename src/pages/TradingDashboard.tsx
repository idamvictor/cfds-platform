import { StatCard } from "../components/dashboard/StatCard";
import { SuccessRateCard } from "../components/dashboard/SuccessRateCard";
import { TradingResultsChart } from "../components/dashboard/TradingResultsChart";
import { AccountSection } from "../components/dashboard/AccountSection";
import { Wallet, Coins, PiggyBank, Building2 } from "lucide-react";

export default function TradingDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6 bg-background text-foreground min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First row */}
        <StatCard
          title="Total Balance"
          value="$710.05"
          icon={<Wallet className="h-10 w-10 text-primary/80" />}
        />

        <StatCard
          title="Total PNL"
          value="$460.05"
          icon={<Coins className="h-10 w-10 text-primary/80" />}
          footnote="* using current exchange rate"
        />

        <SuccessRateCard successRate={93.9} />

        {/* Second row */}
        <StatCard
          title="Profitable Orders"
          value="77 / 82"
          icon={<PiggyBank className="h-10 w-10 text-primary/80" />}
        />

        <StatCard
          title="Total Deposits"
          value="$250.00"
          icon={<Building2 className="h-10 w-10 text-primary/80" />}
          valueClassName="text-success"
        />
      </div>

      <TradingResultsChart />

      <AccountSection />
    </div>
  );
}

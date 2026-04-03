import * as React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartData {
  name: string;
  value: number;
}

const generateEmptyData = (period: "week" | "month"): ChartData[] => {
  if (period === "week") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      name: day,
      value: 0,
    }));
  }

  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month) => ({
    name: month,
    value: 0,
  }));
};

export function TradingResultsChart() {
  const [activeTab, setActiveTab] = React.useState<"week" | "month">("week");
  const user = useUserStore((state) => state.user);
  const { formatCurrency } = useCurrency();

  const tradesSummary = user?.trades_summary;
  const hasTradeData = tradesSummary && tradesSummary.trades_count > 0;

  const chartData = React.useMemo(() => {
    if (!hasTradeData) {
      return generateEmptyData(activeTab);
    }

    const totalPnl = tradesSummary?.total_pnl || 0;
    const data = generateEmptyData(activeTab);
    const perPeriodValue = totalPnl / data.length;

    return data.map((item, index) => ({
      name: item.name,
      value: perPeriodValue * (index + 1),
    }));
  }, [activeTab, hasTradeData, tradesSummary]);

  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-white/8 bg-[#111926] px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <p className="text-xs uppercase tracking-[0.16em] text-[#7e8ba2]">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {formatCurrency(payload[0].value as number)}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <h2 className="text-[15px] sm:text-[17px] font-semibold tracking-tight text-white">
              Trading Results
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0f2c21] px-2.5 py-1 text-xs font-semibold text-[#16e28d]">
              <span className="h-2 w-2 rounded-full bg-[#16e28d]" />
              LIVE
            </span>
          </div>
          {!hasTradeData && (
            <p className="mt-1 text-sm text-[#68758c]">
              No trading data available
            </p>
          )}
        </div>

        <Tabs
          defaultValue="week"
          onValueChange={(value) => setActiveTab(value as "week" | "month")}
          className="items-end"
        >
          <TabsList className="h-11 rounded-xl border border-white/6 bg-[#111826] p-1">
            <TabsTrigger
              value="week"
              className="rounded-lg px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a879d] data-[state=active]:bg-[#1b2534] data-[state=active]:text-white dark:data-[state=active]:bg-[#1b2534]"
            >
              1W
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="rounded-lg px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a879d] data-[state=active]:bg-[#1b2534] data-[state=active]:text-white dark:data-[state=active]:bg-[#1b2534]"
            >
              1M
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="relative overflow-hidden rounded-[22px] border border-white/6 bg-[#0d131d] p-4 shadow-none">
        {!hasTradeData && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="text-lg font-semibold text-white/10">
              Start trading to see your performance chart
            </p>
          </div>
        )}

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#273143"
                opacity={0.45}
              />
              <XAxis
                dataKey="name"
                stroke="#607089"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#607089"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#1fe28f", strokeOpacity: 0.2 }}
              />
              <defs>
                <linearGradient
                  id="dashboardAreaFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#16e28d" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#16e28d" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#16e28d"
                fill="url(#dashboardAreaFill)"
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0, fill: "#16e28d" }}
                activeDot={{
                  r: 5,
                  fill: "#16e28d",
                  stroke: "#0d131d",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

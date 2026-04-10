import * as React from "react";
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

type Period = "week" | "month" | "3m" | "1y";

const generateEmptyData = (period: Period): ChartData[] => {
  if (period === "week") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      name: day,
      value: 0,
    }));
  }

  if (period === "3m") {
    return ["M1", "M2", "M3"].map((m) => ({
      name: m,
      value: 0,
    }));
  }

  if (period === "1y") {
    return ["Q1", "Q2", "Q3", "Q4"].map((q) => ({
      name: q,
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

const TAB_OPTIONS: { label: string; value: Period }[] = [
  { label: "1W", value: "week" },
  { label: "1M", value: "month" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
];

export function TradingResultsChart() {
  const [activeTab, setActiveTab] = React.useState<Period>("week");
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
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[0.88rem] font-bold text-[#eef2f7]">
              Trading Results
            </h2>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1ED760] shadow-[0_0_8px_#1ED760] animate-[pulse_2s_ease-in-out_infinite]" />
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.06em] text-[#1ED760]">
              Live
            </span>
          </div>
          {!hasTradeData && (
            <p className="mt-0.5 text-[0.72rem] text-[#4a5468] font-medium">
              No trading data available
            </p>
          )}
        </div>

        <div className="flex gap-0.5 rounded-lg bg-white/[0.03] p-0.5">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-md px-3 py-[5px] font-[Inter,sans-serif] text-[0.68rem] font-bold transition-all ${
                activeTab === tab.value
                  ? "bg-white/[0.08] text-[#eef2f7]"
                  : "text-[#4a5468] hover:text-[#eef2f7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[240px]">
        {!hasTradeData && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[0.82rem] font-medium text-[#4a5468]">
            Start trading to see your performance chart
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              opacity={1}
            />
            <XAxis
              dataKey="name"
              stroke="rgba(139,151,168,0.5)"
              fontSize={10}
              fontWeight={500}
              fontFamily="Inter, sans-serif"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(139,151,168,0.5)"
              fontSize={10}
              fontWeight={500}
              fontFamily="Inter, sans-serif"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#00dfa2", strokeOpacity: 0.2 }}
            />
            <defs>
              <linearGradient
                id="dashboardAreaFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#00dfa2" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00dfa2" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00dfa2"
              fill="url(#dashboardAreaFill)"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 0, fill: "#00dfa2" }}
              activeDot={{
                r: 5,
                fill: "#00dfa2",
                stroke: "#0a0d15",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

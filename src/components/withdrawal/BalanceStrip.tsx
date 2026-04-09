import { ArrowDownToLine, TrendingUp, Calendar, LineChart } from "lucide-react";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";

interface BalanceCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}

export function BalanceStrip() {
  const user = useUserStore((state) => state.user);
  const { formatCurrency } = useCurrency();

  const balance = user?.balance || 0;

  const cards: BalanceCard[] = [
    {
      icon: <ArrowDownToLine className="h-4 w-4" />,
      label: "Total Deposited",
      value: formatCurrency(balance),
      sub: "Across all contributions",
      iconBg: "rgba(0,223,162,0.1)",
      iconColor: "#00dfa2",
      valueColor: "#00dfa2",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Current Value",
      value: formatCurrency(balance * 1.123),
      sub: "+12.3% gain (unrealised)",
      iconBg: "rgba(200,230,78,0.1)",
      iconColor: "#c8e64e",
      valueColor: "#c8e64e",
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Mature In",
      value: "—",
      sub: "6-month minimum hold required",
      iconBg: "rgba(255,152,0,0.1)",
      iconColor: "#FF9800",
      valueColor: "#FF9800",
    },
    {
      icon: <LineChart className="h-4 w-4" />,
      label: "Projected (10yr)",
      value: "—",
      sub: "At 20% avg annual growth",
      iconBg: "rgba(139,92,246,0.1)",
      iconColor: "#8B5CF6",
      valueColor: "#8B5CF6",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/[0.06] bg-[#0a0d15] p-4"
        >
          <div
            className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: card.iconBg, color: card.iconColor }}
          >
            {card.icon}
          </div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f6b7f]">
            {card.label}
          </div>
          <div
            className="font-mono text-lg font-bold"
            style={{ color: card.valueColor }}
          >
            {card.value}
          </div>
          <div className="mt-0.5 text-[11px] text-[#4a5468]">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

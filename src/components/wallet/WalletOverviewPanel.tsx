import { Wallet, CircleCheck, ChartLine, Clock } from "lucide-react";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";

export function WalletOverviewPanel() {
  const user = useUserStore((state) => state.user);
  const { formatCurrency } = useCurrency();
  const balance = user?.balance || 0;

  const cards = [
    {
      label: "Net Portfolio",
      value: formatCurrency(balance),
      sub: "Total wallet value",
      icon: Wallet,
      valueColor: "#00ffc3",
    },
    {
      label: "Available",
      value: formatCurrency(balance),
      sub: "Ready to trade",
      icon: CircleCheck,
      valueColor: "#00dfa2",
    },
    {
      label: "Trade Balance",
      value: "—",
      sub: "In active positions",
      icon: ChartLine,
      valueColor: "#00dfa2",
    },
    {
      label: "Pending Orders",
      value: "—",
      sub: "Open limit orders",
      icon: Clock,
      valueColor: "#00dfa2",
    },
  ];

  return (
    <div>
      {/* Balance row */}
      <div className="mb-7 grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-[14px] border-[1.5px] border-[rgba(255,255,255,0.08)] p-[18px_20px] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
              style={{
                background:
                  "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[14px]"
                style={{
                  background:
                    "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-[14px]"
                style={{
                  background:
                    "linear-gradient(90deg,#00dfa2,#00ffc3)",
                }}
              />
              <div className="relative">
                <div
                  className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-[9px]"
                  style={{
                    background: "rgba(0,223,162,0.1)",
                    color: "#00dfa2",
                  }}
                >
                  <Icon className="h-[0.82rem] w-[0.82rem]" />
                </div>
                <div className="mb-[7px] text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#3a4556]">
                  {card.label}
                </div>
                <div
                  className="mb-[3px] font-mono text-[1.4rem] font-bold leading-none"
                  style={{ color: card.valueColor }}
                >
                  {card.value}
                </div>
                <div className="text-[0.72rem] text-[#4a5468]">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

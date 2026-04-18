import { Zap, ChartLine, ChartBar } from "lucide-react";

const STRENGTH_PCT = 72;

const STRENGTH_STATS = [
  { label: "Win Rate", value: "68%", color: "#00dfa2" },
  { label: "Avg Trade", value: "$482", color: "#eef2f7" },
  { label: "Trades", value: "142", color: "#eef2f7" },
  { label: "Streak", value: "+5", color: "#00dfa2" },
];

export function WalletOverviewExtras() {
  return (
    <div className="mb-7 flex flex-col gap-[14px]">
      {/* Trading Strength */}
      <div
        className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.08)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{
          background:
            "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
          }}
        />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2.5 text-[0.95rem] font-extrabold text-[#eef2f7]">
            <Zap className="h-4 w-4 text-[#00dfa2]" />
            Trading Strength
          </div>
          <div className="mb-3 flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-[6px] bg-[rgba(255,255,255,0.06)]">
              <div
                className="h-full rounded-[6px]"
                style={{
                  width: `${STRENGTH_PCT}%`,
                  background: "linear-gradient(90deg,#00dfa2,#00ffc3)",
                  transition: "width .8s",
                }}
              />
            </div>
            <span className="font-mono text-[0.88rem] font-bold text-[#00dfa2]">
              {STRENGTH_PCT}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {STRENGTH_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-lg p-2 text-center"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="mb-[3px] text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#3a4556]">
                  {s.label}
                </div>
                <div
                  className="font-mono text-[0.85rem] font-bold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Realised / Unrealised P&L */}
      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <div
          className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.08)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
          style={{
            background:
              "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
            }}
          />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-[0.82rem] font-extrabold text-[#eef2f7]">
              <ChartLine className="h-[0.82rem] w-[0.82rem] text-[#00dfa2]" />
              Realised P&amp;L
            </div>
            <div className="font-mono text-[1.6rem] font-extrabold leading-none text-[#00dfa2]">
              +$342.18
            </div>
            <div className="mt-1 text-[0.75rem] text-[#4a5468]">This month</div>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.08)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
          style={{
            background:
              "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
            }}
          />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-[0.82rem] font-extrabold text-[#eef2f7]">
              <ChartBar className="h-[0.82rem] w-[0.82rem] text-[#00dfa2]" />
              Unrealised P&amp;L
            </div>
            <div className="font-mono text-[1.6rem] font-extrabold leading-none text-[#00dfa2]">
              +$1,204.30
            </div>
            <div className="mt-1 text-[0.75rem] text-[#4a5468]">
              Open positions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

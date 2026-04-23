import { Scale, Flag, Check, Star } from "lucide-react";

const tiers = [
  {
    icon: "!",
    label: "Within 6-Month Hold",
    sub: "Early withdrawal, no exception",
    pct: "10% + CGT",
    bg: "rgba(255,51,85,0.08)",
    border: "rgba(255,51,85,0.2)",
    iconBg: "rgba(255,51,85,0.2)",
    color: "#FF3355",
  },
  {
    icon: "~",
    label: "Qualified Exception",
    sub: "Education, hardship, disability",
    pct: "CGT Only",
    bg: "rgba(255,152,0,0.06)",
    border: "rgba(255,152,0,0.2)",
    iconBg: "rgba(255,152,0,0.1)",
    color: "#FF9800",
  },
  {
    icon: <Check className="h-3 w-3" />,
    label: "After 6-Month Hold Period",
    sub: "Penalty-free access",
    pct: "Zero Fee",
    bg: "rgba(0,223,162,0.06)",
    border: "rgba(0,223,162,0.25)",
    iconBg: "rgba(0,223,162,0.1)",
    color: "#00dfa2",
  },
  {
    icon: <Star className="h-3 w-3" />,
    label: "5-Year Long-Term Hold",
    sub: "Optimal tax-efficient exit",
    pct: "Zero + Tax opt.",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    iconBg: "rgba(139,92,246,0.15)",
    color: "#8B5CF6",
  },
];

const milestones = [
  { label: "Account Opened", value: "Oct 15, 2025", color: "#a8b5c8" },
  { label: "6-Month Hold End", value: "Apr 15, 2026", color: "#FF9800" },
  { label: "5-Year Long-Term", value: "Oct 15, 2030", color: "#8B5CF6" },
  { label: "No Exit Fees", value: "From Apr 15, 2026", color: "#00dfa2" },
  { label: "No Forced Distributions", value: "Indefinitely", color: "#00dfa2" },
];

export function PenaltySchedule() {
  return (
    <div className="flex flex-col gap-4">
      {/* Penalty Tiers */}
      <div
        className="rounded-2xl border border-white/[0.06] p-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        }}
      >
        <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-white">
          <Scale className="h-4 w-4 text-[#FF9800]" />
          Penalty Schedule
        </div>
        <div className="flex flex-col gap-2">
          {tiers.map((tier) => (
            <div
              key={tier.label}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: tier.bg, border: `1px solid ${tier.border}` }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-extrabold"
                style={{ background: tier.iconBg, color: tier.color }}
              >
                {tier.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white">{tier.label}</div>
                <div className="text-[11px] text-[#4a5468]">{tier.sub}</div>
              </div>
              <div
                className="flex-shrink-0 font-mono text-xs font-extrabold"
                style={{ color: tier.color }}
              >
                {tier.pct}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hold Milestones */}
      <div
        className="rounded-2xl border border-white/[0.06] p-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        }}
      >
        <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-white">
          <Flag className="h-4 w-4 text-[#c8e64e]" />
          Hold Period Milestones
        </div>
        <div className="flex flex-col">
          {milestones.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between border-b border-white/[0.04] py-2 text-xs last:border-b-0"
            >
              <span className="text-[#4a5468]">{m.label}</span>
              <span className="font-mono font-semibold" style={{ color: m.color }}>
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

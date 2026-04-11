import { Link } from "react-router-dom";
import { ArrowRight, Crown } from "lucide-react";

interface TradingPlanCardProps {
  planTitle?: string;
  leverage?: number;
  image?: string;
  color?: string;
}

export function TradingPlanCard({
  planTitle,
  leverage,
  image,
  color,
}: TradingPlanCardProps) {
  const accent = color || "#00dfa2";

  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Trading Plan
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08]"
          style={{ background: `${accent}1A` }}
        >
          {image ? (
            <img
              src={image}
              alt={planTitle || "Plan"}
              className="h-full w-full object-cover"
            />
          ) : (
            <Crown className="h-5 w-5" style={{ color: accent }} />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[#eef2f7]">
            {planTitle || "Basic"}
          </p>
          <p className="truncate text-[10px] font-medium text-[#4a5468]">
            Current account plan
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Row label="Plan" value={planTitle || "Basic"} />
        <Row
          label="Leverage"
          value={leverage ? `1:${leverage}` : "1:1"}
          highlight={accent}
        />
      </div>

      <Link
        to="/main/marketplace"
        className="group mt-5 flex items-center gap-3 rounded-lg border border-[#00dfa2]/20 bg-[#00dfa2]/[0.06] px-3 py-2.5 text-[#00dfa2] transition-all hover:border-[#00dfa2]/40 hover:bg-[#00dfa2]/[0.1]"
      >
        <Crown className="h-4 w-4" />
        <span className="flex-1 text-xs font-bold">Upgrade Plan</span>
        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </Link>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] py-2 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
        {label}
      </span>
      <span
        className="truncate text-xs font-bold capitalize"
        style={{ color: highlight || "#eef2f7" }}
      >
        {value}
      </span>
    </div>
  );
}

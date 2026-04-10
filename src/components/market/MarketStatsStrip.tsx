interface StatEntry {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  valueColor?: string;
}

interface MarketStatsStripProps {
  stats: StatEntry[];
}

export function MarketStatsStrip({ stats }: MarketStatsStripProps) {
  return (
    <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[10px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] p-3.5 text-center"
        >
          <div className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-[0.06em] text-[#4a5468]">
            {stat.label}
          </div>
          <div
            className={`font-mono text-[1rem] font-extrabold ${stat.valueColor || "text-[#eef2f7]"}`}
          >
            {stat.value}
          </div>
          <div className={`mt-0.5 text-[0.6rem] ${stat.subColor}`}>{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}

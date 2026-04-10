interface NewsEntry {
  tag: "breaking" | "analysis" | "bullish" | "alert";
  title: string;
  excerpt: string;
  src: string;
  time: string;
}

interface MarketNewsGridProps {
  news: NewsEntry[];
}

const TAG_STYLES: Record<NewsEntry["tag"], string> = {
  breaking: "bg-[rgba(244,63,94,0.1)] text-[#f43f5e]",
  analysis: "bg-[rgba(91,141,239,0.1)] text-[#5b8def]",
  bullish: "bg-[rgba(30,215,96,0.1)] text-[#1ED760]",
  alert: "bg-[rgba(255,152,0,0.08)] text-[#FF9800]",
};

export function MarketNewsGrid({ news }: MarketNewsGridProps) {
  return (
    <div className="mb-7 grid grid-cols-1 gap-3.5 md:grid-cols-2">
      {news.map((item, i) => (
        <div
          key={i}
          className="cursor-pointer rounded-[12px] border border-[rgba(255,255,255,0.05)] p-[16px_18px] transition-all duration-150 hover:-translate-y-px hover:border-[rgba(255,255,255,0.1)]"
          style={{
            background:
              "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))",
          }}
        >
          <span
            className={`mb-2 inline-block rounded px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.06em] ${TAG_STYLES[item.tag]}`}
          >
            {item.tag}
          </span>
          <div className="mb-1.5 text-[0.82rem] font-bold leading-[1.4] text-[#eef2f7]">
            {item.title}
          </div>
          <div className="mb-2 text-[0.72rem] leading-[1.5] text-[#4a5468]">
            {item.excerpt}
          </div>
          <div className="flex items-center gap-2 text-[0.62rem] text-[#3a4556]">
            <span className="font-bold text-[#4a5468]">{item.src}</span>
            <span>•</span>
            <span>{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

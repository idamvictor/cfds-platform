interface IndexEntry {
  name: string;
  sym: string;
  val: number;
  chg: number;
  pts: string;
  flag: string;
}

interface GlobalIndicesRowProps {
  indices: IndexEntry[];
}

export function GlobalIndicesRow({ indices }: GlobalIndicesRowProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {indices.map((idx) => {
        const up = idx.chg >= 0;
        return (
          <div
            key={idx.sym}
            className="relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.06)] p-4 transition-all duration-150 hover:-translate-y-px hover:border-[rgba(255,255,255,0.12)]"
            style={{
              background:
                "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-[14px]"
              style={{
                background:
                  "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
              }}
            />
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[0.74rem] font-bold text-[#eef2f7]">
                  {idx.name}
                </span>
                <span className="text-[0.95rem]">{idx.flag}</span>
              </div>
              <div className="mb-1 font-mono text-[1.1rem] font-extrabold text-[#eef2f7]">
                {idx.val.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-[0.72rem] font-bold ${
                    up ? "text-[#00dfa2]" : "text-[#f43f5e]"
                  }`}
                >
                  {up ? "+" : ""}
                  {idx.chg.toFixed(2)}%
                </span>
                <span className="font-mono text-[0.65rem] text-[#4a5468]">
                  {idx.pts}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

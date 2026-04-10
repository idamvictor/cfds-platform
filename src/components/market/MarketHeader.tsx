import { useEffect, useState } from "react";
import { Globe, Search, Menu } from "lucide-react";

interface MarketHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleSidebar?: () => void;
}

function UtcClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const n = new Date();
      setTime(
        `${String(n.getUTCHours()).padStart(2, "0")}:${String(
          n.getUTCMinutes(),
        ).padStart(2, "0")}:${String(n.getUTCSeconds()).padStart(2, "0")} UTC`,
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="rounded-[20px] border border-white/[0.05] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.72rem] font-medium text-[#8b97a8]"
      style={{ whiteSpace: "nowrap" }}
    >
      {time}
    </span>
  );
}

export function MarketHeader({
  searchTerm,
  onSearchChange,
  onToggleSidebar,
}: MarketHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-[#8b97a8] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
          >
            <Menu className="h-[1.05rem] w-[1.05rem]" />
          </button>
        )}
        <h1 className="flex items-center gap-2.5 font-[Outfit,sans-serif] text-[1.4rem] font-extrabold tracking-[-0.02em] text-[#eef2f7] sm:text-[1.65rem]">
          <Globe className="h-[1.1rem] w-[1.1rem] text-[#00dfa2]" />
          Markets
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00dfa2]/75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00dfa2]" />
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4a5468]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search markets..."
            className="h-9 w-[200px] rounded-[10px] border-[1.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] pl-9 pr-3 text-[0.78rem] text-[#eef2f7] placeholder:text-[#4a5468] outline-none transition-colors focus:border-[#00dfa2]/50 sm:w-[240px]"
          />
        </div>
        <UtcClock />
      </div>
    </div>
  );
}

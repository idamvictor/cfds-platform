import { ArrowDownToLine, ArrowUpFromLine, Lock } from "lucide-react";

interface ModeSwitchProps {
  activeMode: "deposit" | "withdraw";
  onModeChange: (mode: "deposit" | "withdraw") => void;
}

export function ModeSwitch({ activeMode, onModeChange }: ModeSwitchProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#0a0d15] p-1.5">
        <button
          type="button"
          onClick={() => onModeChange("deposit")}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
            activeMode === "deposit"
              ? "bg-gradient-to-br from-[#00dfa2] to-[#00b881] text-[#07080c] shadow-[0_4px_14px_rgba(0,223,162,0.3)]"
              : "text-[#4a5468]"
          }`}
        >
          <ArrowDownToLine className="h-4 w-4" />
          Contribute
        </button>
        <button
          type="button"
          onClick={() => onModeChange("withdraw")}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
            activeMode === "withdraw"
              ? "bg-gradient-to-br from-[#FF9800] to-[#e65100] text-white shadow-[0_4px_14px_rgba(255,152,0,0.3)]"
              : "text-[#4a5468]"
          }`}
        >
          <ArrowUpFromLine className="h-4 w-4" />
          Withdraw
        </button>
      </div>
      <span className="flex items-center gap-1.5 text-xs text-[#4a5468]">
        <Lock className="h-3 w-3 text-[#00dfa2]" />
        Deposits are actively managed. No trading fees within your portfolio.
      </span>
    </div>
  );
}

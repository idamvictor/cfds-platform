import { Receipt } from "lucide-react";

interface WithdrawalSummaryProps {
  coinSymbol: string;
  coinName: string;
  amount: string;
  network: string;
}

export function WithdrawalSummary({
  coinSymbol,
  coinName,
  amount,
  network,
}: WithdrawalSummaryProps) {
  const usdVal = parseFloat(amount.replace(/,/g, "")) || 0;
  // Presentational placeholder rate
  const cryptoAmount = usdVal > 0 ? (usdVal / 84210).toFixed(8) : "0.00000000";
  const feeEstimate = usdVal > 0 ? "~$4.20" : "$0.00";

  return (
    <div
      className="rounded-xl border-[1.5px] border-white/[0.06] p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#00dfa2]">
        <Receipt className="h-3.5 w-3.5" />
        Withdrawal Summary
      </div>
      <div className="flex flex-col">
        <SummaryRow label="Asset" value={`${coinSymbol} — ${coinName}`} valueColor="#c8e64e" />
        <SummaryRow label="USD Value" value={usdVal > 0 ? `$${usdVal.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"} />
        <SummaryRow label="Crypto Amount" value={`${cryptoAmount} ${coinSymbol}`} mono />
        <SummaryRow label="Network" value={network || "—"} />
        <SummaryRow label="Network Fee" value={feeEstimate} valueColor="#FF9800" />
        <SummaryRow label="Exit Fee" value="None (no staked funds)" valueColor="#00dfa2" />
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 mt-1">
          <span className="text-xs font-bold text-[#a8b5c8]">You Receive</span>
          <span className="font-mono text-sm font-extrabold text-[#00dfa2]">
            ~{cryptoAmount} {coinSymbol}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueColor,
  mono,
}: {
  label: string;
  value: string;
  valueColor?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-1.5 text-xs">
      <span className="text-[#4a5468]">{label}</span>
      <span
        className={`font-bold ${mono ? "font-mono" : ""}`}
        style={{ color: valueColor || "#eef2f7" }}
      >
        {value}
      </span>
    </div>
  );
}

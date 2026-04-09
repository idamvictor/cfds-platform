import { useState } from "react";
import { TriangleAlert, Percent, FileText, TrendingDown, Ban, Calculator } from "lucide-react";

const penaltyStats = [
  { value: "10%", label: "Early Exit Fee", color: "#FF3355" },
  { value: "6 mo", label: "Min Hold Period", color: "#FF9800" },
  { value: "0%", label: "Fee After Hold", color: "#00dfa2" },
  { value: "+CGT", label: "Tax Exposure", color: "#c8e64e" },
];

const warningRows = [
  {
    icon: <Percent className="h-3.5 w-3.5" />,
    title: "10% Early Exit Fee",
    desc: "A mandatory 10% fee on the gross withdrawal amount. Non-negotiable, applied before disbursement.",
  },
  {
    icon: <FileText className="h-3.5 w-3.5" />,
    title: "Jurisdictional Tax Exposure",
    desc: "Early exits reduce or eliminate the tax-efficient positioning benefits. CGT obligations may arise in your home jurisdiction.",
  },
  {
    icon: <TrendingDown className="h-3.5 w-3.5" />,
    title: "Forced Liquidation of Positions",
    desc: "All active portfolio positions are immediately force-closed at current market prices. Losses, if any, will be crystallised.",
  },
  {
    icon: <Ban className="h-3.5 w-3.5" />,
    title: "Loss of Compounding",
    desc: "Exiting permanently removes funds from the portfolio environment, forfeiting years of tax-efficient compound growth.",
  },
];

const reasons = [
  {
    id: "hardship",
    title: "Financial Hardship",
    desc: "Medical, disability, or unexpected financial emergency. 10% exit fee still applies.",
  },
  {
    id: "education",
    title: "Qualified Education",
    desc: "Higher education expenses for yourself or dependents.",
  },
  {
    id: "realloc",
    title: "Portfolio Reallocation",
    desc: "Moving capital to another approved investment vehicle.",
  },
  {
    id: "other",
    title: "Other / General",
    desc: "Full 10% early exit fee applies. No exceptions.",
  },
];

const positions = [
  { sym: "BTC", glyph: "₿", color: "#F7931A", side: "Long", qty: "0.482 BTC", entry: "$72,400", pnl: "+$5,684", pnlColor: "#00dfa2", impact: "Would retain", impactType: "green" as const },
  { sym: "ETH", glyph: "Ξ", color: "#627EEA", side: "Long", qty: "12.5 ETH", entry: "$2,450", pnl: "-$3,437", pnlColor: "#FF3355", impact: "Locked in loss", impactType: "red" as const },
  { sym: "SOL", glyph: "◎", color: "#9945FF", side: "Long", qty: "88.2 SOL", entry: "$96.50", pnl: "-$432", pnlColor: "#FF3355", impact: "Locked in loss", impactType: "red" as const },
];

export function StakedWithdrawalPanel() {
  const [selectedReason, setSelectedReason] = useState("hardship");
  const [agreed, setAgreed] = useState(false);
  const withdrawalAmount = 10000;
  const penalty = withdrawalAmount * 0.1;
  const tax = withdrawalAmount * 0.216;
  const net = withdrawalAmount - penalty - tax + 1815;

  return (
    <div className="flex flex-col gap-4">
      {/* Penalty Banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#FF3355]/30 bg-gradient-to-br from-[#FF3355]/10 to-[#FF3355]/[0.03] p-5">
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#FF3355] via-[#ff6b35] to-[#FF3355]" />
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#FF3355]/40 bg-[#FF3355]/20">
            <Percent className="h-5 w-5 text-[#FF3355]" />
          </div>
          <div>
            <div className="text-base font-extrabold text-white">10% Early Exit Penalty Applies</div>
            <div className="text-xs text-white/55">You have active staked positions. Exiting before the 6-month hold period incurs a 10% fee.</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {penaltyStats.map((s) => (
            <div key={s.label} className="rounded-xl bg-black/25 border border-[#FF3355]/20 p-2.5 text-center">
              <div className="font-mono text-lg font-extrabold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5f6b7f]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#FF9800]/30 bg-gradient-to-br from-[#FF9800]/[0.07] to-[#FF9800]/[0.02] p-5">
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#FF9800] via-[#ff6d00] to-[#FF9800] animate-pulse" />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#FF9800]">
            <TriangleAlert className="h-3.5 w-3.5" />
            Time Until Penalty-Free Exit
          </div>
          <div className="rounded-full border border-[#FF9800]/30 bg-[#FF9800]/10 px-3 py-1 text-[11px] font-bold text-[#FF9800]">
            Hold Started: Oct 15, 2025
          </div>
        </div>
        <div className="mb-4 grid grid-cols-4 gap-2.5">
          {[
            { num: "0", label: "Years" },
            { num: "0", label: "Months" },
            { num: "17", label: "Days" },
            { num: "8", label: "Hours" },
          ].map((u) => (
            <div key={u.label} className="rounded-xl border border-[#FF9800]/20 bg-black/30 p-3 text-center">
              <div className="font-mono text-2xl font-extrabold text-white">{u.num}</div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5f6b7f]">{u.label}</div>
            </div>
          ))}
        </div>
        <div className="mb-1.5 flex justify-between text-[11px] text-[#5f6b7f]">
          <span>Oct 15, 2025</span>
          <span className="font-bold text-[#FF9800]">1.8%</span>
          <span>Apr 15, 2026 (6-mo hold end)</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-[1.8%] rounded-full bg-gradient-to-r from-[#FF9800] to-[#ff6d00] transition-all duration-1000" />
        </div>
        <div className="mt-2 text-center text-xs text-[#4a5468]">
          <TriangleAlert className="mr-1 inline h-3 w-3 text-[#FF9800]" />
          Early exit is subject to a <strong className="text-[#FF3355]">10% early exit fee</strong> on the gross withdrawal amount
        </div>
      </div>

      {/* Warning */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#FF3355]/35 bg-gradient-to-br from-[#FF3355]/10 to-[#FF3355]/[0.03] p-5">
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#FF3355] via-[#ff6b35] to-[#FF3355]" />
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#FF3355]/30 bg-[#FF3355]/15">
            <TriangleAlert className="h-4 w-4 text-[#FF3355]" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#FF3355]">Early Withdrawal Warning — Read Before Proceeding</div>
            <div className="text-[11px] text-[#4a5468]">Exiting before the 6-month hold period ends will trigger the following:</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {warningRows.map((row) => (
            <div key={row.title} className="flex items-start gap-2.5 rounded-lg border-l-[3px] border-[#FF3355]/50 bg-black/25 px-3 py-2.5">
              <span className="mt-0.5 flex-shrink-0 text-[#FF3355]">{row.icon}</span>
              <div className="text-xs text-[#a8b5c8] leading-relaxed">
                <strong className="text-white">{row.title}</strong> — {row.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="rounded-2xl border-[1.5px] border-white/[0.06] bg-[#0f1220] p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-white">
          <TriangleAlert className="h-4 w-4 text-[#FF9800]" />
          Open Positions That Will Be Force-Closed
        </div>
        <div className="flex flex-col">
          {positions.map((pos) => (
            <div key={pos.sym} className="flex items-center gap-3 border-b border-white/[0.04] py-2.5 last:border-b-0">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-extrabold" style={{ background: `${pos.color}22`, color: pos.color }}>
                {pos.glyph}
              </div>
              <div className="w-10 flex-shrink-0 text-sm font-extrabold text-white">{pos.sym}</div>
              <div className="flex-1 text-xs text-[#a8b5c8]">
                {pos.side} · {pos.qty} · Entry {pos.entry}
                <br />
                <span style={{ color: pos.pnlColor }} className="text-[11px]">
                  {pos.pnl} unrealized {parseFloat(pos.pnl.replace(/[$,]/g, "")) > 0 ? "gain" : "loss"}
                </span>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold" style={{ color: pos.pnlColor }}>{pos.pnl}</div>
                <div
                  className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    background: pos.impactType === "green" ? "rgba(0,223,162,0.1)" : "rgba(255,51,85,0.1)",
                    color: pos.impactType === "green" ? "#00dfa2" : "#FF3355",
                    border: `1px solid ${pos.impactType === "green" ? "rgba(0,223,162,0.25)" : "rgba(255,51,85,0.25)"}`,
                  }}
                >
                  {pos.impact}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-xs text-[#4a5468]">
          <span>Net position impact on withdrawal:</span>
          <span className="font-mono font-bold text-[#FF9800]">+$1,815 net (after force-close)</span>
        </div>
      </div>

      {/* Reason Selection */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0f1220] p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-white">
          <TriangleAlert className="h-4 w-4 text-[#FF9800]" />
          Withdrawal Request
        </div>

        <div className="mb-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">Withdrawal Reason</div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {reasons.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReason(r.id)}
                className={`rounded-xl border-[1.5px] p-3.5 text-left transition-all duration-200 ${
                  selectedReason === r.id
                    ? "border-[#FF9800] bg-[#FF9800]/[0.06] shadow-[0_0_0_1px_#FF9800]"
                    : "border-white/[0.06] bg-[#131a28] hover:border-[#FF9800]/50"
                }`}
              >
                <div className="text-xs font-bold text-white">{r.title}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-[#4a5468]">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Penalty Calculator */}
        <div className="rounded-xl border-[1.5px] border-[#FF3355]/25 bg-gradient-to-br from-[#FF3355]/[0.06] to-[#FF3355]/[0.02] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-[#FF3355]">
            <Calculator className="h-3.5 w-3.5" />
            Early Exit Cost Breakdown
          </div>
          <div className="flex flex-col">
            <CalcRow label="Gross Withdrawal" value={`$${withdrawalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
            <CalcRow label="10% Early Exit Fee" value={`-$${penalty.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} color="#FF3355" />
            <CalcRow label="Est. CGT Exposure (jurisdiction dependent)" value={`-$${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} color="#FF3355" />
            <CalcRow label="Force-Close Net Impact" value="+$1,815.00" color="#FF9800" />
            <div className="mt-1 flex items-center justify-between border-t border-[#FF3355]/30 pt-2 text-xs">
              <span className="font-bold text-white">Net Amount Received</span>
              <span className="font-mono text-sm font-extrabold text-[#FF3355]">${net.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-2 text-center text-[11px] text-[#5f6b7f]">
              Effective cost of early withdrawal: <span className="font-bold text-[#FF3355]">13.45% loss</span>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#FF3355]/20 bg-[#FF3355]/[0.04] p-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 flex-shrink-0 accent-[#FF3355] cursor-pointer"
          />
          <label className="cursor-pointer text-[11px] leading-relaxed text-[#a8b5c8]" onClick={() => setAgreed(!agreed)}>
            I fully understand that this is an <strong className="text-[#FF3355]">early exit before the 6-month hold period</strong>, that a{" "}
            <strong className="text-[#FF3355]">10% early exit fee</strong> will be applied, that all open positions will be{" "}
            <strong className="text-[#FF3355]">force-closed at market price</strong>, and that I accept any resulting losses. This action is{" "}
            <strong>irreversible</strong>.
          </label>
        </div>

        <button
          type="button"
          disabled={!agreed}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#FF9800] to-[#e65100] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(255,152,0,0.25)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(255,152,0,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:translate-y-0"
        >
          <TriangleAlert className="h-4 w-4" />
          Proceed with Early Withdrawal
        </button>
      </div>
    </div>
  );
}

function CalcRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-1.5 text-xs">
      <span className="text-[#4a5468]">{label}</span>
      <span className="font-mono font-bold" style={{ color: color || "#eef2f7" }}>{value}</span>
    </div>
  );
}

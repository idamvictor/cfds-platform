import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Clock, Flame, Tag, Zap, Droplets, ShieldCheck } from "lucide-react";

type SortMode = "popular" | "fee" | "speed";

interface ExchangePartner {
  name: string;
  abbr: string;
  color: string;
  textColor: string;
  via: string;
  tradeFee: string;
  tradeFeeNum: number;
  wireFee: string;
  wireFeeNum: number;
  totalFee: string;
  totalFeeNum: number;
  totalCost: string;
  time: string;
  timeRank: number;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  badgeIcon: React.ReactNode;
  popularRank: number;
}

const PARTNERS: ExchangePartner[] = [
  {
    name: "Coinbase",
    abbr: "CB",
    color: "#1652F0",
    textColor: "#fff",
    via: "via Bank Wire",
    tradeFee: "1.49%",
    tradeFeeNum: 1.49,
    wireFee: "$10",
    wireFeeNum: 10,
    totalFee: "1.69%",
    totalFeeNum: 1.69,
    totalCost: "$5,084.50",
    time: "3-5 business days",
    timeRank: 4,
    badge: "Most Popular",
    badgeBg: "rgba(0,223,162,0.12)",
    badgeColor: "#00dfa2",
    badgeIcon: <Flame className="h-2.5 w-2.5" />,
    popularRank: 1,
  },
  {
    name: "Kraken",
    abbr: "KR",
    color: "#5741D9",
    textColor: "#fff",
    via: "via Bank Wire",
    tradeFee: "0.90%",
    tradeFeeNum: 0.9,
    wireFee: "$5",
    wireFeeNum: 5,
    totalFee: "1.00%",
    totalFeeNum: 1.0,
    totalCost: "$5,050.00",
    time: "1-3 business days",
    timeRank: 2,
    badge: "Lowest Fees",
    badgeBg: "rgba(200,230,78,0.12)",
    badgeColor: "#c8e64e",
    badgeIcon: <Tag className="h-2.5 w-2.5" />,
    popularRank: 2,
  },
  {
    name: "Binance",
    abbr: "BN",
    color: "#F3BA2F",
    textColor: "#1A1A2E",
    via: "via Bank Wire",
    tradeFee: "1.00%",
    tradeFeeNum: 1.0,
    wireFee: "$0",
    wireFeeNum: 0,
    totalFee: "1.00%",
    totalFeeNum: 1.0,
    totalCost: "$5,050.00",
    time: "1-2 business days",
    timeRank: 1,
    badge: "Best Liquidity",
    badgeBg: "rgba(74,144,226,0.12)",
    badgeColor: "#4A90E2",
    badgeIcon: <Droplets className="h-2.5 w-2.5" />,
    popularRank: 3,
  },
  {
    name: "Gemini",
    abbr: "GM",
    color: "#00DCFA",
    textColor: "#0A0A2E",
    via: "via Bank Wire",
    tradeFee: "1.49%",
    tradeFeeNum: 1.49,
    wireFee: "$0",
    wireFeeNum: 0,
    totalFee: "1.49%",
    totalFeeNum: 1.49,
    totalCost: "$5,074.50",
    time: "4-5 business days",
    timeRank: 5,
    badge: "Fully Insured",
    badgeBg: "rgba(100,200,255,0.12)",
    badgeColor: "#64C8FF",
    badgeIcon: <ShieldCheck className="h-2.5 w-2.5" />,
    popularRank: 4,
  },
  {
    name: "Bybit",
    abbr: "BB",
    color: "#F7A600",
    textColor: "#fff",
    via: "via Bank Wire",
    tradeFee: "0.75%",
    tradeFeeNum: 0.75,
    wireFee: "$0",
    wireFeeNum: 0,
    totalFee: "0.75%",
    totalFeeNum: 0.75,
    totalCost: "$5,037.50",
    time: "1-2 business days",
    timeRank: 1,
    badge: "Fastest",
    badgeBg: "rgba(255,107,26,0.12)",
    badgeColor: "#FF6B1A",
    badgeIcon: <Zap className="h-2.5 w-2.5" />,
    popularRank: 5,
  },
];

interface ExchangePartnersProps {
  onBack?: () => void;
}

export function ExchangePartners({ onBack }: ExchangePartnersProps) {
  const [sortMode, setSortMode] = useState<SortMode>("popular");

  const sorted = useMemo(() => {
    const copy = [...PARTNERS];
    switch (sortMode) {
      case "popular":
        return copy.sort((a, b) => a.popularRank - b.popularRank);
      case "fee":
        return copy.sort((a, b) => a.totalFeeNum - b.totalFeeNum);
      case "speed":
        return copy.sort((a, b) => a.timeRank - b.timeRank);
      default:
        return copy;
    }
  }, [sortMode]);

  const sortButtons: { mode: SortMode; label: string }[] = [
    { mode: "popular", label: "Most Popular" },
    { mode: "fee", label: "Lowest Fee" },
    { mode: "speed", label: "Fastest" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f1220]/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#00dfa2]/[0.05] blur-3xl" />

      <div className="relative">
        {/* Step header */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00ffc3] to-[#00dfa2] text-xs font-extrabold text-[#07080c] shadow-[0_4px_12px_rgba(0,223,162,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]">
            2
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">
              Select Exchange Partner
            </div>
            <div className="text-xs text-[#4a5468]">
              You'll be redirected to sign in and complete the purchase — funds
              deposit directly to your wallet
            </div>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {sortButtons.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSortMode(mode)}
              className={`rounded-lg border px-3.5 py-1.5 text-xs font-bold backdrop-blur-md transition-all duration-200 ${
                sortMode === mode
                  ? "border-[#00dfa2]/40 bg-[#00dfa2]/10 text-[#00dfa2] shadow-[0_0_0_1px_rgba(0,223,162,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]"
                  : "border-white/[0.06] bg-white/[0.02] text-[#4a5468] hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-[#8b97a8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Back button */}
        {onBack && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-bold text-[#8b97a8] backdrop-blur-md transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" />
              Change Method
            </button>
          </div>
        )}

        {/* Exchange cards grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sorted.map((p) => (
            <div
              key={p.name}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#0a0d15]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#0a0d15]/80 hover:shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,223,162,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              {/* Hover accent bar */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-transparent transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-[#00dfa2] group-hover:to-transparent" />

              {/* Card top */}
              <div
                className="flex items-center gap-2.5 border-b border-white/[0.05] px-4 py-3"
                style={{
                  background: `linear-gradient(135deg, ${p.color}14, ${p.color}06 55%, transparent)`,
                }}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[13px] font-black tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.3)]"
                  style={{ background: p.color, color: p.textColor }}
                >
                  {p.abbr}
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-extrabold text-white">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-[#4a5468]">{p.via}</div>
                </div>
                <span
                  className="flex items-center gap-1 rounded-full border border-white/[0.04] px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm"
                  style={{
                    background: p.badgeBg,
                    color: p.badgeColor,
                  }}
                >
                  {p.badgeIcon}
                  {p.badge}
                </span>
              </div>

              {/* Fee grid */}
              <div className="flex-1 px-4 py-3">
                <div className="mb-2.5 grid grid-cols-3 gap-2">
                  {[
                    { label: "Trade Fee", value: p.tradeFee, highlight: false },
                    { label: "Wire Fee", value: p.wireFee, highlight: false },
                    { label: "Total Fee", value: p.totalFee, highlight: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-md border px-1 py-2 text-center backdrop-blur-sm ${
                        item.highlight
                          ? "border-[#c8e64e]/15 bg-[#c8e64e]/[0.04]"
                          : "border-white/[0.04] bg-white/[0.02]"
                      }`}
                    >
                      <div className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#4a5468]">
                        {item.label}
                      </div>
                      <div
                        className={`font-mono text-[13px] font-extrabold ${
                          item.highlight ? "text-[#c8e64e]" : "text-white"
                        }`}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total cost row */}
                <div className="mb-2.5 flex items-center justify-between border-y border-white/[0.05] py-2">
                  <span className="text-[11px] text-[#4a5468]">
                    Total Est. Cost
                  </span>
                  <span className="font-mono text-sm font-extrabold text-white">
                    {p.totalCost}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#4a5468]">
                  <Clock className="h-3 w-3" />
                  {p.time}
                </div>
              </div>

              {/* Buy button */}
              <div className="px-4 pb-4">
                <button
                  type="button"
                  className="relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-lg px-4 py-2.5 text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-200 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_18px_rgba(0,0,0,0.35)]"
                  style={{
                    background: `linear-gradient(180deg, ${p.color}, ${p.color}e6)`,
                    color: p.textColor,
                  }}
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
                  <ArrowRight className="relative h-3.5 w-3.5" />
                  <span className="relative">Buy via {p.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

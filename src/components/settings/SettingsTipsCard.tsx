import { Lightbulb } from "lucide-react";

const TIPS = [
  "Enable two-factor authentication to add an extra layer of protection.",
  "Choose a display currency that matches how you track your portfolio.",
  "Switch language anytime — your preference is saved per device.",
  "Review your security settings every few weeks to stay safe.",
];

export function SettingsTipsCard() {
  return (
    <div
      className="relative rounded-2xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-7"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Settings Tips
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
        <Lightbulb className="h-4 w-4 text-[#FF9800]" />
      </div>

      <ul className="space-y-2.5">
        {TIPS.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00dfa2]/60" />
            <span className="text-[11px] leading-relaxed text-[#8b97a8]">
              {tip}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

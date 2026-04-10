import { Lightbulb } from "lucide-react";

const TIPS = [
  "Keep your contact details up to date so you never miss security alerts.",
  "Use a clear profile photo — it helps support verify you faster.",
  "Your legal name and date of birth must match your KYC documents.",
  "Update your address whenever you move to keep statements accurate.",
];

export function ProfileTipsCard() {
  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Profile Tips
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

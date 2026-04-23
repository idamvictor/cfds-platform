import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";

export function HelpSupportCard() {
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
          Need Help?
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <p className="mb-4 text-[11px] leading-relaxed text-[#8b97a8]">
        Can't find a setting? Our support team can help you with account
        configuration and troubleshooting.
      </p>

      <Link
        to="/main/chat"
        className="group flex items-center gap-3 rounded-lg border border-[#00dfa2]/20 bg-[#00dfa2]/[0.06] px-3 py-2.5 text-[#00dfa2] transition-all hover:border-[#00dfa2]/40 hover:bg-[#00dfa2]/[0.1]"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="flex-1 text-xs font-bold">Contact Support</span>
        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </Link>
    </div>
  );
}

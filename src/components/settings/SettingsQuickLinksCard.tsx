import { Link } from "react-router-dom";
import {
  ArrowRight,
  UserCircle,
  ShieldCheck,
  Wallet,
  IdCard,
} from "lucide-react";

const LINKS = [
  { to: "/main/personal", icon: UserCircle, label: "Personal Information" },
  { to: "/main/security", icon: ShieldCheck, label: "Security Settings" },
  { to: "/main/kyc", icon: IdCard, label: "KYC Verification" },
  { to: "/main/withdrawal", icon: Wallet, label: "Withdraw Funds" },
];

export function SettingsQuickLinksCard() {
  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Quick Links
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="space-y-2">
        {LINKS.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 text-[#8b97a8] transition-all hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-[#eef2f7]"
          >
            <span className="text-[#4a5468] transition-colors group-hover:text-[#00dfa2]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1 text-xs font-bold">{label}</span>
            <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

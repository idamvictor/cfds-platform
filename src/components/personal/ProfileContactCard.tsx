import * as React from "react";
import { Mail, Phone } from "lucide-react";

interface ProfileContactCardProps {
  email?: string;
  phone?: string;
}

export function ProfileContactCard({ email, phone }: ProfileContactCardProps) {
  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Contact
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="space-y-3">
        <Item icon={<Mail className="h-3.5 w-3.5" />} label={email || "—"} />
        <Item icon={<Phone className="h-3.5 w-3.5" />} label={phone || "—"} />
      </div>
    </div>
  );
}

function Item({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00dfa2]/[0.08] text-[#00dfa2]">
        {icon}
      </span>
      <span className="flex-1 truncate text-xs font-semibold text-[#eef2f7]">
        {label}
      </span>
      <span className="rounded-full border border-[#00dfa2]/20 bg-[#00dfa2]/[0.08] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#00dfa2]">
        Primary
      </span>
    </div>
  );
}

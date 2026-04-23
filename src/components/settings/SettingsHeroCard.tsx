import * as React from "react";
import { User as UserIcon, Lock, Globe, Coins } from "lucide-react";

interface SettingsHeroCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
  planTitle?: string;
}

export function SettingsHeroCard({
  firstName,
  lastName,
  email,
  avatar,
  planTitle,
}: SettingsHeroCardProps) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Trader";

  return (
    <div
      className="relative rounded-2xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-7"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,223,162,0.16) 0%, rgba(0,223,162,0.02) 60%, transparent 80%)",
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/[0.08] bg-[#0a0d15]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-6 w-6 text-[#4a5468]" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-extrabold tracking-tight text-[#eef2f7]">
              Welcome back, {firstName || "Trader"}
            </h2>
            <p className="truncate text-[11px] font-semibold text-[#4a5468]">
              {email || "Personalize your account"}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#00dfa2]/20 bg-[#00dfa2]/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#00dfa2]">
              {planTitle || "Basic Plan"}
            </span>
          </div>
        </div>

        {/* Mini stat tiles */}
        <div className="grid grid-cols-3 gap-2 md:max-w-[300px]">
          <Stat icon={<Lock className="h-3.5 w-3.5" />} label="Security" />
          <Stat icon={<Globe className="h-3.5 w-3.5" />} label="Language" />
          <Stat icon={<Coins className="h-3.5 w-3.5" />} label="Currency" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00dfa2]/[0.08] text-[#00dfa2]">
        {icon}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-[#4a5468]">
        {label}
      </span>
    </div>
  );
}

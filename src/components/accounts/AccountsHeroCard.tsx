import { Wallet, Check, ShieldAlert } from "lucide-react";
import type { UserAccount } from "@/store/userStore";

interface AccountsHeroCardProps {
  firstName?: string;
  accounts: UserAccount[];
  verificationStatus?: string;
}

export function AccountsHeroCard({
  firstName,
  accounts,
  verificationStatus,
}: AccountsHeroCardProps) {
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (Number(acc.balance) || 0),
    0,
  );
  const activeCount = accounts.filter((a) => a.status === "active").length;
  const primaryCurrency = accounts[0]?.currency || "USD";
  const isVerified = verificationStatus === "approved";

  return (
    <div className="glass-card p-5 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Identity / intro */}
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0,223,162,0.18) 0%, rgba(0,223,162,0.02) 60%, transparent 80%)",
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/[0.08] bg-[#0a0d15]">
              <Wallet className="h-6 w-6 text-[#00dfa2]" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-extrabold tracking-tight text-[#eef2f7]">
              {firstName ? `${firstName}'s wallets` : "Your wallets"}
            </h2>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[#4a5468]">
              Manage balances and move funds between your wallets
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${
                isVerified
                  ? "border-[#00dfa2]/20 bg-[#00dfa2]/[0.08] text-[#00dfa2]"
                  : "border-[#f43f5e]/20 bg-[#f43f5e]/[0.08] text-[#f43f5e]"
              }`}
            >
              {isVerified ? (
                <Check className="h-3 w-3" />
              ) : (
                <ShieldAlert className="h-3 w-3" />
              )}
              {isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        {/* Mini stat tiles */}
        <div className="grid grid-cols-3 gap-2 md:max-w-[340px]">
          <Stat
            label="Total Balance"
            value={`$${totalBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            accent
          />
          <Stat label="Active" value={`${activeCount}/${accounts.length}`} />
          <Stat label="Currency" value={primaryCurrency} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-2.5">
      <span
        className={`font-mono text-[11px] font-extrabold ${
          accent ? "text-[#00dfa2]" : "text-[#eef2f7]"
        }`}
      >
        {value}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-[#4a5468]">
        {label}
      </span>
    </div>
  );
}

import * as React from "react";
import {
  Settings,
  Coins,
  Languages,
  User,
  ArrowRight,
  UserCircle,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { CurrencySelector } from "@/components/settings/currency-selector";
import { LanguageSelector } from "@/components/settings/language-selector";
import { PasswordChangeCard } from "@/components/security/PasswordChangeCard";
import useUserStore from "@/store/userStore";
import { Link } from "react-router-dom";

// ── Main component ─────────────────────────────────────────────────
export default function SettingsPage() {
  // ── Read-only user data for Account Snapshot ──
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto w-full">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#00dfa2]/10">
          <Settings className="h-5 w-5 text-[#00dfa2]" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[#eef2f7]">
            Settings
          </h1>
          <p className="text-[11px] text-[#4a5468] font-semibold">
            Manage your password, currency, and language preferences
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
        {/* ── LEFT COLUMN: main settings ── */}
        <div className="flex flex-col gap-5">
          {/* ── Password Section (extracted shared component) ── */}
          <PasswordChangeCard />

          {/* ── Currency Section ── */}
          <div className="glass-card p-5 md:p-7">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
                Dashboard Currency
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <Coins className="h-4 w-4 text-[#4a5468]" />
            </div>
            <CurrencySelector />
          </div>

          {/* ── Language Section ── */}
          <div className="glass-card p-5 md:p-7">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
                Dashboard Language
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <Languages className="h-4 w-4 text-[#4a5468]" />
            </div>
            <LanguageSelector />
          </div>
        </div>

        {/* ── RIGHT COLUMN: sidebar ── */}
        <div className="flex flex-col gap-5">
          {/* ── Account Snapshot ── */}
          <div className="glass-card p-5 md:p-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
                Account Snapshot
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-[#4a5468]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#eef2f7] truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[10px] text-[#4a5468] font-medium truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <SnapshotRow
                label="Account ID"
                value={user?.account_id || "—"}
              />
              <SnapshotRow
                label="Plan"
                value={user?.account_type?.title || "Basic"}
              />
              <SnapshotRow
                label="Verification"
                value={user?.verification_status || "—"}
                highlight={
                  user?.verification_status === "verified"
                    ? "#00dfa2"
                    : "#FF9800"
                }
              />
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="glass-card p-5 md:p-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
                Quick Links
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="space-y-2">
              <QuickLink
                to="/main/personal"
                icon={<UserCircle className="h-4 w-4" />}
                label="Personal Information"
              />
              <QuickLink
                to="/main/verification"
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Verification"
              />
              <QuickLink
                to="/main/withdrawal"
                icon={<Wallet className="h-4 w-4" />}
                label="Withdraw Funds"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Snapshot Row (presentational) ── */
function SnapshotRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
        {label}
      </span>
      <span
        className="text-xs font-bold capitalize"
        style={{ color: highlight || "#eef2f7" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Quick Link (presentational) ── */
function QuickLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-white/[0.04] bg-white/[0.02] text-[#8b97a8] hover:bg-white/[0.05] hover:text-[#eef2f7] hover:border-white/[0.1] transition-all group"
    >
      <span className="text-[#4a5468] group-hover:text-[#00dfa2] transition-colors">
        {icon}
      </span>
      <span className="text-xs font-bold flex-1">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}

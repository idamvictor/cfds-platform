import { User as UserIcon } from "lucide-react";

interface AccountSnapshotCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
  accountId?: string;
  planTitle?: string;
  verificationStatus?: string;
}

export function AccountSnapshotCard({
  firstName,
  lastName,
  email,
  avatar,
  accountId,
  planTitle,
  verificationStatus,
}: AccountSnapshotCardProps) {
  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Account Snapshot
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.04]">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon className="h-5 w-5 text-[#4a5468]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[#eef2f7]">
            {firstName} {lastName}
          </p>
          <p className="truncate text-[10px] font-medium text-[#4a5468]">
            {email}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Row label="Account ID" value={accountId || "—"} />
        <Row label="Plan" value={planTitle || "Basic"} />
        <Row
          label="Verification"
          value={verificationStatus || "—"}
          highlight={verificationStatus === "verified" ? "#00dfa2" : "#FF9800"}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] py-2 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
        {label}
      </span>
      <span
        className="truncate text-xs font-bold capitalize"
        style={{ color: highlight || "#eef2f7" }}
      >
        {value}
      </span>
    </div>
  );
}

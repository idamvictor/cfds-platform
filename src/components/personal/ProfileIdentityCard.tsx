interface ProfileIdentityCardProps {
  accountId?: string;
  planTitle?: string;
  verificationStatus?: string;
  country?: string | null;
  phone?: string;
}

export function ProfileIdentityCard({
  accountId,
  planTitle,
  verificationStatus,
  country,
  phone,
}: ProfileIdentityCardProps) {
  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Identity
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="space-y-3">
        <Row label="Account ID" value={accountId || "—"} />
        <Row label="Plan" value={planTitle || "Basic"} />
        <Row
          label="Verification"
          value={verificationStatus || "—"}
          highlight={verificationStatus === "verified" ? "#00dfa2" : "#FF9800"}
        />
        <Row label="Country" value={country || "—"} />
        <Row label="Phone" value={phone || "—"} />
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

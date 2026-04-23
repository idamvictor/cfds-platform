import { User as UserIcon, ShieldCheck, AlertCircle } from "lucide-react";

interface ProfileHeroCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
  planTitle?: string;
  verificationStatus?: string;
}

export function ProfileHeroCard({
  firstName,
  lastName,
  email,
  avatar,
  planTitle,
  verificationStatus,
}: ProfileHeroCardProps) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Unnamed User";
  const isVerified = verificationStatus === "verified";

  return (
    <div
      className="relative rounded-2xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-7"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,223,162,0.16) 0%, rgba(0,223,162,0.02) 60%, transparent 80%)",
          }}
        >
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/[0.08] bg-[#0a0d15]">
            {avatar ? (
              <img
                src={avatar}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-7 w-7 text-[#4a5468]" />
            )}
          </div>
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-extrabold tracking-tight text-[#eef2f7]">
            {fullName}
          </h2>
          <p className="truncate text-[11px] font-semibold text-[#4a5468]">
            {email || "—"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#00dfa2]/20 bg-[#00dfa2]/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#00dfa2]">
              {planTitle || "Basic Plan"}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${
                isVerified
                  ? "border border-[#00dfa2]/20 bg-[#00dfa2]/[0.08] text-[#00dfa2]"
                  : "border border-[#FF9800]/20 bg-[#FF9800]/[0.08] text-[#FF9800]"
              }`}
            >
              {isVerified ? (
                <ShieldCheck className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              {verificationStatus || "unverified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

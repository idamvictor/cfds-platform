import { CheckCircle2, Circle } from "lucide-react";

interface ProfileFields {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country?: string | null;
  address?: string | null;
  birth_date?: string;
  avatar?: string | null;
}

interface ProfileCompletionCardProps {
  fields: ProfileFields;
}

const FIELD_LABELS: { key: keyof ProfileFields; label: string }[] = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "country", label: "Country" },
  { key: "address", label: "Address" },
  { key: "birth_date", label: "Date of Birth" },
  { key: "avatar", label: "Profile Photo" },
];

function isFilled(value: string | null | undefined) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function ProfileCompletionCard({ fields }: ProfileCompletionCardProps) {
  const filledCount = FIELD_LABELS.filter(({ key }) => isFilled(fields[key])).length;
  const total = FIELD_LABELS.length;
  const percent = Math.round((filledCount / total) * 100);

  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Profile Completion
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-xs font-extrabold text-[#eef2f7]">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg,#00ffc3,#00dfa2,#00b881)",
          }}
        />
      </div>

      {/* Field grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FIELD_LABELS.map(({ key, label }) => {
          const filled = isFilled(fields[key]);
          return (
            <div
              key={key}
              className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
            >
              {filled ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#00dfa2]" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0 text-[#4a5468]" />
              )}
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.06em] ${
                  filled ? "text-[#eef2f7]" : "text-[#4a5468]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

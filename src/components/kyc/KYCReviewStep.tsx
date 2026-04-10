import { ClipboardCheck, IdCard, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore";

interface KYCReviewStepProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function KYCReviewStep({ onBack, onSubmit }: KYCReviewStepProps) {
  const user = useUserStore((state) => state.user);

  const profileRows = [
    { label: "Full Name", value: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "—" },
    { label: "Email", value: user?.email || "—" },
    { label: "Phone", value: user?.phone || "—" },
    { label: "Date of Birth", value: user?.birth_date || "—" },
    { label: "Country", value: user?.country || "—" },
    { label: "Address", value: user?.address || "—" },
  ];

  const documentRows = [
    { icon: User, label: "Personal Information", status: "Submitted" },
    { icon: IdCard, label: "Identity Document", status: "Submitted" },
    { icon: FileText, label: "Proof of Address", status: "Submitted" },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.06)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-8"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-[12px]"
            style={{
              background: "rgba(30,215,96,0.1)",
              color: "#1ED760",
            }}
          >
            <ClipboardCheck className="h-[1.05rem] w-[1.05rem]" />
          </div>
          <div>
            <div className="text-[1.05rem] font-extrabold text-[#eef2f7]">
              Review &amp; Submit
            </div>
            <div className="mt-0.5 text-[0.82rem] text-[#8b97a8]">
              Confirm your details are correct before final submission.
            </div>
          </div>
        </div>

        {/* Profile review */}
        <div
          className="mb-4 rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5"
          style={{
            background:
              "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
          }}
        >
          <div className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
            Personal Information
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {profileRows.map((row) => (
              <div
                key={row.label}
                className="flex justify-between border-b border-white/[0.04] py-2 last:border-0"
              >
                <span className="text-[0.78rem] text-[#4a5468]">{row.label}</span>
                <span className="text-[0.82rem] font-bold text-[#eef2f7]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Document statuses */}
        <div
          className="mb-4 rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5"
          style={{
            background:
              "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
          }}
        >
          <div className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
            Submitted Documents
          </div>
          <div className="flex flex-col gap-2.5">
            {documentRows.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-[10px] border border-white/[0.04] bg-white/[0.02] p-3"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                    style={{
                      background: "rgba(0,223,162,0.1)",
                      color: "#00dfa2",
                    }}
                  >
                    <Icon className="h-[0.78rem] w-[0.78rem]" />
                  </div>
                  <div className="flex-1 text-[0.84rem] font-bold text-[#eef2f7]">
                    {row.label}
                  </div>
                  <span
                    className="rounded-full border border-[rgba(0,223,162,0.25)] bg-[rgba(0,223,162,0.08)] px-2.5 py-1 text-[0.66rem] font-bold text-[#00dfa2]"
                  >
                    ✓ {row.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mb-5 flex items-start gap-2.5 rounded-[10px] border border-[rgba(0,223,162,0.2)] p-3"
          style={{ background: "rgba(0,223,162,0.04)" }}
        >
          <div className="mt-0.5 text-[0.82rem] text-[#00dfa2]">ⓘ</div>
          <div className="text-[0.78rem] leading-[1.5] text-[#8b97a8]">
            By submitting, you confirm that all information and documents
            provided are accurate and belong to you. False submissions may
            result in account suspension.
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-white/[0.08] bg-white/[0.03] text-[#8b97a8] font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-white/[0.06] hover:text-[#eef2f7] hover:border-white/[0.12] transition-all active:scale-[0.98]"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="bg-gradient-to-br from-[#00dfa2] to-[#00b881] text-[#07080c] font-extrabold text-xs px-6 py-2.5 rounded-lg shadow-[0_4px_16px_rgba(0,223,162,0.2)] hover:shadow-[0_6px_24px_rgba(0,223,162,0.3)] hover:-translate-y-px transition-all active:scale-[0.98]"
          >
            Submit Verification
          </Button>
        </div>
      </div>
    </div>
  );
}

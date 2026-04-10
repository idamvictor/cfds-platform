import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { WalletNav } from "@/components/wallet/WalletNav";
import { KYCFlowHero } from "@/components/kyc/KYCFlowHero";
import { KYCNotificationBanner } from "@/components/kyc/KYCNotificationBanner";
import { KYCStepBar, type KYCStep } from "@/components/kyc/KYCStepBar";
import { KYCFlowSidebar } from "@/components/kyc/KYCFlowSidebar";
import { KYCTierStep } from "@/components/kyc/KYCTierStep";
import { KYCDocumentStep } from "@/components/kyc/KYCDocumentStep";
import { KYCAddressStep } from "@/components/kyc/KYCAddressStep";
import { KYCReviewStep } from "@/components/kyc/KYCReviewStep";
import { PersonalInfoForm } from "@/components/personal/PersonalInfoForm";

const STEPS: KYCStep[] = [
  { id: "tier", label: "Tier" },
  { id: "personal", label: "Personal Info" },
  { id: "id", label: "Identity" },
  { id: "address", label: "Address" },
  { id: "review", label: "Review" },
];

export default function KYCFlowPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.body.classList.add("kyc-active");
    return () => {
      document.body.classList.remove("kyc-active");
    };
  }, []);

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const goSubmit = () => navigate("/main/kyc/awaiting");

  const currentId = STEPS[currentIndex].id;

  return (
    <>
      <style>{`
        body.kyc-active .fixed.top-0.left-0.right-0.z-20,
        body.kyc-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.kyc-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.kyc-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }
      `}</style>

      <div
        className="fixed inset-0 z-30 flex flex-col font-[Inter,-apple-system,sans-serif]"
        style={{
          background:
            "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)",
          color: "#eef2f7",
        }}
      >
        <WalletNav />

        <div className="flex-1 overflow-y-auto">
          <KYCFlowHero />
          <KYCNotificationBanner />

          <div className="mx-auto max-w-[1280px] grid gap-6 px-4 py-7 md:px-8 lg:grid-cols-[1fr_320px]">
            {/* Main column */}
            <div>
              <KYCStepBar steps={STEPS} currentIndex={currentIndex} />

              {currentId === "tier" && <KYCTierStep onNext={goNext} />}

              {currentId === "personal" && (
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
                    <div className="mb-5 flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-[12px]"
                        style={{
                          background: "rgba(30,215,96,0.1)",
                          color: "#1ED760",
                        }}
                      >
                        <User className="h-[1.05rem] w-[1.05rem]" />
                      </div>
                      <div>
                        <div className="text-[1.05rem] font-extrabold text-[#eef2f7]">
                          Personal Information
                        </div>
                        <div className="mt-0.5 text-[0.82rem] text-[#8b97a8]">
                          Enter your details exactly as they appear on your
                          government-issued ID.
                        </div>
                      </div>
                    </div>

                    {/* Reused shared form — saves to /update on submit, then advances */}
                    <PersonalInfoForm
                      showProfilePhoto={false}
                      submitLabel="Save & Continue"
                      onSuccess={goNext}
                    />

                    <div className="mt-4 flex justify-start">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        className="border-white/[0.08] bg-white/[0.03] text-[#8b97a8] font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-white/[0.06] hover:text-[#eef2f7] hover:border-white/[0.12] transition-all active:scale-[0.98]"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentId === "id" && (
                <KYCDocumentStep onBack={goBack} onNext={goNext} />
              )}

              {currentId === "address" && (
                <KYCAddressStep onBack={goBack} onNext={goNext} />
              )}

              {currentId === "review" && (
                <KYCReviewStep onBack={goBack} onSubmit={goSubmit} />
              )}
            </div>

            {/* Sidebar */}
            <KYCFlowSidebar />
          </div>
        </div>
      </div>
    </>
  );
}

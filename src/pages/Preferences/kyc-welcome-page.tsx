import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IdCard, CircleCheck, ShieldCheck } from "lucide-react";
import useUserStore from "@/store/userStore";
import { WalletNav } from "@/components/wallet/WalletNav";
import { VerifyLaterModal } from "@/components/kyc/VerifyLaterModal";

export default function KYCWelcomePage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [showLater, setShowLater] = useState(false);

  // Hide MainLayout chrome while this page is mounted
  useEffect(() => {
    document.body.classList.add("kyc-active");
    return () => {
      document.body.classList.remove("kyc-active");
    };
  }, []);

  // verification_status only affects on-page messaging — never auto-navigates
  const status = user?.verification_status;
  const isApproved = status === "approved" || status === "verified";

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

        <main className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-10">
          <div className="w-full max-w-[480px]">
            <div
              className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.08)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
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
                {isApproved ? (
                  <>
                    {/* Verified state */}
                    <div
                      className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg,#00dfa2,#00ffc3)",
                        color: "#07080c",
                      }}
                    >
                      <CircleCheck className="h-7 w-7" />
                    </div>
                    <h1 className="text-center font-[Outfit,sans-serif] text-[1.6rem] font-extrabold tracking-[-0.02em] text-[#eef2f7]">
                      Account verified
                    </h1>
                    <p className="mt-2 text-center text-[0.88rem] leading-[1.6] text-[#8b97a8]">
                      Your account is fully verified. All trading features and
                      withdrawal limits are unlocked.
                    </p>
                    <button
                      onClick={() => navigate("/main/dashboard")}
                      className="mt-7 w-full rounded-[10px] bg-gradient-to-br from-[#00dfa2] to-[#00b881] py-3.5 text-[0.92rem] font-extrabold text-[#07080c] shadow-[0_4px_16px_rgba(0,223,162,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,223,162,0.4)] active:scale-[0.98]"
                    >
                      Continue to Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    {/* Welcome state */}
                    <h1 className="text-center font-[Outfit,sans-serif] text-[1.6rem] font-extrabold tracking-[-0.02em] text-[#eef2f7]">
                      Let's get you verified
                    </h1>
                    <p className="mt-2 text-center text-[0.88rem] leading-[1.6] text-[#8b97a8]">
                      We are required to collect this information to meet
                      regulatory requirements. Your details will be kept safe
                      and will not be shared with third parties.
                    </p>

                    <div className="my-7 flex flex-col gap-3">
                      {[
                        { num: 1, title: "Provide identity document", icon: IdCard },
                        { num: 2, title: "Complete verification", icon: ShieldCheck },
                      ].map((step) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={step.num}
                            className="flex items-center gap-3 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-white/[0.02] p-4"
                          >
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]"
                              style={{
                                background: "rgba(0,223,162,0.1)",
                                color: "#00dfa2",
                              }}
                            >
                              <Icon className="h-[1.05rem] w-[1.05rem]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                                Step {step.num}
                              </div>
                              <div className="mt-0.5 text-[0.92rem] font-bold text-[#eef2f7]">
                                {step.title}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => navigate("/main/kyc/flow")}
                      className="w-full rounded-[10px] bg-gradient-to-br from-[#00dfa2] to-[#00b881] py-3.5 text-[0.92rem] font-extrabold text-[#07080c] shadow-[0_4px_16px_rgba(0,223,162,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,223,162,0.4)] active:scale-[0.98]"
                    >
                      Start verification
                    </button>
                    <button
                      onClick={() => setShowLater(true)}
                      className="mt-2 w-full rounded-[10px] border border-white/[0.08] bg-white/[0.03] py-3 text-[0.84rem] font-bold text-[#8b97a8] transition-all hover:bg-white/[0.06] hover:text-[#eef2f7] active:scale-[0.98]"
                    >
                      I'll do it later
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-[0.72rem] text-[#4a5468]">
              Your information is encrypted in transit and at rest.
            </div>
          </div>
        </main>

        <VerifyLaterModal
          open={showLater}
          onClose={() => setShowLater(false)}
          onStartNow={() => {
            setShowLater(false);
            navigate("/main/kyc/flow");
          }}
          onLater={() => {
            setShowLater(false);
            navigate("/main/dashboard");
          }}
        />
      </div>
    </>
  );
}

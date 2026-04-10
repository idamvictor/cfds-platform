import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CircleCheck } from "lucide-react";
import useUserStore from "@/store/userStore";
import { WalletNav } from "@/components/wallet/WalletNav";

export default function KYCAwaitingPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    document.body.classList.add("kyc-active");
    return () => {
      document.body.classList.remove("kyc-active");
    };
  }, []);

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
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_4px_16px_rgba(0,223,162,0.35)]"
                  style={{
                    background:
                      "linear-gradient(135deg,#00dfa2,#00ffc3)",
                    color: "#07080c",
                  }}
                >
                  {isApproved ? (
                    <CircleCheck className="h-7 w-7" />
                  ) : (
                    <Check className="h-7 w-7" strokeWidth={3} />
                  )}
                </div>

                <h1 className="text-center font-[Outfit,sans-serif] text-[1.6rem] font-extrabold tracking-[-0.02em] text-[#eef2f7]">
                  {isApproved
                    ? "Verification complete"
                    : "Verification awaiting approval"}
                </h1>
                <p className="mt-2 text-center text-[0.88rem] leading-[1.6] text-[#8b97a8]">
                  {isApproved
                    ? "Your account is fully verified. All trading features and withdrawal limits are unlocked."
                    : "Your documents have been submitted and are currently under review. You'll receive an email notification once your verification is complete."}
                </p>

                <button
                  onClick={() => navigate("/main/dashboard")}
                  className="mt-7 w-full rounded-[10px] bg-gradient-to-br from-[#00dfa2] to-[#00b881] py-3.5 text-[0.92rem] font-extrabold text-[#07080c] shadow-[0_4px_16px_rgba(0,223,162,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,223,162,0.4)] active:scale-[0.98]"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>

            <div className="mt-4 text-center text-[0.72rem] text-[#4a5468]">
              Need help? Contact support at any time.
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

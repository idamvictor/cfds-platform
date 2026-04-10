import { Layers, Shield } from "lucide-react";
import useUserStore from "@/store/userStore";
import { Button } from "@/components/ui/button";

interface KYCTierStepProps {
  onNext: () => void;
}

/**
 * Tier display step. Read-only display of the user's current account_type.
 * No fake tier limits, no fake selection state — purely presentational.
 */
export function KYCTierStep({ onNext }: KYCTierStepProps) {
  const user = useUserStore((state) => state.user);
  const accountTitle = user?.account_type?.title || "Basic";
  const leverage = user?.account_type?.leverage;

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
              background: "rgba(240,180,41,0.1)",
              color: "#F0B429",
            }}
          >
            <Layers className="h-[1.05rem] w-[1.05rem]" />
          </div>
          <div>
            <div className="text-[1.05rem] font-extrabold text-[#eef2f7]">
              Your Account Tier
            </div>
            <div className="mt-0.5 text-[0.82rem] text-[#8b97a8]">
              This is the trading tier currently associated with your account.
            </div>
          </div>
        </div>

        {/* Tier card — single, derived from real account_type */}
        <div
          className="rounded-[14px] border-[1.5px] border-[rgba(0,223,162,0.3)] p-5"
          style={{
            background:
              "linear-gradient(135deg,rgba(0,223,162,0.08),rgba(0,223,162,0.02))",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] shadow-[0_4px_16px_rgba(0,223,162,0.3)]"
              style={{
                background:
                  "linear-gradient(135deg,#00dfa2,#00ffc3)",
                color: "#07080c",
              }}
            >
              <Shield className="h-[1.05rem] w-[1.05rem]" />
            </div>
            <div className="flex-1">
              <div className="text-[1.1rem] font-extrabold capitalize text-[#eef2f7]">
                {accountTitle}
              </div>
              {leverage && (
                <div className="mt-0.5 text-[0.78rem] text-[#8b97a8]">
                  Leverage: 1:{leverage}
                </div>
              )}
            </div>
            <span
              className="rounded-full border border-[rgba(0,223,162,0.3)] bg-[rgba(0,223,162,0.1)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#00dfa2]"
            >
              Current
            </span>
          </div>
        </div>

        {/* Continue */}
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={onNext}
            className="bg-gradient-to-br from-[#00dfa2] to-[#00b881] text-[#07080c] font-extrabold text-xs px-6 py-2.5 rounded-lg shadow-[0_4px_16px_rgba(0,223,162,0.2)] hover:shadow-[0_6px_24px_rgba(0,223,162,0.3)] hover:-translate-y-px transition-all active:scale-[0.98]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Coins, Lock } from "lucide-react";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";

const ELITE_THRESHOLD = 100000;

export function WalletGoldPanel() {
  const user = useUserStore((state) => state.user);
  const { formatCurrency } = useCurrency();
  const balance = user?.balance || 0;
  const isElite = balance >= ELITE_THRESHOLD;

  if (!isElite) {
    return (
      <div
        className="rounded-2xl border-[1.5px] border-dashed border-[rgba(0,223,162,0.3)] p-7 text-center"
        style={{
          background:
            "linear-gradient(135deg,rgba(0,223,162,0.04),rgba(0,223,162,0.02))",
        }}
      >
        <div
          className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[rgba(0,223,162,0.3)]"
          style={{ background: "rgba(0,223,162,0.1)" }}
        >
          <Lock className="h-5 w-5 text-[#00dfa2]" />
        </div>
        <div className="mb-2 text-[1.05rem] font-extrabold text-[#00ffc3]">
          Physical Gold Withdrawals — Elite Only
        </div>
        <div className="mx-auto mb-4 max-w-[380px] text-[0.83rem] leading-[1.75] text-[#4a5468]">
          Physical gold bar withdrawals are available exclusively to Elite
          members with an account balance of at least {formatCurrency(ELITE_THRESHOLD)}.
          Delivered insured to your door worldwide.
        </div>
        <div className="mx-auto max-w-[380px] rounded-lg bg-[rgba(255,255,255,0.06)] p-[14px_18px] text-left">
          <div className="mb-1.5 flex justify-between text-[0.78rem]">
            <span className="text-[#4a5468]">Current Balance</span>
            <span className="font-mono font-bold text-[#00ffc3]">
              {formatCurrency(balance)}
            </span>
          </div>
          <div className="mb-1.5 flex justify-between text-[0.78rem]">
            <span className="text-[#4a5468]">Elite Threshold</span>
            <span className="font-mono font-bold text-[#00ffc3]">
              {formatCurrency(ELITE_THRESHOLD)}
            </span>
          </div>
          <div className="h-[7px] overflow-hidden rounded bg-[rgba(255,255,255,0.08)]">
            <div
              className="h-full rounded"
              style={{
                width: `${Math.min(100, (balance / ELITE_THRESHOLD) * 100)}%`,
                background:
                  "linear-gradient(90deg,#00dfa2,#00ffc3)",
                transition: "width .8s",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(0,223,162,0.3)] p-7"
      style={{
        background:
          "linear-gradient(145deg,rgba(0,223,162,0.08),rgba(0,223,162,0.04))",
      }}
    >
      <div
        className="pointer-events-none absolute -right-[60px] -top-[60px] h-[200px] w-[200px]"
        style={{
          background:
            "radial-gradient(circle,rgba(0,223,162,0.1),transparent 65%)",
        }}
      />
      <div className="relative">
        <div className="mb-6 flex items-center gap-4 border-b border-[rgba(0,223,162,0.3)] pb-5">
          <div
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] shadow-[0_6px_20px_rgba(0,223,162,0.35)]"
            style={{
              background:
                "linear-gradient(135deg,#00dfa2,#00ffc3)",
              color: "#060A14",
            }}
          >
            <Coins className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[1.1rem] font-extrabold tracking-[-0.02em] text-[#00ffc3]">
              Physical Gold Withdrawal
            </div>
            <div className="mt-0.5 text-[0.78rem] text-[#4a5468]">
              Elite tier access unlocked
            </div>
          </div>
          <div
            className="rounded-full px-3 py-1.5 text-[0.7rem] font-extrabold"
            style={{
              background:
                "linear-gradient(135deg,#00dfa2,#00ffc3)",
              color: "#060A14",
            }}
          >
            Elite
          </div>
        </div>

        <div className="text-[0.83rem] leading-[1.75] text-[#8b97a8]">
          Physical gold bar withdrawals are processed through our partner vault.
          Contact support to initiate a gold delivery request.
        </div>
      </div>
    </div>
  );
}

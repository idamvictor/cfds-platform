import useUserStore from "@/store/userStore";

const ELITE_THRESHOLD = 100000;

export function GoldTierBanner() {
  const user = useUserStore((state) => state.user);
  const balance = user?.balance || 0;

  if (balance < ELITE_THRESHOLD) return null;

  return (
    <div
      className="mb-6 flex items-center gap-4 rounded-[14px] border-[1.5px] border-[rgba(0,223,162,0.3)] p-[18px_22px]"
      style={{
        background:
          "linear-gradient(135deg,rgba(0,223,162,0.1),rgba(0,223,162,0.04))",
      }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-[1.3rem] shadow-[0_4px_16px_rgba(0,223,162,0.3)]"
        style={{
          background:
            "linear-gradient(135deg,#00dfa2,#00ffc3)",
        }}
      >
        🥇
      </div>
      <div className="flex-1">
        <div className="mb-0.5 text-[0.95rem] font-extrabold text-[#00ffc3]">
          Elite Gold Withdrawal Unlocked
        </div>
        <div className="text-[0.78rem] leading-[1.6] text-[#4a5468]">
          Your account balance qualifies for exclusive access to physical gold
          bar withdrawals, delivered insured to your door worldwide.
        </div>
      </div>
      <div
        className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-[0.75rem] font-extrabold"
        style={{
          background:
            "linear-gradient(135deg,#00dfa2,#00ffc3)",
          color: "#000",
        }}
      >
        Elite Member
      </div>
    </div>
  );
}

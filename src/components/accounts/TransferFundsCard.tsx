import { ArrowLeftRight } from "lucide-react";
import { TransferForm } from "@/components/account/transfer-form";
import type { UserAccount } from "@/store/userStore";

interface TransferFundsCardProps {
  accounts: UserAccount[];
}

export function TransferFundsCard({ accounts }: TransferFundsCardProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{
            background: "rgba(0,223,162,0.1)",
            color: "#00dfa2",
          }}
        >
          <ArrowLeftRight className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
          Transfer Between Wallets
        </h2>
      </div>

      <div
        className="relative rounded-2xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-7"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        }}
      >
        <p className="mb-5 text-[11px] leading-relaxed text-[#8b97a8]">
          Move funds between your wallets instantly. Transfers are free and
          settle immediately — no fees, no waiting.
        </p>

        {/* Existing component — UNCHANGED */}
        <TransferForm accounts={accounts} />
      </div>
    </section>
  );
}

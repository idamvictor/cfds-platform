import { Wallet } from "lucide-react";
import { AccountsTable } from "@/components/account/accounts-table";
import type { UserAccount } from "@/store/userStore";

interface YourWalletsCardProps {
  accounts: UserAccount[];
}

export function YourWalletsCard({ accounts }: YourWalletsCardProps) {
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
          <Wallet className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
          Your Wallets
        </h2>
        <span className="ml-auto text-[11px] font-semibold text-[#4a5468]">
          {accounts.length} wallet{accounts.length === 1 ? "" : "s"}
        </span>
      </div>

      <div
        className="relative rounded-2xl border border-white/[0.06] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        }}
      >
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-[#4a5468]">
              <Wallet className="h-4 w-4" />
            </div>
            <p className="text-[13px] font-semibold text-[#eef2f7]">
              No wallets yet
            </p>
            <p className="max-w-[260px] text-[11px] text-[#4a5468]">
              Your trading and credit wallets will appear here once your
              account is provisioned.
            </p>
          </div>
        ) : (
          <AccountsTable accounts={accounts} />
        )}
      </div>
    </section>
  );
}

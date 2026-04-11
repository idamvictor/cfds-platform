import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { WalletNav } from "@/components/wallet/WalletNav";
import { SecuritySidebar } from "@/components/security/SecuritySidebar";
import { HelpSupportCard } from "@/components/settings/HelpSupportCard";
import { AccountsHeroCard } from "@/components/accounts/AccountsHeroCard";
import { YourWalletsCard } from "@/components/accounts/YourWalletsCard";
import { TransferFundsCard } from "@/components/accounts/TransferFundsCard";
import { TradingPlanCard } from "@/components/accounts/TradingPlanCard";
import { AccountsQuickLinksCard } from "@/components/accounts/AccountsQuickLinksCard";
import useUserStore from "@/store/userStore";

export default function AccountsPage() {
  // Read user once at the page level; pass slices down as props.
  const user = useUserStore((state) => state.user);
  const accounts = user?.accounts || [];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide MainLayout chrome while this page is mounted (matches security/settings pattern)
  useEffect(() => {
    document.body.classList.add("accounts-active");
    return () => {
      document.body.classList.remove("accounts-active");
    };
  }, []);

  return (
    <>
      <style>{`
        body.accounts-active .fixed.top-0.left-0.right-0.z-20,
        body.accounts-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.accounts-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.accounts-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }
      `}</style>

      <div
        className="fixed inset-0 z-30 flex flex-col font-[Inter,-apple-system,sans-serif]"
        style={{
          background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)",
          color: "#eef2f7",
        }}
      >
        {/* Top nav (reused) */}
      <WalletNav onToggleSidebar={() => setIsSidebarOpen(true)} />  

        {/* Layout: secondary sidebar + main */}
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[260px_1fr] min-h-0">
          <SecuritySidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main
            className="overflow-y-auto p-5 md:p-9"
            style={{ maxHeight: "100%" }}
          >
            {/* Page header */}
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00dfa2]/10">
                <Wallet className="h-5 w-5 text-[#00dfa2]" />
              </div>
              <div>
                <h1 className="font-[Outfit,sans-serif] text-[1.65rem] font-extrabold tracking-[-0.03em] text-[#eef2f7]">
                  Accounts
                </h1>
                <p className="mt-0.5 text-[0.87rem] text-[#4a5468]">
                  View your wallets and move funds between them
                </p>
              </div>
            </div>

            {/* Two-column content */}
            <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-5">
                <AccountsHeroCard
                  firstName={user?.first_name}
                  accounts={accounts}
                  verificationStatus={user?.verification_status}
                />

                <YourWalletsCard accounts={accounts} />

                <TransferFundsCard accounts={accounts} />
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex flex-col gap-5">
                <TradingPlanCard
                  planTitle={user?.account_type?.title}
                  leverage={user?.account_type?.leverage}
                  image={user?.account_type?.image}
                  color={user?.account_type?.color}
                />
                <AccountsQuickLinksCard />
                <HelpSupportCard />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import DepositHistory from "@/components/deposit-history";
import { WalletNav } from "@/components/wallet/WalletNav";
import { SecuritySidebar } from "@/components/security/SecuritySidebar";
import { HelpSupportCard } from "@/components/settings/HelpSupportCard";
import { DepositHistoryHeroCard } from "@/components/deposit-history-ui/DepositHistoryHeroCard";
import { DepositHistoryListCard } from "@/components/deposit-history-ui/DepositHistoryListCard";
import { DepositQuickLinksCard } from "@/components/deposit-history-ui/DepositQuickLinksCard";
import { DepositStatusLegendCard } from "@/components/deposit-history-ui/DepositStatusLegendCard";
import useUserStore from "@/store/userStore";

export default function DepositHistoryPage() {
  // Read user once at the page level; pass slices down as props.
  // No deposit API call — the existing <DepositHistory /> owns that.
  const user = useUserStore((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide MainLayout chrome while this page is mounted (matches accounts/security/settings pattern)
  useEffect(() => {
    document.body.classList.add("deposit-history-active");
    return () => {
      document.body.classList.remove("deposit-history-active");
    };
  }, []);

  return (
    <>
      <style>{`
        body.deposit-history-active .fixed.top-0.left-0.right-0.z-20,
        body.deposit-history-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.deposit-history-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.deposit-history-active .flex-1.md\\:ml-\\[80px\\] {
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
                <History className="h-5 w-5 text-[#00dfa2]" />
              </div>
              <div>
                <h1 className="font-[Outfit,sans-serif] text-[1.65rem] font-extrabold tracking-[-0.03em] text-[#eef2f7]">
                  Deposit History
                </h1>
                <p className="mt-0.5 text-[0.87rem] text-[#4a5468]">
                  Review every deposit across your trading accounts
                </p>
              </div>
            </div>

            {/* Two-column content */}
            <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-5">
                <DepositHistoryHeroCard firstName={user?.first_name} />

                <DepositHistoryListCard>
                  {/* Locked, untouched logic component */}
                  <DepositHistory />
                </DepositHistoryListCard>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex flex-col gap-5">
                <DepositQuickLinksCard />
                <DepositStatusLegendCard />
                <HelpSupportCard />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

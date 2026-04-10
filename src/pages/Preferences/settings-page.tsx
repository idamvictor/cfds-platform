import { useEffect, useState } from "react";
import { Settings, Lock, Coins, Languages } from "lucide-react";
import { WalletNav } from "@/components/wallet/WalletNav";
import { SecuritySidebar } from "@/components/security/SecuritySidebar";
import { CurrencySelector } from "@/components/settings/currency-selector";
import { LanguageSelector } from "@/components/settings/language-selector";
import { PasswordChangeCard } from "@/components/security/PasswordChangeCard";
import { SettingsHeroCard } from "@/components/settings/SettingsHeroCard";
import { AccountSnapshotCard } from "@/components/settings/AccountSnapshotCard";
import { SettingsQuickLinksCard } from "@/components/settings/SettingsQuickLinksCard";
import { SettingsTipsCard } from "@/components/settings/SettingsTipsCard";
import { HelpSupportCard } from "@/components/settings/HelpSupportCard";
import useUserStore from "@/store/userStore";

// ── Main component ─────────────────────────────────────────────────
export default function SettingsPage() {
  // Read user once at the page level; pass slices down as props.
  const user = useUserStore((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide MainLayout chrome while this page is mounted (matches security/personal)
  useEffect(() => {
    document.body.classList.add("settings-active");
    return () => {
      document.body.classList.remove("settings-active");
    };
  }, []);

  return (
    <>
      <style>{`
        body.settings-active .fixed.top-0.left-0.right-0.z-20,
        body.settings-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.settings-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.settings-active .flex-1.md\\:ml-\\[80px\\] {
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
        <div className="grid flex-1 grid-cols-1 md:grid-cols-[260px_1fr] min-h-0">
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
                <Settings className="h-5 w-5 text-[#00dfa2]" />
              </div>
              <div>
                <h1 className="font-[Outfit,sans-serif] text-[1.65rem] font-extrabold tracking-[-0.03em] text-[#eef2f7]">
                  Settings
                </h1>
                <p className="mt-0.5 text-[0.87rem] text-[#4a5468]">
                  Manage your password, currency, and language preferences
                </p>
              </div>
            </div>

            {/* Two-column content */}
            <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-5">
                <SettingsHeroCard
                  firstName={user?.first_name}
                  lastName={user?.last_name}
                  email={user?.email}
                  avatar={user?.avatar}
                  planTitle={user?.account_type?.title}
                />

                {/* Security & Login */}
                <section>
                  <div className="mb-4 flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                      style={{
                        background: "rgba(0,223,162,0.1)",
                        color: "#00dfa2",
                      }}
                    >
                      <Lock className="h-[0.88rem] w-[0.88rem]" />
                    </div>
                    <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
                      Password &amp; Login
                    </h2>
                  </div>
                  {/* Existing component — UNCHANGED */}
                  <PasswordChangeCard />
                </section>

                {/* Localization */}
                <section>
                  <div className="mb-4 flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                      style={{
                        background: "rgba(0,223,162,0.1)",
                        color: "#00dfa2",
                      }}
                    >
                      <Languages className="h-[0.88rem] w-[0.88rem]" />
                    </div>
                    <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
                      Localization
                    </h2>
                  </div>

                  {/* Currency */}
                  <div className="glass-card p-5 md:p-7 mb-5">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
                        Dashboard Currency
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                      <Coins className="h-4 w-4 text-[#4a5468]" />
                    </div>
                    {/* Existing component — UNCHANGED */}
                    <CurrencySelector />
                  </div>

                  {/* Language */}
                  <div className="glass-card p-5 md:p-7">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
                        Dashboard Language
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                      <Languages className="h-4 w-4 text-[#4a5468]" />
                    </div>
                    {/* Existing component — UNCHANGED */}
                    <LanguageSelector />
                  </div>
                </section>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex flex-col gap-5">
                <AccountSnapshotCard
                  firstName={user?.first_name}
                  lastName={user?.last_name}
                  email={user?.email}
                  avatar={user?.avatar}
                  accountId={user?.account_id}
                  planTitle={user?.account_type?.title}
                  verificationStatus={user?.verification_status}
                />
                <SettingsQuickLinksCard />
                <SettingsTipsCard />
                <HelpSupportCard />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { PersonalInfoForm } from "@/components/personal/PersonalInfoForm";
import { WalletNav } from "@/components/wallet/WalletNav";
import { SecuritySidebar } from "@/components/security/SecuritySidebar";
import { ProfileHeroCard } from "@/components/personal/ProfileHeroCard";
import { ProfileCompletionCard } from "@/components/personal/ProfileCompletionCard";
import { ProfileIdentityCard } from "@/components/personal/ProfileIdentityCard";
import { ProfileContactCard } from "@/components/personal/ProfileContactCard";
import { ProfileTipsCard } from "@/components/personal/ProfileTipsCard";
import { ProfileQuickLinksCard } from "@/components/personal/ProfileQuickLinksCard";
import useUserStore from "@/store/userStore";

export default function PersonalInformation() {
  // ── Read user once at the page level; pass slices down to child components ──
  const user = useUserStore((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide MainLayout chrome while this page is mounted (matches security-page)
  useEffect(() => {
    document.body.classList.add("personal-active");
    return () => {
      document.body.classList.remove("personal-active");
    };
  }, []);

  return (
    <>
      <style>{`
        body.personal-active .fixed.top-0.left-0.right-0.z-20,
        body.personal-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.personal-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.personal-active .flex-1.md\\:ml-\\[80px\\] {
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
                <UserCircle className="h-5 w-5 text-[#00dfa2]" />
              </div>
              <div>
                <h1 className="font-[Outfit,sans-serif] text-[1.65rem] font-extrabold tracking-[-0.03em] text-[#eef2f7]">
                  Personal Information
                </h1>
                <p className="mt-0.5 text-[0.87rem] text-[#4a5468]">
                  Manage your account details and profile
                </p>
              </div>
            </div>

            {/* Two-column content */}
            <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
              {/* ── LEFT COLUMN: hero, completion, form ── */}
              <div className="flex flex-col gap-5">
                <ProfileHeroCard
                  firstName={user?.first_name}
                  lastName={user?.last_name}
                  email={user?.email}
                  avatar={user?.avatar}
                  planTitle={user?.account_type?.title}
                  verificationStatus={user?.verification_status}
                />

                <ProfileCompletionCard
                  fields={{
                    first_name: user?.first_name,
                    last_name: user?.last_name,
                    email: user?.email,
                    phone: user?.phone,
                    country: user?.country,
                    address: user?.address,
                    birth_date: user?.birth_date,
                    avatar: user?.avatar,
                  }}
                />

                {/* Existing form — UNCHANGED */}
                <PersonalInfoForm />
              </div>

              {/* ── RIGHT COLUMN: identity, contact, tips, quick links ── */}
              <div className="flex flex-col gap-5">
                <ProfileIdentityCard
                  accountId={user?.account_id}
                  planTitle={user?.account_type?.title}
                  verificationStatus={user?.verification_status}
                  country={user?.country}
                  phone={user?.phone}
                />
                <ProfileContactCard email={user?.email} phone={user?.phone} />
                <ProfileTipsCard />
                <ProfileQuickLinksCard />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

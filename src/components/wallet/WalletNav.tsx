import { Link, useLocation } from "react-router-dom";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { Menu } from "lucide-react";

interface WalletNavProps {
  onToggleSidebar?: () => void;
}

export function WalletNav({ onToggleSidebar }: WalletNavProps) {
  const user = useUserStore((state) => state.user);
  const settings = useSiteSettingsStore((state) => state.settings);
  const location = useLocation();

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "U";

  const brandName = settings?.name || "1 Trade Market";

  const navLinks = [
    { label: "Dashboard", href: "/main/dashboard" },
    { label: "Wallet", href: "/main/wallet" },
    { label: "Markets", href: "/main/market" },
    { label: "Accounts", href: "/main/accounts" },
    { label: "Settings", href: "/main/settings" },
  ];

  return (
    <nav
      className="sticky top-0 z-[300] flex h-16 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4 backdrop-blur-[40px] md:px-8"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
      }}
    >
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-[#8b97a8] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7] md:hidden"
          >
            <Menu className="h-[1.1rem] w-[1.1rem]" />
          </button>
        )}
        <Link to="/main/dashboard" className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] font-[Outfit,sans-serif] text-[0.75rem] font-extrabold text-[#07080c]"
            style={{
              background:
                "linear-gradient(135deg,#00ffc3,#00dfa2,#00b881)",
            }}
          >
            {brandName.slice(0, 3).toUpperCase()}
          </div>
          <div className="text-[0.95rem] font-extrabold text-[#eef2f7]">
            {brandName}
          </div>
        </Link>
      </div>

      <div className="hidden gap-1 md:flex">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`rounded-lg px-3.5 py-1.5 text-[0.83rem] font-medium transition-all duration-150 ${
                isActive
                  ? "text-[#00dfa2]"
                  : "text-[#4a5468] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div
        className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full text-[0.78rem] font-extrabold text-[#07080c]"
        style={{
          background: "linear-gradient(135deg,#00dfa2,#00b881)",
        }}
        title={`${user?.first_name || ""} ${user?.last_name || ""}`.trim()}
      >
        {initials}
      </div>
    </nav>
  );
}

import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Wallet,
  Globe,
  UserCircle,
  Settings,
  User,
  Lock,
  IdCard,
  Sliders,
  Bell,
} from "lucide-react";

interface AccountsSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

// Primary app nav — routes copied verbatim from WalletNav (the current
// Accounts top nav), no new routes introduced.
const topNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/main/dashboard" },
  { label: "Wallet", icon: Wallet, href: "/main/wallet" },
  { label: "Markets", icon: Globe, href: "/main/market" },
  { label: "Accounts", icon: UserCircle, href: "/main/accounts" },
  { label: "Settings", icon: Settings, href: "/main/settings" },
];

// Accounts-specific items — routes copied verbatim from SecuritySidebar.
const midNav: NavItem[] = [
  { label: "Profile", icon: User, href: "/main/personal" },
  { label: "Security", icon: Lock, href: "/main/security" },
  { label: "KYC Verification", icon: IdCard, href: "/main/kyc" },
  { label: "Preferences", icon: Sliders, href: "/main/settings" },
  { label: "Notifications", icon: Bell, href: "/main/settings" },
];

function SbIcon({
  item,
  active,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  onClose?: () => void;
}) {
  const cls = `sb-icon group relative flex h-10 w-10 items-center justify-center rounded-[10px] cursor-pointer transition-all duration-150 ${
    active
      ? "bg-[rgba(0,223,162,0.1)] text-[#00dfa2]"
      : "text-[#4a5468] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
  }`;

  return (
    <Link to={item.href} className={cls} onClick={onClose}>
      <item.icon className="h-[0.88rem] w-[0.88rem]" />
      <span className="tip pointer-events-none absolute left-[50px] z-[400] whitespace-nowrap rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(10,13,21,0.95)] px-[10px] py-1 text-[0.68rem] font-semibold text-[#eef2f7] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {item.label}
      </span>
    </Link>
  );
}

export function AccountsSidebar({ isOpen = false, onClose }: AccountsSidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-8 bottom-0 z-[250] flex w-[60px] flex-col items-center gap-1 border-r border-[rgba(255,255,255,0.05)] py-[18px] transition-transform duration-200 md:static md:top-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        }}
      >
        {/* Top group — primary app nav */}
        {topNav.map((item) => (
          <SbIcon
            key={item.label}
            item={item}
            active={isActive(item.href)}
            onClose={onClose}
          />
        ))}

        {/* Divider */}
        <div className="my-1.5 h-px w-6 bg-[rgba(255,255,255,0.05)]" />

        {/* Mid group — Accounts-specific */}
        {midNav.map((item) => (
          <SbIcon
            key={item.label}
            item={item}
            active={isActive(item.href)}
            onClose={onClose}
          />
        ))}
      </aside>
    </>
  );
}

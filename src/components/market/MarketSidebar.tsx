import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  LineChart,
  Globe,
  Wallet,
  ArrowDownToLine,
  Clock,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { clearAuthenticatedSession } from "@/lib/session";

interface MarketSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  external?: boolean;
}

// Mirrors market.html sidebar items, in the same order. Each item is wired
// to an existing route in the project — no invented routes.
const topNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/main/dashboard" },
  { label: "Trade Room", icon: LineChart, href: "/trading", external: true },
  { label: "Markets", icon: Globe, href: "/main/market" },
  { label: "Wallet", icon: Wallet, href: "/main/wallet" },
  { label: "Deposit / Withdraw", icon: ArrowDownToLine, href: "/main/withdrawal" },
];

const midNav: NavItem[] = [
  { label: "Trading Plans", icon: Clock, href: "/main/trading-plans" },
  { label: "Fund Protection", icon: ShieldCheck, href: "/main/fund-protection" },
  { label: "Fund Managers", icon: Users, href: "/main/fund-managers" },
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

  const tooltip = (
    <span className="tip pointer-events-none absolute left-[50px] z-[400] whitespace-nowrap rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(10,13,21,0.95)] px-[10px] py-1 text-[0.68rem] font-semibold text-[#eef2f7] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
      {item.label}
    </span>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={cls}
        onClick={onClose}
      >
        <item.icon className="h-[0.88rem] w-[0.88rem]" />
        {tooltip}
      </a>
    );
  }

  return (
    <Link to={item.href} className={cls} onClick={onClose}>
      <item.icon className="h-[0.88rem] w-[0.88rem]" />
      {tooltip}
    </Link>
  );
}

export function MarketSidebar({ isOpen = false, onClose }: MarketSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearAuthenticatedSession();
    if (onClose) onClose();
    navigate("/");
  };

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
        {/* Top group */}
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

        {/* Mid group */}
        {midNav.map((item) => (
          <SbIcon
            key={item.label}
            item={item}
            active={isActive(item.href)}
            onClose={onClose}
          />
        ))}

        {/* Spacer pushes Settings/Logout to bottom */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="my-1.5 h-px w-6 bg-[rgba(255,255,255,0.05)]" />

        {/* Settings */}
        <SbIcon
          item={{ label: "Settings", icon: Settings, href: "/main/settings" }}
          active={isActive("/main/settings")}
          onClose={onClose}
        />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sb-icon group relative flex h-10 w-10 items-center justify-center rounded-[10px] cursor-pointer text-[#4a5468] transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
        >
          <LogOut className="h-[0.88rem] w-[0.88rem]" />
          <span className="tip pointer-events-none absolute left-[50px] z-[400] whitespace-nowrap rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(10,13,21,0.95)] px-[10px] py-1 text-[0.68rem] font-semibold text-[#eef2f7] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            Logout
          </span>
        </button>
      </aside>
    </>
  );
}

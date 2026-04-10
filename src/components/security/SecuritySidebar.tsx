import { Link, useLocation } from "react-router-dom";
import { User, Lock, IdCard, Sliders, Bell } from "lucide-react";

interface SecuritySidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const items = [
  { label: "Profile", icon: User, href: "/main/personal" },
  { label: "Security", icon: Lock, href: "/main/security" },
  { label: "KYC Verification", icon: IdCard, href: "/main/kyc" },
  { label: "Preferences", icon: Sliders, href: "/main/settings" },
  { label: "Notifications", icon: Bell, href: "/main/settings" },
];

export function SecuritySidebar({ isOpen = false, onClose }: SecuritySidebarProps) {
  const location = useLocation();

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
        className={`fixed left-0 top-16 bottom-0 z-[250] w-[260px] flex-col gap-1 overflow-y-auto border-r border-[rgba(255,255,255,0.06)] p-4 backdrop-blur-[40px] transition-transform duration-200 md:static md:top-0 md:flex md:translate-x-0 ${
          isOpen ? "flex translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background:
            "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
        }}
      >
        <div className="px-3 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#3a4556]">
          Account
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[0.85rem] font-medium transition-all duration-150 ${
                active
                  ? "bg-[rgba(0,223,162,0.1)] font-semibold text-[#00dfa2]"
                  : "text-[#4a5468] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
              }`}
            >
              <Icon className="h-[0.88rem] w-[0.88rem] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </aside>
    </>
  );
}

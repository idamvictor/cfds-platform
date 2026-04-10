import {
  ChartPie,
  Coins,
  ArrowDownToLine,
  ArrowUpFromLine,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import useUserStore from "@/store/userStore";
import { Link, useNavigate } from "react-router-dom";

export type WalletView = "overview" | "assets" | "dep" | "wit" | "gold";

interface WalletSidebarProps {
  currentView: WalletView;
  onChangeView: (view: WalletView) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function WalletSidebar({
  currentView,
  onChangeView,
  isOpen = false,
  onClose,
}: WalletSidebarProps) {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const isVerified = user?.verification_status === "approved";

  const walletItems: Array<{
    id: WalletView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "overview", label: "Overview", icon: ChartPie },
    { id: "assets", label: "Assets", icon: Coins },
  ];

  const fundsItems: Array<{
    id: WalletView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    tag?: string;
  }> = [
    { id: "dep", label: "Deposit", icon: ArrowDownToLine },
    { id: "wit", label: "Withdraw", icon: ArrowUpFromLine },
    { id: "gold", label: "Physical Gold", icon: Coins, tag: "Elite" },
  ];

  const handleClick = (view: WalletView) => {
    onChangeView(view);
    if (onClose) onClose();
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
        className={`fixed left-0 top-16 bottom-0 z-[250] w-[260px] flex-col gap-0.5 overflow-y-auto border-r border-[rgba(255,255,255,0.06)] p-4 backdrop-blur-[40px] transition-transform duration-200 md:static md:top-0 md:flex md:translate-x-0 ${
          isOpen ? "flex translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background:
            "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
        }}
      >
        {/* Wallet section */}
        <div className="px-3 pt-0 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#3a4556]">
          Wallet
        </div>
        {walletItems.map((item) => {
          const active = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[0.85rem] font-medium transition-all duration-150 ${
                active
                  ? "bg-[rgba(0,223,162,0.1)] font-semibold text-[#00dfa2]"
                  : "text-[#4a5468] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
              }`}
            >
              <Icon className="h-[0.88rem] w-[0.88rem] shrink-0" />
              {item.label}
            </button>
          );
        })}

        {/* Funds section */}
        <div className="px-3 pt-3.5 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#3a4556]">
          Funds
        </div>
        {fundsItems.map((item) => {
          const active = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[0.85rem] font-medium transition-all duration-150 ${
                active
                  ? "bg-[rgba(0,223,162,0.1)] font-semibold text-[#00dfa2]"
                  : "text-[#4a5468] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
              }`}
            >
              <Icon className="h-[0.88rem] w-[0.88rem] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.tag && (
                <span className="rounded-full border border-[rgba(0,223,162,0.25)] bg-[rgba(0,223,162,0.08)] px-2 py-0.5 text-[0.62rem] font-bold text-[#00dfa2]">
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}

        {/* Account section */}
        <div className="px-3 pt-3.5 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#3a4556]">
          Account
        </div>
        <Link
          to="/main/kyc"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[0.85rem] font-medium text-[#4a5468] transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
        >
          <IdCard className="h-[0.88rem] w-[0.88rem] shrink-0" />
          <span className="flex-1">KYC</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[0.62rem] font-bold ${
              isVerified
                ? "border-[rgba(0,223,162,0.25)] bg-[rgba(0,223,162,0.08)] text-[#00dfa2]"
                : "border-[rgba(244,63,94,0.25)] bg-[rgba(244,63,94,0.08)] text-[#f43f5e]"
            }`}
          >
            {isVerified ? "Verified" : "Pending"}
          </span>
        </Link>
        <button
          onClick={() => {
            navigate("/main/security");
            if (onClose) onClose();
          }}
          className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[0.85rem] font-medium text-[#4a5468] transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
        >
          <ShieldCheck className="h-[0.88rem] w-[0.88rem] shrink-0" />
          Security
        </button>
      </aside>
    </>
  );
}

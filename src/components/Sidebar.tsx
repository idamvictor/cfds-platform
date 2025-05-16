import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut, LayoutDashboard, User, ArrowUpDown, FileCheck, Folders, MessageSquare, PiggyBank, Settings,
} from "lucide-react";
import useUserStore from "@/store/userStore";
import AutoTraderModal from "@/components/trading/trading-interface-components/auto-trader-modal.tsx";

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  // Function to check if a nav item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    clearUser();
    if (onLinkClick) onLinkClick();
    navigate("/");
  };

  // Using original menu items
  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/main/dashboard" },
    { title: "Personal Information", icon: User, path: "/main/personal" },
    { title: "Withdrawal", icon: ArrowUpDown, path: "/main/withdrawal" },
    { title: "Verification", icon: FileCheck, path: "/main/verification" },
    { title: "Accounts", icon: Folders, path: "/main/accounts" },
    { title: "Live Chat", icon: MessageSquare, path: "/main/chat" },
    { title: "Savings", icon: PiggyBank, path: "/main/savings" },
    { title: "Settings", icon: Settings, path: "/main/settings" },
  ];

  return (
      <aside className="bg-[#1E223D] h-full w-20 flex flex-col items-center shadow-lg">
        {/* Scrollable navigation container */}
        <div className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <nav className="py-4 w-full">
            <ul className="space-y-1">
              {navItems.map((item) => (
                  <li key={item.title} className="px-2">
                    <Link
                        to={item.path}
                        className={`flex flex-col items-center justify-center py-3 px-1 rounded-md text-xs ${
                            isActive(item.path)
                                ? "bg-[#2E3454] text-[#52e5ab]"
                                : "text-gray-300 hover:bg-[#2E3454]/50 hover:text-[#52e5ab]"
                        } transition-all duration-200`}
                        onClick={onLinkClick}
                    >
                      <div className="relative">
                        <item.icon className="h-5 w-5 mb-1" />
                      </div>
                      <span className="text-center text-[10px]">{item.title}</span>
                    </Link>
                  </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout button at the bottom - fixed position */}
        <div className="py-4 w-full px-2 border-t border-gray-700/30">
          <div>
            <AutoTraderModal isMini={true} />

            <button
                onClick={handleLogout}
                className="w-full flex flex-col items-center justify-center py-3 px-1 rounded-md text-xs text-gray-300 hover:bg-[#2E3454]/50 hover:text-[#52e5ab] transition-all duration-200"
            >
              <LogOut className="h-5 w-5 mb-1" />
              <span className="text-center text-[10px]">LOG OUT</span>
            </button>
          </div>

        </div>
      </aside>
  );
};

export default Sidebar;

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  ArrowUpDown,
  FileCheck,
  Folders,
  MessageSquare,
  PiggyBank,
  Settings,
  LogOut,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useUserStore from "@/store/userStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";

interface SidebarProps {
  onLinkClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    clearUser();
    navigate("/main/deposit");
  };

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

  // Function to check if a nav item is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="bg-trading-dark h-full w-60 flex flex-col border-r border-trading-darker">
      <div className="flex flex-col items-center text-center p-6 border-b border-trading-darker">
        {" "}
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={user?.avatar}
            alt={`${user?.first_name} ${user?.last_name}`}
          />
          <AvatarFallback className="bg-sidebar-accent text-2xl font-semibold">
            {user
              ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
              : ""}
          </AvatarFallback>
        </Avatar>{" "}
        <h2 className="text-lg font-medium text-trading-light">
          {user ? `${user.first_name} ${user.last_name}` : ""}
        </h2>
        {/* <p className="text-sm text-trading-muted mt-1">#{user?.id || ""}</p> */}
        <p className="text-xs text-trading-muted/70 mt-1">
          {user?.email || ""}
        </p>
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          {" "}
          <Button>
            <Link to="/main/deposit" onClick={onLinkClick}>
              Deposit
            </Link>
          </Button>
          <Button variant="ghost">Autotrader</Button>
        </div>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ScrollArea>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.title}>
                {" "}
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-trading-light/80 hover:text-trading-light hover:bg-trading-accent/20 transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-trading-accent/30 text-trading-light"
                      : ""
                  }`}
                  onClick={onLinkClick}
                >
                  <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </nav>{" "}
      <div className="p-4 border-t border-trading-darker">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-trading-light/80 hover:text-trading-light hover:bg-trading-accent/20 transition-all duration-200 w-full justify-start group"
        >
          <LogOut className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

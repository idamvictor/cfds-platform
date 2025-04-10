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
    navigate("/");
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
    <aside className="bg-sidebar h-full w-60 flex flex-col border-r border-sidebar-border">
      <div className="flex flex-col items-center text-center p-6 border-b border-sidebar-border">
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
        </Avatar>
        <h2 className="text-lg font-medium text-sidebar-foreground">
          {user ? `${user.first_name} ${user.last_name}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">#{user?.id || ""}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {user?.email || ""}
        </p>
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          <Link
            to="/main/deposit"
            className="bg-sidebar-primary text-sidebar-primary-foreground font-medium px-6 rounded-md transition-all text-sm py-3"
            onClick={onLinkClick}
          >
            Deposit
          </Link>
          <button className="bg-transparent border border-muted/30 text-sidebar-foreground font-medium py-2 px-6 rounded-md hover:bg-muted/10 transition-all text-sm">
            Autotrader
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ScrollArea>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
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
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 w-full justify-start group"
        >
          <LogOut className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
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

interface SidebarProps {
  userInfo: {
    name: string;
    id: string;
    email: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ userInfo }) => {
  const location = useLocation();

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Personal Information", icon: User, path: "/personal" },
    { title: "Deposit", icon: PiggyBank, path: "/deposit" },
    { title: "Withdrawal", icon: ArrowUpDown, path: "/withdrawal" },
    { title: "Verification", icon: FileCheck, path: "/verification" },
    { title: "Accounts", icon: Folders, path: "/accounts" },
    { title: "Live Chat", icon: MessageSquare, path: "/chat" },
    { title: "Savings", icon: PiggyBank, path: "/savings" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  // Function to check if a nav item is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="bg-trading-dark h-full w-60 flex flex-col border-r border-border/20">
      <div className="flex flex-col items-center text-center p-6 border-b border-border/20">
        <div className="h-20 w-20 rounded-full bg-sidebar-accent flex items-center justify-center mb-3">
          <User className="h-10 w-10 text-muted" />
        </div>
        <h2 className="text-lg font-medium text-foreground">{userInfo.name}</h2>
        <p className="text-sm text-muted mt-1">#{userInfo.id}</p>
        <p className="text-xs text-muted/70 mt-1">{userInfo.email}</p>

        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          <Link
            to="/deposit"
            className="bg-trading-green text-white font-medium py-2 px-6 rounded-md transition-all text-sm py-3"
          >
            Deposit
          </Link>
          <button className="bg-transparent border border-muted/30 text-foreground font-medium py-2 px-6 rounded-md hover:bg-muted/10 transition-all text-sm">
            Autotrader
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 group ${
                  isActive(item.path) ? "bg-sidebar-accent text-foreground" : ""
                }`}
              >
                <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border/20">
        <button className="flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 w-full justify-start group">
          <LogOut className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

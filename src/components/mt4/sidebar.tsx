import type React from "react";
import {
  BarChart3,
  BookOpen,
  Bell,
  MessageSquare,
  Play,
  TrendingUp,
  Grid3X3,
  Star,
  History,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: Grid3X3, label: "CLIENT AREA" },
  { icon: BarChart3, label: "TRADE ROOM", isActive: true },
  { icon: BookOpen, label: "ORDER BOOK" },
  { icon: Star, label: "WATCH LIST" },
  { icon: Bell, label: "ALERTS & NOTIFICATION" },
  { icon: History, label: "FINANCIAL HISTORY" },
  { icon: MessageSquare, label: "CHAT & SUPPORT" },
  { icon: Play, label: "VIDEO GUIDES" },
  { icon: TrendingUp, label: "TECHNICAL ANALYSIS" },
];

export default function Sidebar() {
  const isMobile = useMobile();

  return (
    <aside
      className={`bg-[#1C2030] border-r border-slate-700 flex flex-col p-4 ${
        isMobile ? "w-16" : "w-25"
      }`}
    >
      <nav className="flex flex-col gap-6">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex flex-col items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                item.isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-6 h-6" />
              {!isMobile && (
                <span className="text-center leading-tight">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

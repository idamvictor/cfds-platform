import type React from "react";
import {
  BarChart3,
  Play,
  TrendingUp,
  Star,
  History,
  LineChart,
  Clock,
  Calendar,
  Newspaper,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import useOverlayStore from "@/store/overlayStore";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  panelId: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: BarChart3,
    label: "TRADE ROOM",
    isActive: true,
    panelId: "trade-room",
  },
  { icon: LineChart, label: "MARKET WATCH", panelId: "market-watch" },
  { icon: BarChart3, label: "ACTIVE ORDERS", panelId: "active-orders" },
  { icon: Clock, label: "TRADING HISTORY", panelId: "trading-history" },
  { icon: Calendar, label: "CALENDAR", panelId: "calendar" },
  { icon: Newspaper, label: "MARKET NEWS", panelId: "market-news" },
  { icon: Star, label: "WATCH LIST", panelId: "watch-list" },
  { icon: History, label: "FINANCIAL HISTORY", panelId: "financial-history" },
  { icon: Play, label: "VIDEO GUIDES", panelId: "video-guides" },
  {
    icon: TrendingUp,
    label: "TECHNICAL ANALYSIS",
    panelId: "technical-analysis",
  },
];

export default function Sidebar() {
  const isMobile = useMobile(768);
  const { activePanel, setActivePanel } = useOverlayStore();

  const handleItemClick = (item: SidebarItem) => {
    if (item.panelId === "trade-room") return; // Don't toggle for trade room
    setActivePanel(activePanel === item.panelId ? null : (item.panelId as any));
  };

  return (
    <div
      className={`bg-[#1C2030] border-r border-slate-700 p-1 flex flex-col h-full ${
        isMobile ? "w-16" : "w-20"
      }`}
    >
      <nav className="flex flex-col gap-6 overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isSelected = activePanel === item.panelId || item.isActive;
          return (
            <div
              key={index}
              className={`flex flex-col items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                isSelected ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleItemClick(item)}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              {!isMobile && (
                <span className="text-center leading-tight">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

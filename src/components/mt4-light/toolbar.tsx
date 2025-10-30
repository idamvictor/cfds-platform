import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Play, Menu } from "lucide-react";
import useUserStore from "@/store/userStore";
import useDarkModeStore from "@/store/darkModeStore";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TradingInterface } from "../mt4/trading-interface-copy";

interface ToolbarProps {
  isMobile?: boolean;
  onToggleSidebar?: () => void;
}

export function Toolbar({ isMobile, onToggleSidebar }: ToolbarProps) {
  const user = useUserStore((state) => state.user);
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  const unreadNotifications =
    user?.notifications.filter((n) => !n.read_at).length || 0;
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-slate-800 border-slate-600"
          : "bg-white border-slate-300"
      } border-b px-4 py-2 flex items-center justify-between`}
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <DropdownMenu
          open={isTradeModalOpen}
          onOpenChange={setIsTradeModalOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${
                isDarkMode
                  ? "bg-slate-800 border-blue-500 text-slate-200 hover:bg-slate-700"
                  : "bg-white border-blue-300 text-slate-700 hover:bg-blue-50"
              }`}
            >
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`p-0 w-[250px] border shadow-lg ${
              isDarkMode
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-slate-300"
            }`}
          >
            <TradingInterface />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Play className="h-6 w-6 text-green-500 fill-green-500" />
        <span
          className={`text-sm font-medium ${
            isDarkMode ? "text-slate-200" : "text-slate-700"
          }`}
        >
          Auto Trading
        </span>
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar}
              alt={`${user?.first_name} ${user?.last_name}`}
            />
            <AvatarFallback>
              {user ? `${user.first_name[0]}${user.last_name[0]}` : "U"}
            </AvatarFallback>
          </Avatar>
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-2 -right-2 rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
              {unreadNotifications}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

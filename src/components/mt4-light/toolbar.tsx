import { Button } from "@/components/ui/button";
import { Plus, Play, Menu } from "lucide-react";
import useDarkModeStore from "@/store/darkModeStore";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TradingInterface } from "../mt4/trading-interface-copy";
import BuySellFloatingButtonsLight from "./chart-area/buy-sell-floating-buttons-light";

interface ToolbarProps {
  isMobile?: boolean;
  onToggleSidebar?: () => void;
}

export function Toolbar({ isMobile, onToggleSidebar }: ToolbarProps) {
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
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
      <div className="flex items-center gap-4">
        <Play className="h-6 w-6 text-slate-500 fill-slate-500" />
        <span
          className={`text-sm font-medium ${
            isDarkMode ? "text-slate-200" : "text-slate-700"
          }`}
        >
          Auto Trading
        </span>
        <BuySellFloatingButtonsLight />
      </div>
    </div>
  );
}

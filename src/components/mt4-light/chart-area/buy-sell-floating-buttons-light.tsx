import type { PointerEvent } from "react";
import TradingInterface from "@/components/mt4/trading-interface-copy";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAssetStore from "@/store/assetStore";
import useDarkModeStore from "@/store/darkModeStore";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { toast } from "sonner";

const AUTO_TRADER_LOCK_MESSAGE =
  "Auto trader is currently enabled on your account please contact support....";

export default function BuySellFloatingButtonsLight() {
  const activeAsset = useAssetStore((state) => state.activeAsset);
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  const user = useUserStore((state) => state.user);
  const enableAutotrader = useSiteSettingsStore(
    (state) => state.settings?.enable_autotrader === true
  );
  const isAutoTraderLocked = enableAutotrader && Boolean(user?.autotrader);
  const buyPrice = activeAsset?.buy_price ?? 0;
  const sellPrice = activeAsset?.sell_price ?? 0;

  const handleTriggerPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (isAutoTraderLocked) {
      event.preventDefault();
      toast.error(AUTO_TRADER_LOCK_MESSAGE);
    }
  };

  return (
    <div className="relative flex items-center w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`bg-[#10B981] hover:bg-[#059669] text-white px-4 py-1.5 h-auto shadow-none font-semibold text-base w-[100px] rounded-tl-sm rounded-bl-sm rounded-tr-none rounded-br-none ${
              isAutoTraderLocked
                ? "opacity-60 cursor-not-allowed hover:bg-[#10B981]"
                : ""
            }`}
            onPointerDown={handleTriggerPointerDown}
          >
            <span className="flex flex-col items-center gap-0 w-full">
              <span className="text-xs">BUY</span>
              <span className="text-[11px] font-medium tabular-nums">
                {buyPrice.toFixed(4)}
              </span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`p-0 w-[250px] ${
            isDarkMode ? "bg-[#1C2030]" : "bg-white"
          }`}
        >
          <TradingInterface type="buy" />
        </DropdownMenuContent>
      </DropdownMenu>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center px-2 py-.5 rounded-sm z-10 ${
                isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-900"
              }`}
            >
              <p className="text-xs tabular-nums">{activeAsset?.spread ?? 0}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent
            className={`${
              isDarkMode
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-white text-slate-900 border-slate-200"
            }`}
          >
            <p className="text-xs">Spread</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`bg-[#FF4D4D] hover:bg-[#e63939] text-white px-4 py-1.5 h-auto shadow-none font-semibold text-base w-[100px] rounded-tr-sm rounded-br-sm rounded-tl-none rounded-bl-none ${
              isAutoTraderLocked
                ? "opacity-60 cursor-not-allowed hover:bg-[#FF4D4D]"
                : ""
            }`}
            onPointerDown={handleTriggerPointerDown}
          >
            <span className="flex flex-col items-center gap-0 w-full">
              <span className="text-xs">SELL</span>
              <span className="text-[11px] font-medium tabular-nums">
                {sellPrice.toFixed(4)}
              </span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`p-0 w-[250px] ${
            isDarkMode ? "bg-[#1C2030]" : "bg-white"
          }`}
        >
          <TradingInterface type="sell" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

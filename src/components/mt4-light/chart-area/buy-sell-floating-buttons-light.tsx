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

export default function BuySellFloatingButtonsLight() {
  const activeAsset = useAssetStore((state) => state.activeAsset);
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  const buyPrice = activeAsset?.buy_price ?? 0;
  const sellPrice = activeAsset?.sell_price ?? 0;

  return (
    <div className="relative">
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#0D6EFD] hover:bg-[#0b5ed7] text-white px-4 py-1.5 h-auto shadow-none font-semibold text-base w-[100px] rounded-sm">
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

        {(activeAsset?.spread ?? 0) > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-center px-3 py-2 ${
                    isDarkMode ? "bg-none text-white" : "bg-none text-slate-900"
                  }`}
                >
                  <p className="text-xs tabular-nums">
                    {(activeAsset?.spread ?? 0).toFixed(1)}
                  </p>
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
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#FF4D4D] hover:bg-[#e63939] text-white px-4 py-1.5 h-auto shadow-none font-semibold text-base w-[100px] rounded-sm">
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
    </div>
  );
}

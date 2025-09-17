import TradingInterface from "@/components/mt4/trading-interface-copy";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import TradingInterface from "../trading-interface-copy";
import useAssetStore from "@/store/assetStore";

export default function BuySellFloatingButtonsLight() {
  const activeAsset = useAssetStore((state) => state.activeAsset);
  const buyPrice = activeAsset?.buy_price ?? 0;
  const sellPrice = activeAsset?.sell_price ?? 0;

  return (
    <div className="relative">
      {(activeAsset?.spread ?? 0) > 0 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center bg-white text-slate-900 rounded-none px-3 py-0.5 border">
          <p className="text-xs">
            SPREAD {(activeAsset?.spread ?? 0).toFixed(1)}
          </p>
        </div>
      )}
      <div className="flex gap-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="bg-[#4CD080] hover:bg-[#3fb06c] text-white px-6 py-2 h-auto shadow-none font-semibold text-base w-[120px] rounded-none"
            >
              <span className="flex flex-col items-center gap-0.5 w-full">
                <span className="text-sm">BUY</span>
                <span className="text-xs font-medium tabular-nums">
                  {buyPrice.toFixed(4)}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0 bg-[#1C2030] w-[250px]">
            <TradingInterface type="buy" />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#FF4D4D] hover:bg-[#e63939] text-white px-6 py-2 h-auto shadow-none font-semibold text-base w-[120px] rounded-none">
              <span className="flex flex-col items-center gap-0.5 w-full">
                <span className="text-sm">SELL</span>
                <span className="text-xs font-medium tabular-nums">
                  {sellPrice.toFixed(4)}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0 bg-[#1C2030] w-[250px]">
            <TradingInterface type="sell" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

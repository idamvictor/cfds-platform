import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TradingInterface from "../trading-interface-copy";
import useAssetStore from "@/store/assetStore";

export default function BuySellFloatingButtons() {
  const activeAsset = useAssetStore((state) => state.activeAsset);
  const buyPrice = activeAsset?.buy_price ?? 0;
  const sellPrice = activeAsset?.sell_price ?? 0;

  return (
    <div className="absolute top-10 right-10 flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="bg-transparent hover:bg-[#234134] text-[#4CD080] px-4 py-1 h-auto border-1 border-[#4CD080] shadow-none font-medium text-base w-[120px]"
          >
            <span className="flex flex-col items-center gap-0.5 w-full">
              <span className="text-sm">BUY</span>
              <span className="text-xs opacity-90 tabular-nums">
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
          <Button className="bg-transparent hover:bg-[#4a2828] text-[#FF4D4D] px-4 py-1 h-auto shadow-none font-medium text-base border-1 border-[#FF4D4D] w-[120px]">
            <span className="flex flex-col items-center gap-0.5 w-full">
              <span className="text-sm">SELL</span>
              <span className="text-xs opacity-90 tabular-nums">
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
  );
}

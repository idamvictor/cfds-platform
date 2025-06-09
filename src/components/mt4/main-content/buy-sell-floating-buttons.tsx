import { Button } from "@/components/ui/button";

export default function BuySellFloatingButtons() {
  return (
    <div className="absolute top-10 right-10 flex gap-2">
      <Button
        variant="ghost"
        className="bg-transparent hover:bg-[#234134] text-[#4CD080] px-4 py-1 h-auto border-1 border-[#4CD080] shadow-none font-medium text-base"
      >
        <span className="flex flex-col items-center gap-0.5">
          <span className="text-sm">BUY</span>
          <span className="text-xs opacity-90">43702.10</span>
        </span>
      </Button>
      <Button className="bg-transparent hover:bg-[#4a2828] text-[#FF4D4D] px-4 py-1 h-auto shadow-none font-medium text-base border-1 border-[#FF4D4D]">
        <span className="flex flex-col items-center gap-0.5">
          <span className="text-sm">SELL</span>
          <span className="text-xs opacity-90">43702.10</span>
        </span>
      </Button>
    </div>
  );
}

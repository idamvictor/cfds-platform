import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AssetListingTabs } from "./header/asset-listing-tabs";
import Logo from "../Logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import TradingInterface from "./trading-interface";

export default function Header() {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  return (
    <header className="bg-[#1C2030] border-b border-slate-700 px-4 py-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between  lg:gap-0">
        {/* Top row for mobile, normal layout for desktop */}
        <div className="flex lg:hidden items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <Button
            className="border border-green-500 bg-transparent text-primary hover:bg-green-500 hover:text-white transition-colors"
            onClick={() => setIsTradeModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <AssetListingTabs />
        </div>

        {/* Desktop new order button */}
        <div className="hidden lg:block">
          <Button
            className="border border-green-500 bg-transparent text-primary hover:bg-green-500 hover:text-white transition-colors"
            onClick={() => setIsTradeModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Mobile asset listing tabs */}
        <div className="lg:hidden w-full">
          <AssetListingTabs />
        </div>
      </div>

      <Dialog open={isTradeModalOpen} onOpenChange={setIsTradeModalOpen}>
        <DialogContent className="p-0 bg-[#1C2030]">
          <TradingInterface />
        </DialogContent>
      </Dialog>
    </header>
  );
}

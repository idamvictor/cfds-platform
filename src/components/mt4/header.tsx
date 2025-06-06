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
    <header className="bg-[#1C2030] border-b border-slate-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Trading Instrument Tabs */}
        <AssetListingTabs />
      </div>

      {/* New Order Button and Modal */}
      <Button
        className=" border border-green-500 bg-transparent text-primary hover:bg-green-500 hover:text-white transition-colors"
        onClick={() => setIsTradeModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        New Order
      </Button>

      <Dialog open={isTradeModalOpen} onOpenChange={setIsTradeModalOpen} >
        <DialogContent className=" p-0 bg-[#1C2030]">
          
            <TradingInterface />
          
        </DialogContent>
      </Dialog>
    </header>
  );
}

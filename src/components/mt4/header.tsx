import { Button } from "@/components/ui/button";
import { TrendingUp, Grid3X3, Plus } from "lucide-react";
import { AssetListingTabs } from "./header/asset-listing-tabs";

export default function Header() {
  return (
    <header className="bg-[#1C2030] border-b border-slate-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-green-400 font-semibold">Citation Invest</span>
        </div>

        {/* Menu Button */}
        <Button variant="ghost" size="sm" className="text-gray-400">
          <Grid3X3 className="w-4 h-4" />
        </Button>

        {/* Trading Instrument Tabs */}
        {/* <div className="flex items-center gap-1">
          <div className="bg-orange-600 px-3 py-1 rounded flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs">
              ₿
            </div>
            <span>Bitcoin</span>
            <span className="text-xs text-orange-200">Binary</span>
            <X className="w-3 h-3 ml-2" />
          </div>
          <div className="bg-slate-700 px-3 py-1 rounded flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">
              €
            </div>
            <span>USD/EUR</span>
            <span className="text-xs text-gray-400">Digital</span>
            <X className="w-3 h-3 ml-2" />
          </div>
          <div className="bg-slate-700 px-3 py-1 rounded flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-xs">
              Ξ
            </div>
            <span>Ethereum</span>
            <span className="text-xs text-gray-400">$365</span>
            <X className="w-3 h-3 ml-2" />
          </div>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div> */}
        <AssetListingTabs/>

      </div>

      {/* New Order Button */}
      <Button className="bg-green-600 hover:bg-green-700 border border-green-500">
        <Plus className="w-4 h-4 mr-2" />
        New Order
      </Button>
    </header>
  );
}

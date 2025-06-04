import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AssetListingTabs } from "./header/asset-listing-tabs";
import Logo from "../Logo";

export default function Header() {
  return (
    <header className="bg-[#1C2030] border-b border-slate-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Trading Instrument Tabs */}
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

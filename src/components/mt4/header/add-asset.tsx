import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import useAssetStore from "@/store/assetStore";
import { CurrencyFlag } from "../../trading/trading-interface-components/header";
import { Input } from "@/components/ui/input";

export default function AddAsset() {
  const [selectedTab, setSelectedTab] = useState<string>("forex");
  const [searchQuery, setSearchQuery] = useState("");
  const { groupedAssets, addPair } = useAssetStore();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { id: "forex", label: "Forex", count: groupedAssets["forex"]?.length || 0 },
    {
      id: "stocks",
      label: "Stock",
      count: groupedAssets["stocks"]?.length || 0,
    },
    {
      id: "crypto",
      label: "Crypto",
      count: groupedAssets["crypto"]?.length || 0,
    },
    {
      id: "commodities",
      label: "Commodities",
      count: groupedAssets["commodities"]?.length || 0,
    },
    {
      id: "indices",
      label: "ETFs",
      count: groupedAssets["indices"]?.length || 0,
    },
  ];

  const handleAssetSelect = (symbolDisplay: string) => {
    addPair(symbolDisplay);
    setIsOpen(false);
  };

  const filteredAssets =
    groupedAssets[selectedTab]?.filter(
      (asset) =>
        asset.symbol_display
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-[#2A3447] ml-auto"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>{" "}
      <DialogContent className="sm:max-w-[1000px] bg-[#1B2331] border-[#2A3447] p-0">
        <div className="flex h-[600px]">
          {/* Left Sidebar */}
          <div className="w-[200px] border-r border-[#2A3447] p-2 space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedTab(category.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded transition-colors
                  ${
                    selectedTab === category.id
                      ? "bg-[#2A3447] text-white"
                      : "text-muted-foreground hover:bg-[#2A3447] hover:text-white"
                  }`}
              >
                {category.label}
                <span className="ml-auto rounded-full bg-[#1C2030] px-2 py-0.5 text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-[#2A3447]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-9 bg-[#1C2030] border-[#2A3447] text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Assets Table Header */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 border-b border-[#2A3447] text-xs text-muted-foreground">
              <div>Symbol</div>
              <div>Name</div>
              <div className="text-right">Change</div>
            </div>

            {/* Assets List */}
            <div className="flex-1 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => handleAssetSelect(asset.symbol_display)}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 w-full hover:bg-[#2A3447] transition-colors items-center"
                >
                  <div className="flex items-center gap-2">
                    <CurrencyFlag pair={asset.symbol_display} />
                    <span className="text-sm font-medium text-white">
                      {asset.symbol_display}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {asset.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        parseFloat(asset.change_percent || "0") >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {parseFloat(asset.change_percent || "0").toFixed(2)}%
                    </span>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-[#1B2331] border-[#2A3447] p-0">
        <div className="flex flex-col h-[600px]">
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

          {/* Category Tabs */}
          <div className="flex border-b border-[#2A3447]">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedTab(category.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors relative
                  ${
                    selectedTab === category.id
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F7931A]"
                      : "text-muted-foreground hover:text-white"
                  }`}
              >
                {category.label}
                <span className="rounded-full bg-[#2A3447] px-2 py-0.5 text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Assets List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-2">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => handleAssetSelect(asset.symbol_display)}
                  className="flex items-center justify-between p-3 rounded hover:bg-[#2A3447] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CurrencyFlag pair={asset.symbol_display} />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-white">
                        {asset.symbol_display}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {asset.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-white">
                        {parseFloat(asset.rate).toFixed(2)}
                      </span>
                      <span
                        className={`text-xs ${
                          parseFloat(asset.change_percent || "0") >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {parseFloat(asset.change_percent || "0").toFixed(2)}%
                      </span>
                    </div>
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

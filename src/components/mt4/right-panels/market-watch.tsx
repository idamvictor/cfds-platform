import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import useAssetStore from "@/store/assetStore";

export default function MarketWatch() {
  const { groupedAssets, fetchAssets, setActiveAsset } = useAssetStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchAssets();
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchAssets]);

  return (
    <div className="h-full flex flex-col bg-[#1C2030]">
      {/* Market Watch Header - Fixed */}
      <div className="bg-slate-700 border-b border-[#2A3038] sticky top-0 z-10">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">
              Market Watch: {time.toLocaleTimeString()}
            </span>
          </div>
          <div className="relative mt-2">
            <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Market"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C2030] rounded px-7 py-0.5 text-[10px] text-white placeholder:text-[10px] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Symbol Header */}
        <div className="grid grid-cols-2 px-2 py-1 bg-[#1C2030] text-[10px] text-gray-400">
          <div>Symbol</div>
          <div className="text-right grid grid-cols-2">
            <div>Bid</div>
            <div>Ask</div>
          </div>
        </div>
      </div>

      {/* Market Data - Scrollable */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="divide-y divide-[#2A3038]/50">
          {Object.entries(groupedAssets).flatMap(([_type, typeAssets]) => {
            const filteredAssets = typeAssets.filter(
              (asset) =>
                !searchQuery ||
                asset.symbol_display
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                asset.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredAssets.length === 0) return [];

            return filteredAssets.map((asset) => {
              const buyPrice = asset.buy_price;
              const sellPrice = asset.sell_price;
              const isPositive = Number(asset.change_percent) >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => setActiveAsset(asset)}
                  className="grid grid-cols-2 px-2 py-1 hover:bg-[#1C2030] cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-1 h-1 rounded-full ${
                        isPositive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-[11px] text-white">
                      {asset.symbol_display}
                    </span>
                  </div>
                  <div className="text-right grid grid-cols-2 text-[11px]">
                    <div className="text-blue-400 ">{buyPrice.toFixed(3)}</div>
                    <div className="text-red-400">{sellPrice.toFixed(3)}</div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { BadgeCheck, Search } from "lucide-react";
import useAssetStore from "@/store/assetStore";
import useWatchlistStore from "@/store/watchlistStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MarketWatchLight() {
  const { groupedAssets, fetchAssets, setActiveAsset, addPair } =
    useAssetStore();
  const { watchlist } = useWatchlistStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchAssets();
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
              className="w-full bg-[#1C2030] rounded px-7 py-0.5 text-[8px] text-white placeholder:text-[10px] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table Header */}
        <Table className="border-y border-[#2A3038]">
          <TableHeader className="bg-[#2A3038]">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="h-7 text-[10px] text-gray-400 font-normal border-r border-[#2A3038]">
                Symbol
              </TableHead>
              <TableHead className="h-7 text-[10px] text-gray-400 font-normal text-right border-r border-[#2A3038]">
                Bid
              </TableHead>
              <TableHead className="h-7 text-[10px] text-gray-400 font-normal text-right">
                Ask
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Table Body - Scrollable */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableBody>
            {/* Watchlist Assets on Top */}
            {watchlist
              .filter(
                (asset) =>
                  !searchQuery ||
                  asset.symbol_display
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  asset.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((asset) => {
                const buyPrice = asset.buy_price;
                const sellPrice = asset.sell_price;
                const isPositive = Number(asset.change_percent) >= 0;

                return (
                  <TableRow
                    key={`watchlist-${asset.id}`}
                    onClick={() => {
                      // Convert watchlist asset to assetStore asset type
                      const assetStore = useAssetStore.getState();
                      const found = assetStore.getAssetBySymbol(
                        asset.symbol_display
                      );
                      if (found) {
                        setActiveAsset(found);
                      }
                      addPair(asset.symbol_display);
                    }}
                    className="h-6 cursor-pointer border-b border-[#2A3038] hover:bg-[#2A3038]"
                  >
                    <TableCell className="py-0 text-[11px] border-r border-[#2A3038]">
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-1 h-1 rounded-full ${
                            isPositive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-white font-bold">
                          {asset.symbol_display}
                        </span>
                        <span>
                          <BadgeCheck size={16} strokeWidth={0.5} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-0 text-[11px] text-right text-blue-400 border-r border-[#2A3038]">
                      {buyPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="py-0 text-[11px] text-right text-red-400">
                      {sellPrice.toFixed(3)}
                    </TableCell>
                  </TableRow>
                );
              })}

            {/* Remaining Market Assets */}
            {Object.entries(groupedAssets).flatMap(([, typeAssets]) => {
              const filteredAssets = typeAssets.filter(
                (asset) =>
                  !watchlist.some(
                    (w) => w.symbol_display === asset.symbol_display
                  ) &&
                  (!searchQuery ||
                    asset.symbol_display
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    asset.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()))
              );

              if (filteredAssets.length === 0) return [];

              return filteredAssets.map((asset) => {
                const buyPrice = asset.buy_price;
                const sellPrice = asset.sell_price;
                const isPositive = Number(asset.change_percent) >= 0;

                return (
                  <TableRow
                    key={asset.id}
                    onClick={() => {
                      setActiveAsset(asset);
                      addPair(asset.symbol_display);
                    }}
                    className="h-6 cursor-pointer border-b border-[#2A3038] hover:bg-[#2A3038]"
                  >
                    <TableCell className="py-0 text-[11px] border-r border-[#2A3038]">
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-1 h-1 rounded-full ${
                            isPositive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-white">
                          {asset.symbol_display}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-0 text-[11px] text-right text-blue-400 border-r border-[#2A3038]">
                      {buyPrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="py-0 text-[11px] text-right text-red-400">
                      {sellPrice.toFixed(3)}
                    </TableCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

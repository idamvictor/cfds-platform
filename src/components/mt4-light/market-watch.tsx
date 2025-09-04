// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, X } from "lucide-react";

// interface CurrencyPair {
//   symbol: string;
//   flag: string;
//   bid: string;
//   ask: string;
// }

// interface MarketWatchProps {
//   currencyPairs: CurrencyPair[];
// }

// export function MarketWatch({ currencyPairs }: MarketWatchProps) {
//   return (
//     <div className="p-3 border-b border-slate-300 bg-white">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="font-semibold text-slate-800">Market Watch: 22:56:59</h3>
//       </div>

//       <div className="relative mb-3">
//         <Search className="absolute left-2 top-2 h-4 w-4 text-slate-500" />
//         <Input
//           placeholder="Search Market"
//           className="pl-8 h-8 text-sm border-slate-300 bg-white text-slate-700"
//         />
//         <Button
//           variant="ghost"
//           size="sm"
//           className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-slate-200 text-slate-500"
//         >
//           <X className="h-3 w-3" />
//         </Button>
//       </div>

//       <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-700 mb-2">
//         <div>Symbol</div>
//         <div className="text-center">Bid</div>
//         <div className="text-center">Ask</div>
//       </div>

//       <div className="space-y-1">
//         {currencyPairs.map((pair, index) => (
//           <div
//             key={index}
//             className="grid grid-cols-3 gap-2 py-1 hover:bg-slate-100 rounded text-xs"
//           >
//             <div className="flex items-center gap-2">
//               <span>{pair.flag}</span>
//               <span className="font-medium text-slate-800">{pair.symbol}</span>
//             </div>
//             <div className="text-center text-blue-600 font-medium">
//               {pair.bid}
//             </div>
//             <div className="text-center text-red-600 font-medium">
//               {pair.ask}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

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

export default function MarketWatch() {
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

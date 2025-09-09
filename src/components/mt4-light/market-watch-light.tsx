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
    <div className="h-full flex flex-col bg-white">
      {/* Market Watch Header - Fixed */}
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-slate-400 sticky top-0 z-10">
          <div className="">
            <div className="flex items-center justify-between w-full">
              <span className="bg-[#D2E0EA] text-gray-900 w-full p-2">
                Market Watch: {time.toLocaleTimeString()}
              </span>
            </div>
            <div className="relative mt-2 mb-2  ">
              <Search className="w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Market"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded px-10 py-1.5 text-[11px] text-slate-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto relative">
          <Table>
            <TableHeader className="bg-white sticky top-0 z-10">
              <TableRow className="border-y border-slate-400 hover:bg-transparent">
                <TableHead className="h-10 text-[12px] text-slate-900 font-bold border-r border-slate-400 py-2 px-4 w-[60%] bg-white">
                  Symbol
                </TableHead>
                <TableHead className="h-10 text-[12px] text-slate-900 font-bold text-right border-r border-slate-400 py-2 px-4 w-[20%] bg-white">
                  Bid
                </TableHead>
                <TableHead className="h-10 text-[12px] text-slate-900 font-bold text-right py-2 px-4 w-[20%] bg-white">
                  Ask
                </TableHead>
              </TableRow>
            </TableHeader>
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
                      className="h-10 cursor-pointer border-b border-slate-400 hover:bg-slate-300"
                    >
                      <TableCell className="py-2 px-4 text-[13px] border-r border-slate-400 w-[60%]">
                        <div className="flex items-center space-x-2">
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="w-5 h-5 object-contain rounded-full"
                          />
                          <span className="text-slate-900 font-bold">
                            {asset.symbol_display}
                          </span>
                          <span>
                            <BadgeCheck
                              size={18}
                              strokeWidth={1.5}
                              className="text-slate-900"
                            />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4 text-[13px] text-right font-bold text-blue-400 border-r border-slate-400 w-[20%]">
                        {buyPrice.toFixed(3)}
                      </TableCell>
                      <TableCell className="py-2 px-4 text-[13px] text-right font-bold text-red-400 w-[20%]">
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

                  return (
                    <TableRow
                      key={asset.id}
                      onClick={() => {
                        setActiveAsset(asset);
                        addPair(asset.symbol_display);
                      }}
                      className="h-10 cursor-pointer border-b border-slate-400 hover:bg-slate-300"
                    >
                      <TableCell className="py-2 px-4 text-[13px] border-r border-slate-400 w-[60%]">
                        <div className="flex items-center space-x-2">
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="w-5 h-5 object-contain rounded-full"
                          />
                          <span className="text-slate-900 font-bold">
                            {asset.symbol_display}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4 text-[13px] text-right font-bold text-blue-400 border-r border-slate-400 w-[20%]">
                        {buyPrice.toFixed(3)}
                      </TableCell>
                      <TableCell className="py-2 px-4 text-[13px] text-right font-bold text-red-400 w-[20%]">
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
    </div>
  );
}

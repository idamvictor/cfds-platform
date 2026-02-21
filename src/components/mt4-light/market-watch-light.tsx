import { useState, useEffect, useMemo } from "react";
import { BadgeCheck, Search } from "lucide-react";
import useAssetStore, { type Asset } from "@/store/assetStore";
import useWatchlistStore from "@/store/watchlistStore";
import useDarkModeStore from "@/store/darkModeStore";
import { useMarketWatchSyntheticTicker } from "@/hooks/useMarketWatchSyntheticTicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const scrollbarStyles = `
  .market-watch-scroll::-webkit-scrollbar {
    width: 16px;
  }
  .market-watch-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .market-watch-scroll::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .market-watch-scroll::-webkit-scrollbar-thumb:hover {
    background: #333;
    background-clip: content-box;
  }
`;

export default function MarketWatchLight() {
  const groupedAssets = useAssetStore((state) => state.groupedAssets);
  const fetchAssets = useAssetStore((state) => state.fetchAssets);
  const setActiveAsset = useAssetStore((state) => state.setActiveAsset);
  const addPair = useAssetStore((state) => state.addPair);
  const { watchlist } = useWatchlistStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState(new Date());
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);

  const filteredWatchlist = useMemo(
    () =>
      watchlist.filter(
        (asset) =>
          !searchQuery ||
          asset.symbol_display.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, watchlist]
  );

  const filteredMarketAssets = useMemo(
    () =>
      Object.entries(groupedAssets).flatMap(([, typeAssets]) =>
        typeAssets.filter(
          (asset) =>
            !watchlist.some((w) => w.symbol_display === asset.symbol_display) &&
            (!searchQuery ||
              asset.symbol_display
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              asset.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      ),
    [groupedAssets, searchQuery, watchlist]
  );

  const visibleAssets = useMemo<Asset[]>(
    () => [...filteredWatchlist, ...filteredMarketAssets],
    [filteredMarketAssets, filteredWatchlist]
  );
  const { getDisplayQuote } = useMarketWatchSyntheticTicker(visibleAssets);

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchAssets]);

  return (
    <div
      className={`h-full flex flex-col border border-[#70707080] ${
        isDarkMode ? "bg-slate-900" : "bg-white"
      }`}
    >
      <style>{scrollbarStyles}</style>
      {/* Market Watch Header - Fixed */}
      <div className="flex flex-col h-full">
        <div
          className={`${isDarkMode ? "bg-slate-900" : "bg-white"} border-b ${
            isDarkMode ? "border-slate-600" : "border-slate-400"
          } sticky top-0 z-10`}
        >
          <div className="">
            <div className="flex items-center justify-between w-full">
              <span
                className={`${
                  isDarkMode
                    ? "bg-slate-800 text-slate-200"
                    : "bg-[#D2E0EA] text-gray-900"
                } w-full p-2 pl-6 font-bold text-base leading-[21px]`}
              >
                Market Watch: GMT{" "}
                {time.toLocaleTimeString("en-US", {
                  timeZone: "GMT",
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <div
              className={`relative  border border-[#70707080] ${
                isDarkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              <Search
                className={`w-5 h-5 absolute left-6 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? "text-slate-300" : "text-black"
                }`}
              />
              <input
                type="text"
                placeholder="Search Market"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded px-14 py-2.5 text-[14px] leading-[19px] ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-200 placeholder:text-slate-400"
                    : "bg-white text-black placeholder:text-black"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto relative market-watch-scroll">
          <Table>
            <TableHeader
              className={`sticky top-0 z-10 border-2 border-[#70707066] ${
                isDarkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              <TableRow
                className={`h-[34px] border border-[#70707066] hover:bg-transparent`}
              >
                <TableHead
                  className={`text-[14px] leading-[19px] font-semibold border-r border-[#70707066] py-2 px-4 pl-6 w-[60%] ${
                    isDarkMode
                      ? "bg-slate-800 text-slate-200"
                      : "bg-white text-slate-900"
                  }`}
                >
                  Symbol
                </TableHead>
                <TableHead
                  className={`text-[14px] leading-[19px] font-semibold text-right border-r border-[#70707066] py-2 px-4 w-[20%] ${
                    isDarkMode
                      ? "bg-slate-800 text-slate-200"
                      : "bg-white text-slate-900"
                  }`}
                >
                  Bid
                </TableHead>
                <TableHead
                  className={`text-[14px] leading-[19px] font-semibold text-right py-2 px-4 w-[20%] ${
                    isDarkMode
                      ? "bg-slate-800 text-slate-200"
                      : "bg-white text-slate-900"
                  }`}
                >
                  Ask
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Watchlist Assets on Top */}
              {filteredWatchlist.map((asset) => {
                  const { buyPrice, sellPrice, changePercent } = getDisplayQuote(asset);
                  const isPositive = changePercent >= 0;

                  return (
                    <TableRow
                      key={`watchlist-${asset.id}`}
                      onClick={() => {
                        // Convert watchlist asset to assetStore asset type
                        const assetStore = useAssetStore.getState();
                        const found = assetStore.getAssetBySymbol(
                          asset.symbol_display,
                        );
                        if (found) {
                          setActiveAsset(found);
                        }
                        addPair(asset.symbol_display);
                      }}
                      className={`h-10 cursor-pointer border-b border-[#70707066]`}
                    >
                      <TableCell
                        className={`py-2 px-4 pl-6 text-[13px] border-r border-[#70707066] w-[60%]`}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="w-5 h-5 object-contain rounded-full"
                          />
                          <span
                            className={`${
                              isDarkMode ? "text-slate-200" : "text-slate-900"
                            } font-bold`}
                          >
                            {asset.symbol_display}
                          </span>
                          <span>
                            <BadgeCheck
                              size={18}
                              strokeWidth={1.5}
                              className={
                                isDarkMode ? "text-slate-200" : "text-slate-900"
                              }
                            />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`py-2 px-4 text-[13px] text-right font-bold border-r border-[#70707066] w-[20%] ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {buyPrice.toFixed(3)}
                      </TableCell>
                      <TableCell
                        className={`py-2 px-4 text-[13px] text-right font-bold w-[20%] ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {sellPrice.toFixed(3)}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {/* Remaining Market Assets */}
              {filteredMarketAssets.map((asset) => {
                  const { buyPrice, sellPrice, changePercent } = getDisplayQuote(asset);
                  const isPositive = changePercent >= 0;

                  return (
                    <TableRow
                      key={asset.id}
                      onClick={() => {
                        setActiveAsset(asset);
                        addPair(asset.symbol_display);
                      }}
                      className={`h-10 cursor-pointer border-b border-2 border-[#70707066]`}
                    >
                      <TableCell
                        className={`py-2 px-4 pl-6 text-[13px] border-r border-[#70707066] w-[60%]`}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="w-5 h-5 object-contain rounded-full"
                          />
                          <span
                            className={`${
                              isDarkMode ? "text-slate-200" : "text-slate-900"
                            } font-bold`}
                          >
                            {asset.symbol_display}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`py-2 px-4 text-[13px] text-right font-bold border-r border-[#70707066] w-[20%] ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {buyPrice.toFixed(3)}
                      </TableCell>
                      <TableCell
                        className={`py-2 px-4 text-[13px] text-right font-bold w-[20%] ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {sellPrice.toFixed(3)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

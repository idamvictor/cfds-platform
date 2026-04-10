import type { Asset } from "@/store/assetStore";

export interface HeatmapQuote {
  rate: number;
  changePercent: number;
}

interface MarketHeatmapProps {
  assets: Asset[];
  getQuote: (asset: Asset) => HeatmapQuote;
  onAssetClick: (asset: Asset) => void;
  formatPrice: (price: number) => string;
}

export function MarketHeatmap({
  assets,
  getQuote,
  onAssetClick,
  formatPrice,
}: MarketHeatmapProps) {
  return (
    <div className="mb-7 grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
      {assets.map((asset) => {
        const quote = getQuote(asset);
        const chg = quote.changePercent;
        const up = chg >= 0;
        const strong = Math.abs(chg) > 3;
        return (
          <div
            key={asset.id}
            onClick={() => onAssetClick(asset)}
            className="relative cursor-pointer overflow-hidden rounded-[10px] border border-transparent py-3 px-2.5 text-center transition-all duration-150 hover:z-10 hover:scale-[1.03] hover:border-white/10"
          >
            <div
              className={`absolute inset-0 rounded-[10px] ${
                up ? "bg-[#00dfa2]" : "bg-[#f43f5e]"
              } ${strong ? "opacity-[0.22]" : "opacity-[0.12]"}`}
            />
            <div className="relative">
              <div className="mb-1 text-[0.7rem] font-extrabold text-[#eef2f7]">
                {asset.sy || asset.symbol}
              </div>
              <div
                className={`font-mono text-[0.72rem] font-extrabold ${
                  up ? "text-[#00dfa2]" : "text-[#f43f5e]"
                }`}
              >
                {up ? "+" : ""}
                {chg.toFixed(2)}%
              </div>
              <div className="mt-0.5 font-mono text-[0.6rem] text-[#4a5468]">
                ${formatPrice(quote.rate)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

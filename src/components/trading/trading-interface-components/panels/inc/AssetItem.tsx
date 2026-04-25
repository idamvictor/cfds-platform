import { useState, useEffect, useRef, memo } from "react";
import { Plus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Asset } from "@/store/assetStore";
import AssetInfoModal from "./AssetInfoModal";
import type { MarketWatchDisplayQuote } from "@/hooks/useMarketWatchSyntheticTicker";

interface AssetItemProps {
    asset: Asset;
    isActive: boolean;
    onClick: () => void;
    displayQuote?: MarketWatchDisplayQuote;
}

const AssetItem = memo(({
                            asset,
                            isActive,
                            onClick,
                            displayQuote,
                        }: AssetItemProps) => {
    const [priceColor, setPriceColor] = useState<string>("");
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const initialRate = displayQuote?.rate ?? (Number.parseFloat(asset.rate) || 0);
    const previousPriceRef = useRef<number>(initialRate);

    // Parse numeric values for percentage change
    const currentPrice = displayQuote?.rate ?? (Number.parseFloat(asset.rate) || 0);
    const changePercent =
        displayQuote?.changePercent ??
        (asset.change_percent ? Number.parseFloat(asset.change_percent) : 0);
    const percentPrecision = displayQuote?.isSynthetic ? 3 : 2;
    const isPositiveChange = changePercent >= 0;
    const formattedPercent =
        (isPositiveChange ? "+" : "") + changePercent.toFixed(percentPrecision) + "%";

    // Determine text color for percent change
    const percentColor = isPositiveChange ? "text-emerald-500" : "text-red-500";

    // Check price changes and apply flash effect
    useEffect(() => {
        const prevPrice = previousPriceRef.current;

        // Only flash if we have a previous price to compare with
        if (prevPrice !== currentPrice) {
            // Set color based on price change
            if (currentPrice > prevPrice) {
                setPriceColor("text-emerald-500");
            } else if (currentPrice < prevPrice) {
                setPriceColor("text-red-500");
            }

            previousPriceRef.current = currentPrice;

            const timer = setTimeout(() => {
                setPriceColor("");
            }, 2200);

            return () => clearTimeout(timer);
        }
    }, [currentPrice]);

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent onClick handler
        setIsInfoModalOpen(true);
    };

    return (
        <>
            <div
                className={cn(
                    "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center py-2 px-2 hover:bg-[rgba(255,255,255,0.06)] border-b border-[rgba(255,255,255,0.04)] cursor-pointer gap-2 text-[#eef2f7]",
                    isActive ? "bg-[rgba(0,223,162,0.08)]" : ""
                )}
                onClick={onClick}
            >
                {/* Asset icon */}
                <div className="flex-shrink-0">
                    {asset.image ? (
                        <img
                            src={asset.image}
                            alt={asset.symbol}
                            className="h-4 w-4 rounded-full"
                        />
                    ) : (
                        <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            {asset.symbol.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="overflow-hidden-">
                    <span className="text-xs font-light overflow-hidden- whitespace-nowrap-block">
                        {asset.name}
                    </span>
                </div>

                <div className="flex pl-3 items-center gap-2 flex-shrink-0-">
                    <span className={cn(
                        "text-xs font-medium w-14 text-right truncate whitespace-nowrap-block transition-colors duration-300",
                        priceColor
                    )}>
                        {currentPrice.toFixed(5)}
                    </span>
                    <span className={cn(
                        "text-xs w-16 text-right truncate",
                        percentColor
                    )}>
                        {formattedPercent}
                    </span>
                    <button
                        className="text-[#8b97a8] hover:text-[#eef2f7] w-3 flex items-center justify-center"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                        className="text-[#8b97a8] hover:text-[#eef2f7] w-3 flex items-center justify-center cursor-pointer"
                        onClick={handleInfoClick}
                        aria-label="View asset information"
                        title="Asset Information"
                    >
                        <Info className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <AssetInfoModal
                asset={asset}
                open={isInfoModalOpen}
                onOpenChange={setIsInfoModalOpen}
                onTradeClick={onClick}
            />
        </>
    );
});

AssetItem.displayName = "AssetItem";

export default AssetItem;

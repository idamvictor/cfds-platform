import { useState, useEffect, useRef, memo } from "react";
import { Plus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Asset } from "@/store/assetStore";
import AssetInfoModal from "./AssetInfoModal";

interface AssetItemProps {
    asset: Asset;
    isActive: boolean;
    onClick: () => void;
}

const AssetItem = memo(({
                            asset,
                            isActive,
                            onClick
                        }: AssetItemProps) => {
    const [priceColor, setPriceColor] = useState<string>("");
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const previousPriceRef = useRef<number>(Number.parseFloat(asset.rate));

    // Parse numeric values for percentage change
    const currentPrice = Number.parseFloat(asset.rate);
    const changePercent = asset.change_percent ? Number.parseFloat(asset.change_percent) : 0;
    const isPositiveChange = changePercent >= 0;
    const formattedPercent = (isPositiveChange ? "+" : "") + changePercent.toFixed(2) + "%";

    // Determine text color for percent change
    const percentColor = isPositiveChange ? "text-green-500" : "text-red-500";

    // Check price changes and apply flash effect
    useEffect(() => {
        const prevPrice = previousPriceRef.current;

        // Only flash if we have a previous price to compare with
        if (prevPrice !== currentPrice) {
            // Set color based on price change
            if (currentPrice > prevPrice) {
                setPriceColor("text-green-500");
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
                    "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center py-2 px-2 hover:bg-slate-700/50 border-b border-slate-700 cursor-pointer gap-2",
                    isActive ? "bg-slate-700/50" : ""
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
                        {asset.rate}
                    </span>
                    <span className={cn(
                        "text-xs w-12 text-right truncate",
                        percentColor
                    )}>
                        {formattedPercent}
                    </span>
                    <button
                        className="text-slate-400  hover:text-slate-300 w-3 flex items-center justify-center"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                        className="text-slate-400 hover:text-slate-300 w-3 flex items-center justify-center cursor-pointer"
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

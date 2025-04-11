import { useState, useEffect, useRef, memo } from "react";
import { Plus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Asset } from "@/store/assetStore";

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

            // Store the new price for future comparison
            previousPriceRef.current = currentPrice;

            // Reset price color after the flash effect
            const timer = setTimeout(() => {
                setPriceColor("");
            }, 2200);

            return () => clearTimeout(timer);
        }
    }, [currentPrice]);

    return (
        <div
            className={cn(
                "flex items-center justify-between py-2 px-3 hover:bg-slate-700/50 border-b border-slate-700 cursor-pointer",
                isActive ? "bg-slate-700/50" : ""
            )}
            onClick={onClick}
        >
            <div className="flex items-center space-x-2">
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
                <span className="text-xs font-light">{asset.name}</span>
            </div>

            <div className="flex items-center">
                <span className={cn("text-xs font-medium mr-2 transition-colors duration-300", priceColor)}>
                    {asset.rate}
                </span>
                <span className={cn("text-xs w-14 text-right", percentColor)}>
                    {formattedPercent}
                </span>
                <button className="ml-2 text-slate-400 hover:text-slate-300">
                    <Plus className="h-3.5 w-3.5" />
                </button>
                <button className="ml-2 text-slate-400 hover:text-slate-300">
                    <Info className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
});

AssetItem.displayName = "AssetItem";

export default AssetItem;

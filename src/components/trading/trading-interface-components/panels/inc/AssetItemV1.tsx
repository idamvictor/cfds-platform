import { useState, useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";
import type { Asset } from "@/store/assetStore";

interface AssetItemProps {
    asset: Asset;
    isActive: boolean;
    onClick: () => void;
}

const AssetItem = memo(({ asset, isActive, onClick }: AssetItemProps) => {
    const [priceColor, setPriceColor] = useState<string>("");
    const [changeColor, setChangeColor] = useState<string>("");
    const previousPriceRef = useRef<number>(Number.parseFloat(asset.rate));

    const currentPrice = Number.parseFloat(asset.rate);
    const changeAmount = asset.change ? Number.parseFloat(asset.change) : 0;
    const changePercent = asset.change_percent ? Number.parseFloat(asset.change_percent) : 0;

    const isPositiveChange = changePercent >= 0;

    const formattedChangeAmount = (isPositiveChange ? "+" : "") + changeAmount.toFixed(2);
    const formattedChangePercent = (isPositiveChange ? "+" : "") + changePercent.toFixed(2) + "%";

    useEffect(() => {
        const prevPrice = previousPriceRef.current;

        // Only flash if we have a previous price to compare with
        if (prevPrice !== currentPrice) {
            // Set color based on price change
            if (currentPrice > prevPrice) {
                setPriceColor("text-green-500");
                setChangeColor("text-green-500");
            } else if (currentPrice < prevPrice) {
                setPriceColor("text-red-500");
                setChangeColor("text-red-500");
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

    // Default color for change is based on whether it's positive or negative
    useEffect(() => {
        setChangeColor(isPositiveChange ? "text-green-500" : "text-red-500");
    }, [isPositiveChange]);

    return (
        <div
            className={cn(
                "flex items-center justify-between p-2 hover:bg-muted/40 rounded-md cursor-pointer",
                isActive ? "bg-primary/10" : "bg-background"
            )}
            onClick={onClick}
        >
            {/* Left side - Currency information */}
            <div className="flex items-start">
                {/* Asset image with height matching both text lines */}
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 mr-2">
                    {asset.image ? (
                        <img
                            src={asset.image}
                            alt={asset.symbol}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white">
                            {asset.symbol.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Text content */}
                <div className="flex flex-col">
          <span className="font-bold text-base leading-tight">
            {asset.sy}
          </span>
                    <span className="text-xs text-muted-foreground">
            {asset.name}
          </span>
                </div>
            </div>

            {/* Right side - Price information */}
            <div className="flex flex-col items-end">
        <span className={cn("text-base font-medium transition-colors duration-300", priceColor)}>
          {asset.rate}
        </span>
                <div className={cn("text-xs", changeColor)}>
                    {formattedChangeAmount} {formattedChangePercent}
                </div>
            </div>
        </div>
    );
});

AssetItem.displayName = "AssetItem";

export default AssetItem;

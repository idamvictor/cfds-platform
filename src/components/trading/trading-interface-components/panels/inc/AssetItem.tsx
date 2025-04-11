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
    const previousPriceRef = useRef<number>(Number.parseFloat(asset.rate));

    // Parse numeric values
    const currentPrice = Number.parseFloat(asset.rate);
    const changePercent = asset.change_percent ? Number.parseFloat(asset.change_percent) : 0;
    const isPositiveChange = changePercent >= 0;

    // Format the price display
    const formattedPrice = currentPrice.toFixed(2);

    // Check price changes and apply flash effect
    useEffect(() => {
        const prevPrice = previousPriceRef.current;

        // Only flash if we have a previous price to compare with
        if (prevPrice !== currentPrice) {
            // Set color based on price change
            if (currentPrice > prevPrice) {
                setPriceColor("text-green-500"); // Green for price increase
            } else if (currentPrice < prevPrice) {
                setPriceColor("text-red-500"); // Red for price decrease
            }

            // Store the new price for future comparison
            previousPriceRef.current = currentPrice;

            // Reset color after a short delay (300ms flash effect)
            const timer = setTimeout(() => {
                setPriceColor("");
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [currentPrice]);

    return (
        <div
            className={cn(
                "flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer ml-2",
                isActive ? "bg-primary/10" : ""
            )}
            onClick={onClick}
        >
            <div className="flex items-center">
                <AssetIcon asset={asset} />
                <span className="ml-2 text-sm">
          {asset.sy}
        </span>
            </div>
            <div className="flex items-center">
        <span className={cn("text-sm mr-2 transition-colors duration-300", priceColor)}>
          {formattedPrice}
        </span>
                {asset.change_percent && (
                    <span
                        className={cn(
                            "text-xs",
                            isPositiveChange ? "text-green-500" : "text-red-500"
                        )}
                    >
            {isPositiveChange ? "+" : ""}
                        {changePercent}%
          </span>
                )}
            </div>
        </div>
    );
});

// Helper component for displaying asset icons
const AssetIcon = memo(({ asset }: { asset: Asset }) => {
    if (asset.image) {
        return (
            <div
                className="h-5 w-5 rounded-full flex items-center justify-center text-xs text-white"
                style={{
                    backgroundImage: `url(${asset.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {!asset.image.includes("http") && asset.symbol.charAt(0)}
            </div>
        );
    }

    // Fallback to colored circle with first letter
    let color = "bg-blue-500";

    if (asset.type === "forex") {
        const firstCurrency = asset.symbol;
        color =
            firstCurrency === "AUD"
                ? "bg-blue-500"
                : firstCurrency === "EUR"
                    ? "bg-yellow-500"
                    : firstCurrency === "USD"
                        ? "bg-green-500"
                        : firstCurrency === "GBP"
                            ? "bg-purple-500"
                            : firstCurrency === "CAD"
                                ? "bg-red-500"
                                : firstCurrency === "CHF"
                                    ? "bg-red-500"
                                    : "bg-purple-500";
    } else if (asset.type === "crypto") {
        color =
            asset.symbol === "BTC"
                ? "bg-orange-500"
                : asset.symbol === "ETH"
                    ? "bg-purple-500"
                    : asset.symbol === "XRP"
                        ? "bg-blue-500"
                        : asset.symbol === "SOL"
                            ? "bg-green-500"
                            : asset.symbol === "ADA"
                                ? "bg-blue-400"
                                : "bg-gray-500";
    } else if (asset.type === "stocks") {
        color = "bg-blue-600";
    }

    return (
        <div
            className={`h-5 w-5 rounded-full ${color} flex items-center justify-center text-xs text-white`}
        >
            {asset.symbol.charAt(0)}
        </div>
    );
});

// Add display names for debugging
AssetIcon.displayName = "AssetIcon";
AssetItem.displayName = "AssetItem";

export default AssetItem;

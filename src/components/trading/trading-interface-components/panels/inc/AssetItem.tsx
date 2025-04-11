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

  // Parse numeric values
  const currentPrice = Number.parseFloat(asset.rate);
  const changeAmount = asset.change ? Number.parseFloat(asset.change) : 0;
  const changePercent = asset.change_percent
    ? Number.parseFloat(asset.change_percent)
    : 0;

  const isPositiveChange = changePercent >= 0;

  const formattedChangeAmount =
    (isPositiveChange ? "+" : "") + changeAmount.toFixed(2);
  const formattedChangePercent =
    (isPositiveChange ? "+" : "") + changePercent.toFixed(2) + "%";

  // Check price changes and apply flash effect
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
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full flex items-center justify-center overflow-hidden">
            {asset.image ? (
              <img
                src={asset.image}
                alt={asset.symbol}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-blue-500 flex items-center justify-center text-muted-foreground text-xs">
                {asset.symbol.charAt(0)}
              </div>
            )}
          </div>
          <span className="ml-2 font-bold text-xs">{asset.sy}</span>
        </div>
        <div className="text-xs text-muted-foreground ml-8">{asset.name}</div>
      </div>

      {/* Right side - Price information */}
      <div className="flex flex-col items-end">
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-300",
            priceColor
          )}
        >
          {asset.rate}
        </span>
        <div className={cn("text-xs", changeColor)}>
          {formattedChangeAmount} {formattedChangePercent}
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
AssetItem.displayName = "AssetItem";

export default AssetItem;

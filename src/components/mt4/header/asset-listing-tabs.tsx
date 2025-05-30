import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { CurrencyFlag } from "../../trading/trading-interface-components/header";
import useAssetStore from "@/store/assetStore";
import useUserStore from "@/store/userStore";

interface AssetListingTabsProps {
  initialPairs?: string[];
  onPairChange?: (pair: string) => void;
  isMobile?: boolean;
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function AssetListingTabs({
  initialPairs = ["AUD/JPY"],
  onPairChange,
  isMobile = false,
}: AssetListingTabsProps) {
  const [activePairs, setActivePairs] = useState<string[]>(initialPairs);
  const [activePair, setActivePair] = useState<string>(initialPairs[0]);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isMarketWatchOpen, setIsMarketWatchOpen] = useState(false);

  const tabsListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  const { setActiveAsset, assets } = useAssetStore();

  // Check if scroll buttons should be shown
  useEffect(() => {
    const checkScrollable = () => {
      if (tabsListRef.current) {
        const { scrollWidth, clientWidth } = tabsListRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, [activePairs]);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeTabRef.current && tabsListRef.current) {
      const tabElement = activeTabRef.current;
      const container = tabsListRef.current;

      // Calculate position to scroll to
      const tabLeft = tabElement.offsetLeft;
      const tabRight = tabLeft + tabElement.offsetWidth;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.offsetWidth;

      // If tab is not fully visible, scroll to make it visible
      if (tabLeft < containerLeft) {
        container.scrollTo({ left: tabLeft - 10, behavior: "smooth" });
      } else if (tabRight > containerRight) {
        container.scrollTo({
          left: tabRight - container.offsetWidth + 10,
          behavior: "smooth",
        });
      }
    }
  }, [activePair]);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsListRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsListRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePairClick = (pair: string) => {
    setActivePair(pair);

    // Find and set the corresponding asset
    const asset = assets.find((a) => a.symbol_display === pair);
    if (asset) {
      setActiveAsset(asset);
    }

    // Notify parent component if callback is provided
    if (onPairChange) {
      onPairChange(pair);
    }
  };

  const removeCurrencyPair = (pair: string) => {
    if (activePairs.length > 1) {
      const newPairs = activePairs.filter((p) => p !== pair);
      setActivePairs(newPairs);

      // If the removed pair was active, set the first pair as active
      if (activePair === pair) {
        setActivePair(newPairs[0]);

        // Also update the active asset and notify parent
        const newAsset = assets.find((a) => a.symbol_display === newPairs[0]);
        if (newAsset) {
          setActiveAsset(newAsset);
          if (onPairChange) {
            onPairChange(newPairs[0]);
          }
        }
      }
    }
  };

  const addCurrencyPair = (pair: string) => {
    if (!activePairs.includes(pair)) {
      setActivePairs([...activePairs, pair]);
    }
    setActivePair(pair);

    // Find and set the corresponding asset
    const asset = assets.find((a) => a.symbol_display === pair);
    if (asset) {
      setActiveAsset(asset);
      if (onPairChange) {
        onPairChange(pair);
      }
    }
  };

  return (
    <div className={`flex items-center ${isMobile ? "w-full" : "h-full"}`}>
      {!isMobile && showScrollButtons && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => scrollTabs("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <div
        className={`overflow-hidden ${
          isMobile
            ? "w-full"
            : "max-w-[300px] sm:max-w-[400px] md:max-w-[500px]"
        } h-full flex items-center`}
      >
        <div className="w-full h-full flex items-center">
          <div
            ref={tabsListRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap h-[70%]"
            style={{ scrollbarWidth: "none" }}
          >
            {activePairs.map((pair, index) => (
              <div
                key={index}
                ref={activePair === pair ? activeTabRef : null}
                className={`relative flex items-center gap-3 px-4 py-2 cursor-pointer border-[1px] border-muted ${
                  activePair === pair
                    ? "border-b-2 border-b-accent "
                    : "hover:bg-muted"
                }`}
                onClick={() => handlePairClick(pair)}
              >
                <CurrencyFlag pair={pair} />
                <div className="flex flex-col items-start">
                  <span className="text-xs">{pair}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    forex
                  </span>
                </div>
                <button
                  className="absolute top-0 left-[-7px] ml-1 sm:ml-2 rounded-full hover:bg-muted p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCurrencyPair(pair);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isMobile && showScrollButtons && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => scrollTabs("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        className="rounded-md ml-2"
        onClick={() => setIsMarketWatchOpen(true)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

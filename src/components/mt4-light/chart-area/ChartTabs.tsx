import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useAssetStore from "@/store/assetStore";
import useDarkModeStore from "@/store/darkModeStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChartTabs() {
  const {
    activePairs,
    activePair,
    setActivePair,
    removePair,
    assets,
    setActiveAsset,
  } = useAssetStore();

  const handlePairClick = (pair: string) => {
    setActivePair(pair);
    const asset = assets.find((a) => a.symbol_display === pair);
    if (asset) {
      setActiveAsset(asset);
    }
  };

  const handleRemovePair = (pair: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removePair(pair);
    if (activePair === pair && activePairs.length > 1) {
      const nextPair = activePairs[0];
      handlePairClick(nextPair);
    }
  };
  const tabsListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);

  const checkScroll = useCallback(() => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, activePairs]);

  const scroll = (direction: "left" | "right") => {
    if (tabsListRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        tabsListRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      tabsListRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (activeTabRef.current && tabsListRef.current) {
      const tabElement = activeTabRef.current;
      const container = tabsListRef.current;
      const tabLeft = tabElement.offsetLeft;
      const tabRight = tabLeft + tabElement.offsetWidth;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.offsetWidth;

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

  return (
    <div
      className={`flex items-center ${
        isDarkMode ? "bg-[#1C2030]" : "bg-[#EDF0F4]"
      }`}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${
                isDarkMode ? "hover:bg-[#2A3447]" : "hover:bg-white/50"
              }`}
            >
              <MoreHorizontal
                className={`h-4 w-4 ${
                  isDarkMode ? "text-slate-200" : "text-gray-500"
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`${
              isDarkMode
                ? "bg-[#1B2331] border-[#2A3447]"
                : "bg-white border-slate-200"
            }`}
          >
            {activePairs.map((pair) => {
              const isActive = pair === activePair;
              return (
                <DropdownMenuItem
                  key={pair}
                  onClick={() => handlePairClick(pair)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    isDarkMode
                      ? isActive
                        ? "bg-[#2A3447] text-white"
                        : "text-slate-200"
                      : isActive
                      ? "bg-white text-slate-900"
                      : "text-gray-500"
                  }`}
                >
                  <span className="text-xs font-bold">{pair}, M5</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </div>
      </DropdownMenu>

      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 shrink-0 ${
            isDarkMode ? "hover:bg-[#2A3447]" : "hover:bg-white/50"
          }`}
          onClick={() => scroll("left")}
        >
          <ChevronLeft
            className={`h-4 w-4 ${
              isDarkMode ? "text-slate-200" : "text-gray-500"
            }`}
          />
        </Button>
      )}

      <div
        ref={tabsListRef}
        className={`flex overflow-x-hidden scroll-smooth flex-1 [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:overflow-x-auto ${
          isDarkMode ? "bg-[#1C2030]" : "bg-[#EDF0F4]"
        }`}
        onScroll={checkScroll}
      >
        {activePairs.map((pair) => {
          const isActive = pair === activePair;
          return (
            <div
              key={pair}
              ref={isActive ? activeTabRef : null}
              className="relative"
            >
              <button
                className={`rounded-none border-t-2 border-transparent px-4 py-2 whitespace-nowrap text-xs font-bold ${
                  isDarkMode
                    ? isActive
                      ? "bg-[#2A3447] text-slate-200 border-primary"
                      : "text-slate-400"
                    : isActive
                    ? "bg-white text-slate-900 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => handlePairClick(pair)}
              >
                {pair}, M5
                <button
                  className={`ml-2 ${
                    isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={(e) => handleRemovePair(pair, e)}
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            </div>
          );
        })}
      </div>

      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 shrink-0 ${
            isDarkMode ? "hover:bg-[#2A3447]" : "hover:bg-white/50"
          }`}
          onClick={() => scroll("right")}
        >
          <ChevronRight
            className={`h-4 w-4 ${
              isDarkMode ? "text-slate-200" : "text-gray-500"
            }`}
          />
        </Button>
      )}
    </div>
  );
}

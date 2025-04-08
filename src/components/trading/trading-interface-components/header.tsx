import type React from "react";

import { useRef, useState, useEffect } from "react";
import {
  Plus,
  Wallet,
  BotIcon as Robot,
  ChevronDown,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import useUserStore from "@/store/userStore";
import useAssetStore from "@/store/assetStore";

interface HeaderProps {
  activePairs: string[];
  activePair: string;
  setActivePair: (pair: string) => void;
  removeCurrencyPair: (pair: string) => void;
}

export default function Header({
  activePairs,
  activePair,
  setActivePair,
  removeCurrencyPair,
}: HeaderProps) {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const isMobile = useMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { activeAsset, setActiveAsset } = useAssetStore();

  console.log("Header - Active pairs:", setActiveAsset);

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

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsListRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsListRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // const handleAssetClick = (asset) => {
  //   setActiveAsset(asset);
  //   // Other existing code
  // };

  return (
    <header className="flex items-center justify-between h-16 px-2 sm:px-4 border-b border-border bg-background">
      <div className="flex items-center">
        <div className="mr-2 sm:mr-6">
          <Logo />
        </div>

        {/* Mobile menu */}
        {isMobile && (
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <div className="py-4">
                  <h2 className="text-lg font-bold mb-4">Menu</h2>

                  {/* Account info in mobile menu */}
                  <div className="bg-muted/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          STANDARD ACCOUNT
                        </div>
                        <div className="text-green-500 font-bold">$610.05</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Profile
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Settings
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Robot className="h-4 w-4" />
                      <span>Auto Trader</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Deposit</span>
                    </Button>
                    <div className="pt-4 border-t border-border mt-4">
                      <h3 className="text-sm font-medium mb-2">
                        Currency Pairs
                      </h3>
                      <div className="space-y-2">
                        {activePairs.map((pair) => (
                          <div
                            key={pair}
                            className={`flex items-center justify-between p-2 rounded-md ${
                              activePair === pair
                                ? "bg-primary/10"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => setActivePair(pair)}
                          >
                            <div className="flex items-center gap-2">
                              <CurrencyFlag pair={pair} />
                              <span>{pair}</span>
                            </div>
                            {activePairs.length > 1 && (
                              <button
                                className="rounded-full hover:bg-muted p-0.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCurrencyPair(pair);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Pair
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile active pair display */}
            <div
              className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <CurrencyFlag pair={activeAsset?.symbol_display || activePair} />
              <span className="text-sm font-medium">
                {activeAsset?.symbol_display || activePair}
              </span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>
        )}

        {/* Desktop currency tabs */}
        {!isMobile && (
          <div className="flex items-center">
            {showScrollButtons && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => scrollTabs("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="overflow-hidden max-w-[300px] sm:max-w-[400px] md:max-w-[400px]">
              <div className="w-full">
                <div
                  ref={tabsListRef}
                  className="flex overflow-x-auto scrollbar-hide whitespace-nowrap"
                  style={{ scrollbarWidth: "none" }}
                >
                  {activePairs.map((pair) => (
                    <div
                      key={pair}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                        activePair === pair
                          ? "bg-primary/10"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setActivePair(pair)}
                    >
                      <CurrencyFlag pair={pair} />
                      <span>{pair}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        forex
                      </span>
                      <button
                        className="ml-1 sm:ml-2 rounded-full hover:bg-muted p-0.5"
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
            {showScrollButtons && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => scrollTabs("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" className="rounded-md ml-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile search dropdown */}
      {isMobile && isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-3 z-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-muted/50 border border-border rounded-md py-2 pl-10 pr-3"
              placeholder="Search currency pairs..."
            />
          </div>
          <div className="mt-2 max-h-[300px] overflow-y-auto">
            {activePairs.map((pair) => (
              <div
                key={pair}
                className={`flex items-center justify-between p-2 rounded-md ${
                  activePair === pair ? "bg-primary/10" : "hover:bg-muted/50"
                }`}
                onClick={() => {
                  setActivePair(pair);
                  setIsSearchOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <CurrencyFlag pair={pair} />
                  <span>{pair}</span>
                </div>
                {activePairs.length > 1 && (
                  <button
                    className="rounded-full hover:bg-muted p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCurrencyPair(pair);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right side - account info */}
      <div className="flex items-center gap-1 sm:gap-2">
        {!isMobile && (
          <>
            <Button
              variant="outline"
              className="gap-2 text-green-500 border-green-500/20 hover:bg-green-500/10 hidden md:flex"
            >
              <Robot className="h-4 w-4" />
              <span>Auto Trader</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-green-500 border-green-500/20 hover:bg-green-500/10 hidden sm:flex"
            >
              <Wallet className="h-4 w-4" />
              <span>Deposit</span>
            </Button>
          </>
        )}
        <div className="flex items-center ml-1 sm:ml-4">
          <div className="mr-2 hidden sm:block">
            <div className="text-xs text-muted-foreground">
              STANDARD ACCOUNT
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="h-auto p-0 text-green-500 font-bold"
                >
                  $610.05 <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account Details</DropdownMenuItem>
                <DropdownMenuItem>Transaction History</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-0 h-8 w-8"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm font-medium sm:hidden">
                <div className="text-xs text-muted-foreground">
                  STANDARD ACCOUNT
                </div>
                <div className="text-green-500 font-bold">$610.05</div>
              </div>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Account Details</DropdownMenuItem>
              <DropdownMenuItem>Transaction History</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  useUserStore.getState().clearUser();
                  window.location.href = "/login";
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center">
      <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center mr-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-background"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      </div>
      <span className="text-xl font-bold">Capital</span>
    </div>
  );
}

function CurrencyFlag({ pair }: { pair: string }) {
  // This would be replaced with actual flag images in a real implementation
  const firstCurrency = pair.split("/")[0];
  const color =
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
      : "bg-purple-500";

  return (
    <div
      className={`h-5 w-5 rounded-full ${color} flex items-center justify-center text-xs text-white`}
    >
      {firstCurrency.charAt(0)}
    </div>
  );
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


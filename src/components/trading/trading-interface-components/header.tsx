import type React from "react";

import { useRef, useState, useEffect } from "react";
import {
  Plus,
  Wallet,
  ChevronDown,
  Menu,
  X,
  Search,
  LineChart,
  Clock,
  BarChart3,
  Calendar,
  Newspaper,
  LogOut,
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
import { Link } from "react-router-dom";
import AutoTraderModal from "./auto-trader-modal";

// Define the ActiveView type
type ActiveView =
  | "market-watch"
  | "active-orders"
  | "trading-history"
  | "calendar"
  | "market-news"
  | null;

interface HeaderProps {
  activePairs: string[];
  activePair: string;
  setActivePair: (pair: string) => void;
  removeCurrencyPair: (pair: string) => void;
  toggleView: (view: ActiveView) => void;
}

export default function Header({
  activePairs,
  activePair,
  setActivePair,
  removeCurrencyPair,
  toggleView,
}: HeaderProps) {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const isMobile = useMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { activeAsset, setActiveAsset, assets } = useAssetStore();

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
        // Tab is to the left of the visible area
        container.scrollTo({ left: tabLeft - 10, behavior: "smooth" });
      } else if (tabRight > containerRight) {
        // Tab is to the right of the visible area
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
  };

  return (
    <>
      <header className=" flex items-center justify-between h-20 px-6 border-b border-secondary border-2 bg-background">
        {/* left side */}
        <div className="flex items-center gap-6 h-full">
          <Logo />

          {/* Mobile menu */}
          {isMobile && (
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[280px] sm:w-[350px] p-0"
                >
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border">
                      <h2 className="text-lg font-bold">Menu</h2>
                    </div>

                    {/* Account info in mobile menu */}
                    <div className="bg-muted/30 rounded-lg p-3 mx-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            STANDARD ACCOUNT
                          </div>
                          <div className="text-green-500 font-bold">
                            $610.05
                          </div>
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

                    {/* Side panels in mobile menu */}
                    <div className="overflow-y-auto flex-1">
                      <div className="px-3 py-2">
                        <h3 className="text-sm font-medium mb-2">Panels</h3>
                        <div className="space-y-1">
                          <SheetTrigger className="w-full">
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2 text-sm hover:bg-slapte-700"
                              onClick={() => toggleView("market-watch")}
                            >
                              <LineChart className="h-4 w-4" />
                              <span>Market Watch</span>
                            </Button>
                          </SheetTrigger>
                          <SheetTrigger className="w-full">
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2 text-sm hover:bg-slapte-700"
                              onClick={() => toggleView("active-orders")}
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span>Active Orders</span>
                            </Button>
                          </SheetTrigger>
                          <SheetTrigger className="w-full">
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2 text-sm hover:bg-slapte-700"
                              onClick={() => toggleView("trading-history")}
                            >
                              <Clock className="h-4 w-4" />
                              <span>Trading History</span>
                            </Button>
                          </SheetTrigger>
                          <SheetTrigger className="w-full">
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2 text-sm hover:bg-slapte-700"
                              onClick={() => toggleView("calendar")}
                            >
                              <Calendar className="h-4 w-4" />
                              <span>Calendar</span>
                            </Button>
                          </SheetTrigger>
                          <SheetTrigger className="w-full">
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2 text-sm hover:bg-slapte-700"
                              onClick={() => toggleView("market-news")}
                            >
                              <Newspaper className="h-4 w-4" />
                              <span>Market News</span>
                            </Button>
                          </SheetTrigger>
                        </div>
                      </div>

                      <div className="border-t border-border mt-2 px-3 py-2">
                        <div className="space-y-2">
                          <AutoTraderModal />
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                          >
                            <Wallet className="h-4 w-4" />
                            <span>Deposit</span>
                          </Button>
                        </div>
                      </div>

                      <div className="border-t border-border mt-2 px-3 py-2">
                        <h3 className="text-sm font-medium mb-2">
                          Currency Pairs
                        </h3>
                        <div className="space-y-2">
                          {activePairs.map((pair, index) => (
                            <>
                              <div
                                key={index}
                                className={`flex items-center justify-between p-2 rounded-md ${
                                  activePair === pair
                                    ? "bg-primary/10"
                                    : "hover:bg-muted/50"
                                }`}
                                onClick={() => handlePairClick(pair)}
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
                            </>
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

                    {/* Logout button */}
                    <div className="border-t border-border p-3">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500"
                        onClick={() => {
                          useUserStore.getState().clearUser();
                          window.location.href = "/login";
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </Button>
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
                {/* <CurrencyFlag pair={activeAsset?.symbol_display || activePair} /> */}
                <span className="text-sm font-medium">
                  {activeAsset?.symbol_display || activePair}
                </span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </div>
          )}

          {/* assets listing tabs new */}
          {!isMobile && (
            <div className="flex items-center h-full">
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
              <div className="overflow-hidden max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-full flex items-center">
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

        {/* right side */}
        <div className="flex items-center gap-6">
          {!isMobile && (
            <>
              <AutoTraderModal />

              <Link to="/main/deposit">
                <Button
                  variant="outline"
                  className="flex-1 h-full gap-3 text-primary border-trading-accent hover:bg-trading-green/10"
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-base md:hidden">Deposit</span>
                </Button>
              </Link>

              <div className="flex flex-col items-center gap-1">
                <div className="text-xs font-bold text-primary">
                  STANDARD ACCOUNT
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary font-bold text-base"
                    >
                      $709.75 <ChevronDown className="h-5 w-5 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="p-5 text-base text-muted-foreground space-y-3"
                  >
                    <div className="font-bold text-sm">
                      REAL ACCOUNT #1651738
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Balance</span>
                        <span>$709.75</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Invested</span>
                        <span>$0.02</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit</span>
                        <span className="text-trading-green">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equity</span>
                        <span>$709.75</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margin</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margin Level</span>
                        <span>36509964.87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Free Margin</span>
                        <span>$709.75</span>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dyp8gtllq/image/upload/v1744370355/main_plate_exi8jv.png"
              alt="Badge"
              className="w-8 h-8"
            />
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
                <Link to="/main/dashboard">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link to="/main/accounts">
                  <DropdownMenuItem>Account Details</DropdownMenuItem>
                </Link>
                <Link to="/main/withdrawal">
                  <DropdownMenuItem>Transaction History</DropdownMenuItem>
                </Link>
                <Link to="/main/settings">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
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
    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center">
      <div className="h-8 w-8 bg-accent rounded-md flex items-center justify-center mr-1">
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

function CurrencyFlag({ pair }: { pair?: string }) {
  // Handle undefined or invalid pair format
  if (!pair || !pair.includes("/")) {
    return (
      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
        {pair ? pair.charAt(0) : "?"}
      </div>
    );
  }

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

import type React from "react";

import { useRef, useState, useEffect } from "react";
import {
  Plus,
  Wallet,
  ChevronDown,
  Menu,
  X,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import useUserStore from "@/store/userStore";
import useAssetStore from "@/store/assetStore";
import { Link } from "react-router-dom";
import AutoTraderModal from "./auto-trader-modal";
import Logo from "@/components/Logo";
import useTradeStore from "@/store/tradeStore";
import { useCurrency } from "@/hooks/useCurrency";
import AccountPlansModal from "@/components/AccountPlanModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MarketWatchPanel from "./panels/market-watch-panel";

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

interface AssetListingTabsProps {
  activePairs: string[];
  activePair: string;
  handlePairClick: (pair: string) => void;
  getAssetCategory: (pair: string) => string;
  removeCurrencyPair: (pair: string) => void;
  isMobile: boolean;
  showScrollButtons?: boolean;
  scrollTabs?: (direction: "left" | "right") => void;
  tabsListRef: React.RefObject<HTMLDivElement | null>;
  activeTabRef: React.RefObject<HTMLDivElement | null>;
  setIsMarketWatchOpen: (value: boolean) => void;
}

function AssetListingTabs({
  activePairs,
  activePair,
  handlePairClick,
  removeCurrencyPair,
  isMobile,
  showScrollButtons,
  scrollTabs,
  tabsListRef,
  activeTabRef,
  setIsMarketWatchOpen,getAssetCategory
}: AssetListingTabsProps) {
  return (
    <div className={`flex items-center ${isMobile ? "w-full" : "h-full"}`}>
      {!isMobile && showScrollButtons && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => scrollTabs?.("left")}
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
                    { getAssetCategory(pair) }
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
          onClick={() => scrollTabs?.("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      {
        <Button
          variant="outline"
          size="icon"
          className="rounded-md ml-2"
          onClick={() => setIsMarketWatchOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      }
    </div>
  );
}

export default function Header({
  activePairs,
  activePair,
  setActivePair,
  removeCurrencyPair,
  toggleView,
}: HeaderProps) {
  const { formatCurrency } = useCurrency();
  const tabsListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const isMobile = useMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMarketWatchOpen, setIsMarketWatchOpen] = useState(false);
  const { activeAsset, setActiveAsset, assets } = useAssetStore();
  const user = useUserStore((state) => state.user);
  const selectedAccountIndex = useUserStore(
    (state) => state.selectedAccountIndex
  );
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  // const setSelectedAccountIndex = useUserStore(
  //   (state) => state.setSelectedAccountIndex
  // );
  const accountSummary = useTradeStore((state) => state.accountSummary);

  const selectedAccount = user?.accounts[selectedAccountIndex];

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

  const getAssetCategory = (pair: string) => {
    // Find and set the corresponding asset
    const asset = assets.find((a) => a.symbol_display === pair);
    if (asset) {
      return asset.type
    }
    return 'forex'
  };



  const headerStyle = {
    backgroundColor: user?.account_type?.color || "gray",
  };

  return (
    <>
      <header className=" flex items-center justify-between h-12 md:h-20 px-6 border-b border-secondary border-2 bg-background">
        {/* left side */}
        <div className="flex items-center gap-6 h-full">
          <Logo />

          {/* Mobile menu */}
          {isMobile && (
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" className="mr-2 w-6 h-6">
                    <Menu className="h-6 w-6" />
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Avatar className="h-8 w-8 border border-border cursor-pointer">
                              <AvatarImage src={user?.avatar} alt="avatar" />
                              <AvatarFallback>
                                {user
                                  ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
                                  : ""}
                              </AvatarFallback>
                            </Avatar>
                          </DialogTrigger>
                          <DialogContent className="w-full h-full flex items-center justify-center">
                            <img
                              src={user?.avatar}
                              className="w-full h-full object-cover p-4"
                              alt="Profile"
                            />
                          </DialogContent>
                        </Dialog>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {user?.account_type?.title || "STANDARD"}
                          </div>
                          <div className="text-green-500 font-bold">
                            {formatCurrency(user?.balance || 0)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {user?.accounts.map((account, index) => (
                          <div
                            key={index}
                            className={`flex justify-between items-center p-2 rounded text-xs gap-1 ${
                              selectedAccountIndex === index ? "" : ""
                            }`}
                            // onClick={() => setSelectedAccountIndex(index)}
                          >
                            <span>{account.title}</span>
                            <span>{formatCurrency(account.balance)}</span>
                          </div>
                        ))}
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
                          <Link to="/main/deposit">
                            <Button className="w-full justify-start gap-2">
                              <Wallet className="h-4 w-4" />
                              <span>Deposit</span>
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Plan Type */}
                      <div className="flex mt-2 px-3 py-2 w-full">
                        {user?.account_type ? (
                          <Button
                            style={headerStyle}
                            onClick={() => setIsPlansModalOpen(true)}
                            className="text-white cursor-pointer font-medium rounded-md shadow-md transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-1">
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm">
                                <img
                                  src={user?.account_type?.icon}
                                  alt={`${user?.account_type?.title} icon`}
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-white font-bold">
                                  {user?.account_type?.title}
                                </span>
                              </div>
                            </div>
                          </Button>
                        ) : null}

                        <AccountPlansModal
                          open={isPlansModalOpen}
                          onOpenChange={setIsPlansModalOpen}
                        />
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
                            onClick={() => setIsMarketWatchOpen(true)}
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
                          window.location.href = "/";
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
              {/* <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  console.log("isSearch open:", isSearchOpen);
                }}
              >
                <Search className="h-5 w-5" />
              </Button> */}{" "}
              {/* Mobile active pair display */}
              <div
                className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <span className="text-sm font-medium">
                  {activeAsset?.symbol_display || activePair}
                </span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </div>
          )}

          {/* {isMobile && (
            <div className="w-full border-t border-secondary mt-2">
              <AssetListingTabs
                activePairs={activePairs}
                activePair={activePair}
                handlePairClick={handlePairClick}
                removeCurrencyPair={removeCurrencyPair}
                isMobile={true}
                tabsListRef={tabsListRef}
                activeTabRef={activeTabRef}
                setIsMarketWatchOpen={setIsMarketWatchOpen}
              />
            </div>
          )} */}

          {/* Desktop asset listing tabs */}
          {!isMobile && (
            <AssetListingTabs
              activePairs={activePairs}
              activePair={activePair}
              handlePairClick={handlePairClick}
              removeCurrencyPair={removeCurrencyPair}
              isMobile={false}
              showScrollButtons={showScrollButtons}
              scrollTabs={scrollTabs}
              tabsListRef={tabsListRef}
              activeTabRef={activeTabRef}
              getAssetCategory={getAssetCategory}
              setIsMarketWatchOpen={setIsMarketWatchOpen}
            />
          )}
        </div>{" "}
        {/* Market Watch Modal */}
        <Dialog open={isMarketWatchOpen} onOpenChange={setIsMarketWatchOpen}>
          <DialogContent className="sm:max-w-[425px] h-[90vh] p-0 gap-0">
            <div className="overflow-y-auto h-full">
              <MarketWatchPanel
                addCurrencyPair={(pair) => {
                  handlePairClick(pair);
                  setIsMarketWatchOpen(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
        {/* Mobile search dropdown */}
        {isMobile && isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-3 z-50">
            {/* <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                className="w-full bg-muted/50 border border-border rounded-md py-2 pl-10 pr-3"
                placeholder="Search currency pairs..."
              />
            </div> */}
            <div className="mt-2 max-h-[300px] overflow-y-auto">
              {activePairs.map((pair) => (
                <div
                  key={pair}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    activePair === pair ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    handlePairClick(pair);
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
                  <span className="text-base hidden lg:flex">Deposit</span>
                </Button>
              </Link>

              <div className="flex flex-col items-center gap-1">
                <div className="text-xs font-bold text-primary">
                  {user?.account_type?.title || "STANDARD"}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary font-bold text-base"
                    >
                      {formatCurrency(user?.balance || 0)}{" "}
                      <ChevronDown className="h-5 w-5 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="p-5 text-base text-muted-foreground"
                  >
                    <div className="space-y-4">
                      {/* Account selection */}
                      <div className="space-y-2">
                        <div className="font-bold text-sm">Select Account</div>
                        <div className="space-y-1">
                          {user?.accounts.map((account, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center p-2 rounded hover:bg-slate-500 hover:text-muted ${
                                selectedAccountIndex === index ? "" : ""
                              }`}
                              // onClick={() => setSelectedAccountIndex(index)}
                            >
                              <span className="text-xs">{account.title}</span>
                              <span className="text-xs">
                                {formatCurrency(account.balance)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Selected account details */}
                      <div className="space-y-2 text-xs pt-4 border-t">
                        <div className="font-bold text-sm mb-3">
                          {selectedAccount?.title || "ACCOUNT"} #
                          {user?.account_id}
                        </div>
                        <div className="flex justify-between">
                          <span>Balance</span>
                          <span>{formatCurrency(user?.balance || 0)}</span>
                        </div>
                        {/*<div className="flex justify-between">*/}
                        {/*  <span>Credit</span>*/}
                        {/*  <span>{formatCurrency(accountSummary.credit)}</span>*/}
                        {/*</div>*/}
                        {/*<div className="flex justify-between">*/}
                        {/*  <span>Invested</span>*/}
                        {/*  <span>*/}
                        {/*    {formatCurrency(user?.savings_balance || 0)}*/}
                        {/*  </span>*/}
                        {/*</div>*/}
                        <div className="flex justify-between">
                          <span>Profit</span>
                          <span
                            className={`${
                              accountSummary.pnl >= 0
                                ? "text-trading-green"
                                : "text-red-500"
                            }`}
                          >
                            {formatCurrency(accountSummary.pnl)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equity</span>
                          <span>{formatCurrency(accountSummary.equity)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margin</span>
                          <span>{formatCurrency(accountSummary.margin)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margin Level</span>
                          <span>{accountSummary.marginLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Free Margin</span>
                          <span>
                            {formatCurrency(accountSummary.freeMargin)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <img
              src={
                user?.account_type?.image ||
                "https://res.cloudinary.com/dyp8gtllq/image/upload/v1744370355/main_plate_exi8jv.png"
              }
              alt={`${user?.account_type?.title || "Basic"} Badge`}
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full p-0 h-10 w-10"
                >
                  <Avatar className="w-8 h-8 md:w-10 md:h-10">
                    <AvatarImage src={user?.avatar} alt="avatar" />
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
                <Link to="/main/settings">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    useUserStore.getState().clearUser();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {/* Mobile asset listing tabs */}
      {isMobile && (
        <div className="w-full">
          <AssetListingTabs
            activePairs={activePairs}
            activePair={activePair}
            handlePairClick={handlePairClick}
            removeCurrencyPair={removeCurrencyPair}
            isMobile={true}
            tabsListRef={tabsListRef}
            activeTabRef={activeTabRef}
            getAssetCategory={getAssetCategory}
            setIsMarketWatchOpen={setIsMarketWatchOpen}
          />
        </div>
      )}
    </>
  );
}

export function CurrencyFlag({ pair }: { pair?: string }) {
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

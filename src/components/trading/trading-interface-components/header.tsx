import { useState, useEffect } from "react";
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
import { clearAuthenticatedSession } from "@/lib/session";
import useSiteSettingsStore from "@/store/siteSettingStore";
import TradingStrengthIndicator from "../TradingStrengthIndicator";

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
  onTradingStrengthClick?: () => void;
}

export default function Header({
  activePairs,
  activePair,
  setActivePair,
  removeCurrencyPair,
  toggleView,
  onTradingStrengthClick,
}: HeaderProps) {
  const { formatCurrency } = useCurrency();
  const isMobile = useMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMarketWatchOpen, setIsMarketWatchOpen] = useState(false);
  const { activeAsset, setActiveAsset, assets } = useAssetStore();
  const user = useUserStore((state) => state.user);
  const enablePlan = useSiteSettingsStore(
    (state) => state.settings?.enable_plan === true
  );
  const selectedAccountIndex = useUserStore(
    (state) => state.selectedAccountIndex
  );
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  const accountSummary = useTradeStore((state) => state.accountSummary);
  const selectedAccount = user?.accounts[selectedAccountIndex];

  // Live clock state
  const [clockTime, setClockTime] = useState("");
  useEffect(() => {
    const update = () => {
      const n = new Date();
      setClockTime(
        String(n.getHours()).padStart(2, "0") +
          ":" +
          String(n.getMinutes()).padStart(2, "0") +
          ":" +
          String(n.getSeconds()).padStart(2, "0")
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const findAssetByPair = (pair: string) =>
    assets.find((a) => a.sy === pair || a.symbol_display === pair);

  const handlePairClick = (pair: string) => {
    setActivePair(pair);
    const asset = findAssetByPair(pair);
    if (asset) {
      setActiveAsset(asset);
    }
  };

  const getAssetCategory = (pair: string) => {
    const asset = findAssetByPair(pair);
    if (asset) {
      return asset.type;
    }
    return "forex";
  };

  const headerStyle = {
    backgroundColor: user?.account_type?.color || "gray",
  };

  // Determine live price and direction
  const livePrice = activeAsset ? Number(activeAsset.rate || 0) : 0;
  const changePercent = activeAsset
    ? Number(activeAsset.change_percent || activeAsset.change || 0)
    : 0;
  const isUp = changePercent >= 0;

  return (
    <>
      {/* ─── TOP BAR ─── */}
      <header className="flex items-center h-11 px-3 gap-2 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm shrink-0">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <Logo />
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-[rgba(255,255,255,0.06)] hidden sm:block" />

        {/* Mobile menu */}
        {isMobile && (
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] sm:w-[350px] p-0"
                style={{
                  background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)",
                  color: "#eef2f7",
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
                    <h2 className="text-lg font-bold">Menu</h2>
                  </div>

                  {/* Account info in mobile menu */}
                  <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg p-3 mx-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Avatar className="h-8 w-8 border border-[rgba(255,255,255,0.08)] cursor-pointer">
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
                        <div className="text-xs text-[#8b97a8]">
                          {user?.account_type?.title || "STANDARD"}
                        </div>
                        <div className="text-[#00dfa2] font-bold">
                          {formatCurrency(user?.balance || 0)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {user?.accounts.map((account, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 rounded text-xs gap-1"
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
                            className="w-full justify-start gap-2 text-sm"
                            onClick={() => toggleView("market-watch")}
                          >
                            <LineChart className="h-4 w-4" />
                            <span>Market Watch</span>
                          </Button>
                        </SheetTrigger>
                        <SheetTrigger className="w-full">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 text-sm"
                            onClick={() => toggleView("active-orders")}
                          >
                            <BarChart3 className="h-4 w-4" />
                            <span>Active Orders</span>
                          </Button>
                        </SheetTrigger>
                        <SheetTrigger className="w-full">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 text-sm"
                            onClick={() => toggleView("trading-history")}
                          >
                            <Clock className="h-4 w-4" />
                            <span>Trading History</span>
                          </Button>
                        </SheetTrigger>
                        <SheetTrigger className="w-full">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 text-sm"
                            onClick={() => toggleView("calendar")}
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Calendar</span>
                          </Button>
                        </SheetTrigger>
                        <SheetTrigger className="w-full">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 text-sm"
                            onClick={() => toggleView("market-news")}
                          >
                            <Newspaper className="h-4 w-4" />
                            <span>Market News</span>
                          </Button>
                        </SheetTrigger>
                      </div>
                    </div>

                    <div className="border-t border-[rgba(255,255,255,0.06)] mt-2 px-3 py-2">
                      <div className="space-y-2">
                        <AutoTraderModal />
                        <Link to="/main/wallet">
                          <Button className="w-full justify-start gap-2">
                            <Wallet className="h-4 w-4" />
                            <span>Wallet</span>
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Plan Type */}
                    {enablePlan && (
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
                    )}

                    <div className="border-t border-[rgba(255,255,255,0.06)] mt-2 px-3 py-2">
                      <h3 className="text-sm font-medium mb-2">
                        Currency Pairs
                      </h3>
                      <div className="space-y-2">
                        {activePairs.map((pair, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded-md ${
                              activePair === pair
                                ? "bg-[rgba(0,223,162,0.1)]"
                                : "hover:bg-[rgba(255,255,255,0.06)]"
                            }`}
                            onClick={() => handlePairClick(pair)}
                          >
                            <div className="flex items-center gap-2">
                              <CurrencyFlag pair={pair} />
                              <span>{pair}</span>
                            </div>
                            {activePairs.length > 1 && (
                              <button
                                className="rounded-full hover:bg-[rgba(255,255,255,0.08)] p-0.5"
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
                          onClick={() => setIsMarketWatchOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Pair
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Logout button */}
                  <div className="border-t border-[rgba(255,255,255,0.06)] p-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500"
                      onClick={() => {
                        clearAuthenticatedSession();
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
          </div>
        )}

        {/* Pair Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[rgba(255,255,255,0.06)] transition-colors font-mono text-sm font-extrabold text-[#eef2f7]">
              {activeAsset?.symbol_display || activePair}
              <ChevronDown className="h-3 w-3 text-[#8b97a8]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            {activePairs.map((pair) => (
              <DropdownMenuItem
                key={pair}
                className="flex items-center justify-between"
                onClick={() => handlePairClick(pair)}
              >
                <div className="flex items-center gap-2">
                  <CurrencyFlag pair={pair} />
                  <span className="text-sm">{pair}</span>
                  <span className="text-xs text-[#8b97a8]">
                    {getAssetCategory(pair)}
                  </span>
                </div>
                {activePairs.length > 1 && (
                  <button
                    className="rounded-full hover:bg-[rgba(255,255,255,0.08)] p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCurrencyPair(pair);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => setIsMarketWatchOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-2" />
              <span className="text-sm">Add Pair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Live Price */}
        <span
          className={`font-mono text-sm font-extrabold ${
            isUp ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {livePrice > 0 ? livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "—"}
        </span>

        {/* 24h Stats (desktop only) */}
        <div className="hidden xl:flex items-center gap-4 ml-auto">
          <StatCell
            label="24h Change"
            value={`${isUp ? "+" : ""}${changePercent.toFixed(2)}%`}
            positive={isUp}
          />
          <StatCell
            label="Spread"
            value={activeAsset ? `${Number(activeAsset.buy_spread || 0).toFixed(5)}` : "—"}
          />
          <StatCell
            label="Leverage"
            value={activeAsset ? `1:${activeAsset.leverage || 100}` : "—"}
          />
        </div>

        {/* Trading Strength (desktop) */}
        <div className="hidden md:block ml-auto xl:ml-0">
          <TradingStrengthIndicator onClick={onTradingStrengthClick} />
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-[rgba(255,255,255,0.06)] hidden md:block" />

        {/* Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/main/dashboard"
            className="text-xs font-semibold text-[#8b97a8] hover:text-[#eef2f7] px-2 py-1 rounded-md hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/main/wallet"
            className="text-xs font-semibold text-[#8b97a8] hover:text-[#eef2f7] px-2 py-1 rounded-md hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            Wallet
          </Link>
        </div>

        {/* Live Clock */}
        <span className="hidden sm:block font-mono text-[11px] text-[#8b97a8]">
          {clockTime}
        </span>

        {/* Right side controls */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {!isMobile && <AutoTraderModal />}

          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="h-auto p-0 text-[#00dfa2] font-bold text-xs"
                >
                  {formatCurrency(user?.balance || 0)}
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="p-5 text-base text-[#8b97a8]"
              >
                <div className="space-y-4">
                  {/* Account selection */}
                  <div className="space-y-2">
                    <div className="font-bold text-sm">Select Account</div>
                    <div className="space-y-1">
                      {user?.accounts.map((account, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 rounded hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
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
          )}

          {/* Plan badge */}
          {enablePlan && (
            <img
              src={
                user?.account_type?.image ||
                "https://res.cloudinary.com/dyp8gtllq/image/upload/v1744370355/main_plate_exi8jv.png"
              }
              alt={`${user?.account_type?.title || "Basic"} Badge`}
              className="w-7 h-7 hidden sm:block"
            />
          )}

          {/* Avatar menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-0 h-7 w-7"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user?.avatar} alt="avatar" />
                  <AvatarFallback className="text-[10px]">
                    {user
                      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
                      : ""}
                  </AvatarFallback>
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
                  clearAuthenticatedSession();
                  window.location.href = "/";
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

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
        <div
          className="absolute top-16 left-0 right-0 border-b border-[rgba(255,255,255,0.06)] p-3 z-50"
          style={{
            background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)",
            color: "#eef2f7",
          }}
        >
          <div className="mt-2 max-h-[300px] overflow-y-auto">
            {activePairs.map((pair) => (
              <div
                key={pair}
                className={`flex items-center justify-between p-2 rounded-md ${
                  activePair === pair ? "bg-[rgba(0,223,162,0.1)]" : "hover:bg-[rgba(255,255,255,0.06)]"
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
                    className="rounded-full hover:bg-[rgba(255,255,255,0.08)] p-0.5"
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

      {/* Account Plans Modal */}
      <AccountPlansModal
        open={isPlansModalOpen}
        onOpenChange={setIsPlansModalOpen}
      />
    </>
  );
}

/* ─── Helper: Stat Cell ─── */
function StatCell({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-[#4a5468]">
        {label}
      </span>
      <span
        className={`font-mono text-[11px] font-bold ${
          positive === true
            ? "text-emerald-500"
            : positive === false
            ? "text-red-500"
            : "text-[#eef2f7]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Helper: Currency Flag ─── */
export function CurrencyFlag({ pair }: { pair?: string }) {
  if (!pair || !pair.includes("/")) {
    return (
      <div className="h-5 w-5 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-xs text-[#8b97a8]">
        {pair ? pair.charAt(0) : "?"}
      </div>
    );
  }

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

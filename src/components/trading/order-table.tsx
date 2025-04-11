import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  ChevronRight,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useTradeStore from "@/store/tradeStore";
import type { Trade } from "@/store/tradeStore";

export default function OrderTable() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Trade | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const isMobile = useMobile(768); // Use 768px as the breakpoint for mobile view

  const {
    openTrades,
    closedTrades,
    isLoadingOpen,
    isLoadingClosed,
    errorOpen,
    errorClosed,
    fetchMoreOpenTrades,
    fetchMoreClosedTrades,
    hasMoreOpenTrades,
    hasMoreClosedTrades,
  } = useTradeStore();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Setup intersection observer for infinite scrolling
  const lastElementRef = useCallback(() => {
    const isLoading = activeTab === "active" ? isLoadingOpen : isLoadingClosed;
    const hasMore =
      activeTab === "active" ? hasMoreOpenTrades() : hasMoreClosedTrades();
    const fetchMore =
      activeTab === "active" ? fetchMoreOpenTrades : fetchMoreClosedTrades;

    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [
    activeTab,
    isLoadingOpen,
    isLoadingClosed,
    hasMoreOpenTrades,
    hasMoreClosedTrades,
    fetchMoreOpenTrades,
    fetchMoreClosedTrades,
  ]);

  // Set up the observer when component mounts or tab changes
  useEffect(() => {
    lastElementRef();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lastElementRef, activeTab, openTrades, closedTrades]);

  // Account summary data
  const accountData = {
    balance: 610.05,
    credit: 0.0,
    equity: 610.05,
    margin: 0.0,
    marginLevel: "31381102.23%",
    freeMargin: 610.05,
    pnl: openTrades.reduce((sum, trade) => sum + trade.pnl, 0),
    lifetimePnl: 460.05,
  };

  const handleClosePosition = (order: Trade) => {
    setSelectedOrder(order);
    setShowCloseDialog(true);
  };

  const confirmClose = () => {
    // Logic to close the position would go here
    setShowCloseDialog(false);
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Mobile card view for orders
  const renderMobileOrderCard = (order: Trade, isHistory = false) => {
    const isExpanded = expandedOrderId === order.id;

    return (
      <div
        key={order.id}
        className="mb-1 border border-muted rounded-sm overflow-hidden"
      >
        <div className="p-2 bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Badge
              variant={order.trade_type === "buy" ? "default" : "secondary"}
              className={cn(
                "text-xs px-1.5 py-0.5",
                order.trade_type === "buy" ? "bg-green-500" : "bg-red-500"
              )}
            >
              {order.trade_type.toUpperCase()}
            </Badge>
            <span className="text-sm font-medium">{order.asset_symbol}</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-sm font-medium",
                order.pnl >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {order.pnl >= 0
                ? `$${order.pnl.toFixed(2)}`
                : `-$${Math.abs(order.pnl).toFixed(2)}`}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleOrderExpand(order.id)}
            >
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  isExpanded ? "rotate-180" : ""
                )}
              />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-2 space-y-1.5 bg-background">
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <div className="text-xs text-muted-foreground">ID</div>
                <div className="text-sm">{order.id.substring(0, 8)}...</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Volume</div>
                <div className="text-sm">{order.volume.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Open Price</div>
                <div className="text-sm">{order.opening_price}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {isHistory ? "Close Price" : "Current Price"}
                </div>
                <div className="text-sm">{order.closing_price}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Open Time</div>
                <div className="text-sm">
                  {new Date(order.open_time).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Leverage</div>
                <div className="text-sm">x{order.leverage}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Take Profit</div>
                <div className="text-sm">
                  {order.take_profit > 0 ? order.take_profit : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Stop Loss</div>
                <div className="text-sm">
                  {order.stop_loss > 0 ? order.stop_loss : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Amount</div>
                <div className="text-sm">${order.amount.toFixed(2)}</div>
              </div>
            </div>

            {!isHistory && (
              <div className="flex gap-1.5 mt-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1 text-xs h-7"
                  onClick={() => handleClosePosition(order)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Desktop table view
  const renderDesktopTable = () => {
    const trades = activeTab === "active" ? openTrades : closedTrades;
    const isLoading = activeTab === "active" ? isLoadingOpen : isLoadingClosed;
    const error = activeTab === "active" ? errorOpen : errorClosed;

    if (error) {
      return <div className="w-full p-4 text-center text-red-500">{error}</div>;
    }

    if (trades.length === 0 && !isLoading) {
      return (
        <div className="w-full p-4 text-center text-muted-foreground">
          No {activeTab === "active" ? "active" : "historical"} orders found
        </div>
      );
    }

    return (
      <div className="w-full overflow-hidden">
        <div className="relative h-[150px] max-h-[150px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background border-b">
              <TableRow className="hover:bg-muted/30">
                <TableHead className="h-8 text-xs font-medium">
                  Symbol
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">ID</TableHead>
                <TableHead className="h-8 text-xs font-medium">Type</TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  Volume
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  Open Price
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  Open Time
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  Take Profit
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  Stop Loss
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  {activeTab === "active" ? "Current Price" : "Close Price"}
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  Leverage
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">
                  Amount
                </TableHead>
                <TableHead className="h-8 text-xs font-medium">PnL</TableHead>
                {activeTab === "active" && (
                  <TableHead className="h-8 text-xs font-medium">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {trades.map((trade) => (
                <TableRow key={trade.id} className="h-8 hover:bg-muted/30">
                  <TableCell className="py-1 text-xs">
                    {trade.asset_symbol}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {trade.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="py-1">
                    <Badge
                      variant={
                        trade.trade_type === "buy" ? "default" : "secondary"
                      }
                      className={cn(
                        "text-xs px-1.5 py-0.5",
                        trade.trade_type === "buy"
                          ? "bg-green-500"
                          : "bg-red-500"
                      )}
                    >
                      {trade.trade_type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {trade.volume.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {trade.opening_price}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {new Date(trade.open_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {trade.take_profit > 0 ? trade.take_profit : "-"}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {trade.stop_loss > 0 ? trade.stop_loss : "-"}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {trade.closing_price}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    x{trade.leverage}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    ${trade.amount.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "py-1 text-xs",
                      trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trade.pnl >= 0
                      ? `$${trade.pnl.toFixed(2)}`
                      : `-$${Math.abs(trade.pnl).toFixed(2)}`}
                  </TableCell>
                  {activeTab === "active" && (
                    <TableCell className="py-1">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-6 text-xs px-2"
                          onClick={() => handleClosePosition(trade)}
                        >
                          Close
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs px-2"
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Loading indicator and intersection observer target */}
          <div
            ref={loadMoreRef}
            className="sticky bottom-0 py-1 text-center bg-background border-t"
          >
            {isLoading && (
              <div className="flex justify-center items-center py-1">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Mobile filter dialog
  const renderMobileFilters = () => {
    return (
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Filter Orders</h3>

            <div className="space-y-2">
              <div className="text-sm font-medium">Order Type</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  All
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Buy
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Sell
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Symbol</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="outline" size="sm">
                  Crypto
                </Button>
                <Button variant="outline" size="sm">
                  Forex
                </Button>
                <Button variant="outline" size="sm">
                  Stocks
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Date Range</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="outline" size="sm">
                  This Week
                </Button>
                <Button variant="outline" size="sm">
                  This Month
                </Button>
                <Button variant="outline" size="sm">
                  All Time
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Mobile sheet for full table view
  const renderMobileSheet = () => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-medium">
                {activeTab === "active" ? "Active Orders" : "Order History"}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex border-b border-border">
              <button
                className={cn(
                  "flex-1 py-2 text-center text-sm",
                  activeTab === "active"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("active")}
              >
                ACTIVE ORDERS
              </button>
              <button
                className={cn(
                  "flex-1 py-2 text-center text-sm",
                  activeTab === "history"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("history")}
              >
                ORDERS HISTORY
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {(activeTab === "active" ? openTrades : closedTrades).map(
                (trade) => renderMobileOrderCard(trade, activeTab === "history")
              )}

              {/* Loading indicator and intersection observer target */}
              <div ref={loadMoreRef} className="py-2 text-center">
                {(activeTab === "active" ? isLoadingOpen : isLoadingClosed) && (
                  <div className="flex justify-center items-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  // Compact account summary for mobile
  const renderMobileAccountSummary = () => {
    return (
      <div className="p-2 bg-muted/30 border-t border-muted">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Balance:</span>
              <span className="text-xs font-medium">
                ${accountData.balance.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">PnL:</span>
              <span
                className={cn(
                  "text-xs font-medium",
                  accountData.pnl >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {accountData.pnl >= 0 ? "$" : "-$"}
                {Math.abs(accountData.pnl).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {renderMobileSheet()}
            <Collapsible
              open={showAccountDetails}
              onOpenChange={setShowAccountDetails}
            >
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2 space-y-1 border-t border-border pt-2 absolute left-0 right-0 bg-muted/30">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Credit:</span>
                  <span className="text-xs">
                    ${accountData.credit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Equity:</span>
                  <span className="text-xs">
                    ${accountData.equity.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Margin:</span>
                  <span className="text-xs">
                    ${accountData.margin.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Margin level:
                  </span>
                  <span className="text-xs">{accountData.marginLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Free Margin:
                  </span>
                  <span className="text-xs">
                    ${accountData.freeMargin.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Lifetime PnL:
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      accountData.lifetimePnl >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    ${accountData.lifetimePnl.toFixed(2)}
                  </span>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    );
  };

  // Desktop account summary
  const renderDesktopAccountSummary = () => {
    return (
      <div className="w-full bg-muted/30 border-t border-muted p-2">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Balance:</span>
              <span className="text-sm">${accountData.balance.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Credit:</span>
              <span className="text-sm">${accountData.credit.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Equity:</span>
              <span className="text-sm">${accountData.equity.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Margin:</span>
              <span className="text-sm">${accountData.margin.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Margin level:
              </span>
              <span className="text-sm">{accountData.marginLevel}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Free Margin:
              </span>
              <span className="text-sm">
                ${accountData.freeMargin.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">PnL:</span>
              <span
                className={cn(
                  "text-sm",
                  accountData.pnl >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {accountData.pnl >= 0 ? "$" : "-$"}
                {Math.abs(accountData.pnl).toFixed(2)}
              </span>
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Lifetime PnL:
              </span>
              <span
                className={cn(
                  "text-sm",
                  accountData.lifetimePnl >= 0
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                ${accountData.lifetimePnl.toFixed(2)}
              </span>
            </div>
          )}

          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsCollapsed(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-background text-foreground border border-muted rounded-md shadow-sm w-full ">
      {!isCollapsed && !isMobile && (
        <div className="flex-1">
          <div className="border-b border-muted flex justify-between items-center sticky top-0 z-20 bg-background">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 whitespace-nowrap",
                  activeTab === "active"
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("active")}
              >
                ACTIVE ORDERS
              </button>
              <button
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 whitespace-nowrap",
                  activeTab === "history"
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("history")}
              >
                ORDERS HISTORY
              </button>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-2"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop table view */}
          {renderDesktopTable()}
        </div>
      )}

      {/* Mobile view - just show the compact summary */}
      <div className="sticky bottom-0 z-20 bg-background">
        {isMobile
          ? renderMobileAccountSummary()
          : renderDesktopAccountSummary()}
      </div>

      {renderMobileFilters()}

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="sm:max-w-md bg-muted/90 border-none p-0">
          <div className="bg-muted/90 text-foreground rounded-md">
            <div className="p-4 space-y-4">
              <div className="text-center font-medium">
                CLOSE POSITION #{selectedOrder?.id.substring(0, 8)}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Are you sure to close the position{" "}
                {selectedOrder?.trade_type.toUpperCase()}{" "}
                {selectedOrder?.volume.toFixed(2)} {selectedOrder?.asset_symbol}
                ?
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={confirmClose}
                >
                  Yes
                </Button>
                <Button
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                  onClick={() => setShowCloseDialog(false)}
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

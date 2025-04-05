import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  ChevronRight,
  Info,
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

export default function OrderTable() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const isMobile = useMobile(768); // Use 768px as the breakpoint for mobile view

  // Sample data for active orders
  const activeOrders = [
    {
      id: "50151584",
      symbol: "Ethereum Classic",
      type: "Sell" as const,
      volume: 0.01,
      openPrice: 18.3075,
      timedOrder: "-",
      openTime: "3/26/2025, 2:57:56 PM",
      sl: "-",
      tp: "-",
      price: 16.3025,
      commission: 0.0,
      swap: 0.0,
      pnl: 0.02,
    },
    {
      id: "50151582",
      symbol: "Ethereum Classic",
      type: "Buy" as const,
      volume: 0.01,
      openPrice: 18.3225,
      timedOrder: "-",
      openTime: "3/26/2025, 2:57:10 PM",
      sl: "-",
      tp: "-",
      price: 16.2875,
      commission: 0.0,
      swap: 0.0,
      pnl: -0.02,
    },
    {
      id: "50151498",
      symbol: "Tron",
      type: "Buy" as const,
      volume: 0.17,
      openPrice: 0.2302,
      timedOrder: "-",
      openTime: "3/26/2025, 9:02:40 AM",
      sl: "-",
      tp: "-",
      price: 0.2317,
      commission: 0.0,
      swap: 0.0,
      pnl: 0.0,
    },
    {
      id: "50151497",
      symbol: "AUD/CAD",
      type: "Buy" as const,
      volume: 1.0,
      openPrice: 0.9,
      timedOrder: "-",
      openTime: "3/26/2025, 8:59:28 AM",
      sl: "-",
      tp: "-",
      price: 0.9,
      commission: 0.0,
      swap: 0.0,
      pnl: -0.08,
    },
    {
      id: "50109419",
      symbol: "Bitcoin",
      type: "Buy" as const,
      volume: 0.01,
      openPrice: 68436.0,
      timedOrder: "-",
      openTime: "10/20/2024, 12:44:28 PM",
      sl: "-",
      tp: "-",
      price: 68419.9,
      commission: 0.0,
      swap: 0.0,
      pnl: -0.16,
    },
    {
      id: "50089827",
      symbol: "AUD/CHF",
      type: "Sell" as const,
      volume: 3.0,
      openPrice: 0.59,
      timedOrder: "-",
      openTime: "9/4/2024, 3:52:01 PM",
      sl: "-",
      tp: "-",
      price: 0.57,
      commission: 0.0,
      swap: 0.0,
      pnl: 70.33,
    },
  ];

  // Sample data for order history
  const orderHistory = [
    {
      id: "50151497",
      symbol: "AUD/CAD",
      type: "Buy" as const,
      volume: 1.0,
      openPrice: 0.9,
      openTime: "3/26/2025, 8:59:28 AM",
      closePrice: 0.9,
      closeTime: "3/26/2025, 9:00:38 AM",
      commission: 0.0,
      swap: 0.0,
      pnl: -0.08,
    },
    {
      id: "50109419",
      symbol: "Bitcoin",
      type: "Buy" as const,
      volume: 0.01,
      openPrice: 68436.0,
      openTime: "10/20/2024, 12:44:28 PM",
      closePrice: 68419.9,
      closeTime: "10/20/2024, 12:52:16 PM",
      commission: 0.0,
      swap: 0.0,
      pnl: -0.16,
    },
    {
      id: "50089827",
      symbol: "AUD/CHF",
      type: "Sell" as const,
      volume: 3.0,
      openPrice: 0.59,
      openTime: "9/4/2024, 3:52:01 PM",
      closePrice: 0.57,
      closeTime: "9/4/2024, 4:16:22 PM",
      commission: 0.0,
      swap: 0.0,
      pnl: 70.33,
    },
    {
      id: "50089829",
      symbol: "CAD/JPY",
      type: "Buy" as const,
      volume: 2.0,
      openPrice: 106.06,
      openTime: "9/4/2024, 3:52:18 PM",
      closePrice: 106.73,
      closeTime: "9/4/2024, 4:16:04 PM",
      commission: 0.0,
      swap: 0.0,
      pnl: 9.32,
    },
    {
      id: "50089830",
      symbol: "EUR/USD",
      type: "Sell" as const,
      volume: 1.5,
      openPrice: 1.0825,
      openTime: "9/4/2024, 4:10:18 PM",
      closePrice: 1.081,
      closeTime: "9/4/2024, 4:45:04 PM",
      commission: 0.0,
      swap: 0.0,
      pnl: 22.5,
    },
    {
      id: "50089831",
      symbol: "GBP/JPY",
      type: "Buy" as const,
      volume: 0.5,
      openPrice: 186.25,
      openTime: "9/5/2024, 9:15:18 AM",
      closePrice: 186.75,
      closeTime: "9/5/2024, 10:30:04 AM",
      commission: 0.0,
      swap: 0.0,
      pnl: 3.75,
    },
  ];

  // Account summary data
  const accountData = {
    balance: 610.05,
    credit: 0.0,
    equity: 610.05,
    margin: 0.0,
    marginLevel: "31381102.23%",
    freeMargin: 610.05,
    pnl: 0.0,
    lifetimePnl: 460.05,
  };

  const handleClosePosition = (order: any) => {
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
  const renderMobileOrderCard = (order: any, isHistory = false) => {
    const isExpanded = expandedOrderId === order.id;

    return (
      <div
        key={order.id}
        className="mb-2 border border-muted rounded-md overflow-hidden"
      >
        <div className="p-3 bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge
              variant={order.type === "Buy" ? "default" : "secondary"}
              className={order.type === "Buy" ? "bg-green-500" : "bg-red-500"}
            >
              {order.type}
            </Badge>
            <span className="font-medium">{order.symbol}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium",
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
              className="h-8 w-8"
              onClick={() => toggleOrderExpand(order.id)}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-180" : ""
                )}
              />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3 space-y-2 bg-background">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">ID</div>
                <div className="text-sm">{order.id}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Volume</div>
                <div className="text-sm">{order.volume}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Open Price</div>
                <div className="text-sm">{order.openPrice}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {isHistory ? "Close Price" : "Current Price"}
                </div>
                <div className="text-sm">
                  {isHistory ? order.closePrice : order.price}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Open Time</div>
                <div className="text-sm">{order.openTime}</div>
              </div>
              {isHistory ? (
                <div>
                  <div className="text-xs text-muted-foreground">
                    Close Time
                  </div>
                  <div className="text-sm">{order.closeTime}</div>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-muted-foreground">
                    Timed Order
                  </div>
                  <div className="text-sm">{order.timedOrder}</div>
                </div>
              )}
              {!isHistory && (
                <>
                  <div>
                    <div className="text-xs text-muted-foreground">SL</div>
                    <div className="text-sm">{order.sl}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">TP</div>
                    <div className="text-sm">{order.tp}</div>
                  </div>
                </>
              )}
              <div>
                <div className="text-xs text-muted-foreground">Commission</div>
                <div className="text-sm">${order.commission.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Swap</div>
                <div className="text-sm">${order.swap.toFixed(2)}</div>
              </div>
            </div>

            {!isHistory && (
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleClosePosition(order)}
                >
                  Close
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
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
    return (
      <div className="w-full overflow-x-auto">
        <div className="max-h-[200px] overflow-y-auto border border-muted rounded-md shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Open Price</TableHead>
                {activeTab === "active" && <TableHead>Timed Order</TableHead>}
                <TableHead>Open Time</TableHead>
                {activeTab === "active" && (
                  <>
                    <TableHead>SL</TableHead>
                    <TableHead>TP</TableHead>
                  </>
                )}
                <TableHead>
                  {activeTab === "active" ? "Price" : "Close Price"}
                </TableHead>
                {activeTab === "history" && <TableHead>Close Time</TableHead>}
                <TableHead>Commission</TableHead>
                <TableHead>Swap</TableHead>
                <TableHead>PnL</TableHead>
                {activeTab === "active" && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(activeTab === "active" ? activeOrders : orderHistory).map(
                (order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.symbol}</TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant={order.type === "Buy" ? "default" : "secondary"}
                        className={
                          order.type === "Buy" ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {order.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.volume}</TableCell>
                    <TableCell>{order.openPrice}</TableCell>
                    {activeTab === "active" && (
                      <TableCell>
                        {activeTab === "active" && "timedOrder" in order
                          ? order.timedOrder || "-"
                          : "-"}
                      </TableCell>
                    )}
                    <TableCell>{order.openTime}</TableCell>
                    {activeTab === "active" && (
                      <>
                        <TableCell>
                          {"sl" in order ? order.sl || "-" : "-"}
                        </TableCell>
                        <TableCell>
                          {"tp" in order ? order.tp || "-" : "-"}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {activeTab === "active"
                        ? "price" in order
                          ? order.price
                          : "-"
                        : "closePrice" in order
                        ? order.closePrice
                        : "-"}
                    </TableCell>
                    {activeTab === "history" && (
                      <TableCell>
                        {"closeTime" in order ? order.closeTime : "-"}
                      </TableCell>
                    )}
                    <TableCell>${order.commission.toFixed(2)}</TableCell>
                    <TableCell>${order.swap.toFixed(2)}</TableCell>
                    <TableCell
                      className={cn(
                        order.pnl >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {order.pnl >= 0
                        ? `$${order.pnl.toFixed(2)}`
                        : `-$${Math.abs(order.pnl).toFixed(2)}`}
                    </TableCell>
                    {activeTab === "active" && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleClosePosition(order)}
                          >
                            Close
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
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
              {(activeTab === "active" ? activeOrders : orderHistory).map(
                (order) => renderMobileOrderCard(order, activeTab === "history")
              )}
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
    <div className="flex flex-col bg-background text-foreground border border-muted rounded-md shadow-sm w-full max-w-[1200px] mx-auto">
      {!isCollapsed && !isMobile && (
        <div className="flex-1">
          <div className="border-b border-muted flex justify-between items-center">
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
      {isMobile ? renderMobileAccountSummary() : renderDesktopAccountSummary()}

      {renderMobileFilters()}

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="sm:max-w-md bg-muted/90 border-none p-0">
          <div className="bg-muted/90 text-foreground rounded-md">
            <div className="p-4 space-y-4">
              <div className="text-center font-medium">
                CLOSE POSITION #{selectedOrder?.id}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Are you sure to close the position {selectedOrder?.type}{" "}
                {selectedOrder?.volume} {selectedOrder?.symbol}?
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


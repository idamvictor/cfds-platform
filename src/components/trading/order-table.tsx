
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function OrderTable() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  return (
    <div className="flex flex-col bg-background text-foreground border border-muted rounded-md shadow-sm w-full max-w-[1200px] mx-auto">
      {!isCollapsed && (
        <div className="flex-1">
          <div className="border-b border-muted flex justify-between items-center">
            <div className="flex">
              <button
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2",
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
                  "rounded-none border-b-2 border-transparent px-4 py-2",
                  activeTab === "history"
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("history")}
              >
                ORDERS HISTORY
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 mr-2"
              onClick={() => setIsCollapsed(true)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

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
                    <TableHead>Timed Order</TableHead>
                    <TableHead>Open Time</TableHead>
                    <TableHead>SL</TableHead>
                    <TableHead>TP</TableHead>
                    <TableHead>Price</TableHead>
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
                        <TableCell>{order.type}</TableCell>
                        <TableCell>{order.volume}</TableCell>
                        <TableCell>{order.openPrice}</TableCell>
                        <TableCell>
                          {activeTab === "active" && "timedOrder" in order
                            ? order.timedOrder || "-"
                            : "-"}
                        </TableCell>
                        <TableCell>{order.openTime}</TableCell>
                        <TableCell>
                          {activeTab === "active" && "sl" in order
                            ? order.sl || "-"
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {activeTab === "active" && "tp" in order
                            ? order.tp || "-"
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {activeTab === "active" && "price" in order
                            ? order.price
                            : "closePrice" in order
                            ? order.closePrice || "-"
                            : "-"}
                        </TableCell>
                        <TableCell>${order.commission.toFixed(2)}</TableCell>
                        <TableCell>${order.swap.toFixed(2)}</TableCell>
                        <TableCell>
                          {order.pnl >= 0
                            ? `$${order.pnl.toFixed(2)}`
                            : `-$${Math.abs(order.pnl).toFixed(2)}`}
                        </TableCell>
                        {activeTab === "active" && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="link"
                                onClick={() => handleClosePosition(order)}
                              >
                                Close
                              </Button>
                              <Button variant="link">Edit</Button>
                              <Button variant="link">Close In Time</Button>
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
        </div>
      )}

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

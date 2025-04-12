import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trade } from "@/store/tradeStore";

interface MobileOrderCardProps {
    order: Trade;
    isHistory?: boolean;
    expandedOrderId: string | null;
    toggleOrderExpand: (orderId: string) => void;
    handleClosePosition?: (order: Trade) => void;
}

export function MobileOrderCard({
                                    order,
                                    isHistory = false,
                                    expandedOrderId,
                                    toggleOrderExpand,
                                    handleClosePosition,
                                }: MobileOrderCardProps) {
    const isExpanded = expandedOrderId === order.id;

    return (
        <div className="mb-1 border border-muted rounded-sm overflow-hidden">
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

                    {!isHistory && handleClosePosition && (
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
}

export default MobileOrderCard;

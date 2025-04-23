import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trade } from "@/store/tradeStore";
import useAssetStore from "@/store/assetStore";


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

    const { setActiveAsset, assets } = useAssetStore();

    const handleAssetClick = (e: React.MouseEvent, symbol: string) => {
      e.stopPropagation(); // Prevent expanding the card when clicking the symbol
      const asset = assets.find((a) => a.symbol_display === symbol);
      if (asset) {
        setActiveAsset(asset);
      }
    };


  return (
    <div
      className="mb-1 border border-muted rounded-sm overflow-hidden"
      onClick={() => toggleOrderExpand(order.id)}
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
          <Button
            className="text-sm font-medium "
            variant="ghost"
            onClick={(e) => handleAssetClick(e, order.asset_symbol)}
          >
            {order.asset_symbol}
          </Button>
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
          <Button variant="ghost" size="icon" className="h-6 w-6">
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
              <div className="text-sm">{order.trade_id}</div>
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
              <div className="text-sm">{order.open_time}</div>
            </div>
            {isHistory && (
              <div>
                <div className="text-xs text-muted-foreground">Close Time</div>
                <div className="text-sm">{order.close_time || "-"}</div>
              </div>
            )}
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
              <div className="text-xs text-muted-foreground">Margin</div>
              <div className="text-sm">${order.margin}</div>
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
              {/*<Button*/}
              {/*  size="sm"*/}
              {/*  variant="outline"*/}
              {/*  className="flex-1 text-xs h-7"*/}
              {/*>*/}
              {/*  Edit*/}
              {/*</Button>*/}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileOrderCard;

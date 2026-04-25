import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Trade } from "@/store/tradeStore";
import useUserStore from "@/store/userStore.ts";
import useAssetStore from "@/store/assetStore";

interface DesktopTradeTableProps {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  activeTab: "active" | "history";
  loadMoreRef: React.RefObject<HTMLDivElement | null>; // Updated to allow null
  handleClosePosition?: (order: Trade) => void;
}

export function DesktopTradeTable({
  trades,
  isLoading,
  error,
  activeTab,
  loadMoreRef,
  handleClosePosition,
}: DesktopTradeTableProps) {
  const user = useUserStore((state) => state.user);
  const { setActiveAsset, assets } = useAssetStore();

  const handleAssetClick = (assetSymbol: string) => {
    const asset = assets.find((a) => a.symbol_display === assetSymbol);
    if (asset) {
      setActiveAsset(asset);
    }
  };

  if (error) {
    return <div className="w-full p-4 text-center text-red-500">{error}</div>;
  }

  if (trades.length === 0 && !isLoading) {
    return (
      <div className="w-full p-4 text-center text-[#8b97a8]">
        No {activeTab === "active" ? "active" : "historical"} orders found
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="relative h-[150px] max-h-[150px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)]">
            <TableRow className="hover:bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.06)]">
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                Symbol
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                ID
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                Type
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                Volume
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                Open Price
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                Open Time
              </TableHead>
              {activeTab === "history" && (
                <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                  Close Time
                </TableHead>
              )}
              <TableHead className="h-8 text-xs font-medium text-[#4a5468] w-9">
                TP
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468] w-9">
                SL
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                {activeTab === "active" ? "Price" : "Close Price"}
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                Leverage
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                Margin
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                PnL
              </TableHead>
              {activeTab === "active" && user?.can_close_trade && (
                <TableHead className="h-8 text-xs font-medium text-[#4a5468]">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {trades.map((trade) => (
              <TableRow key={trade.id} className="h-8 hover:bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.04)]">
                <TableCell
                  className="py-1 text-xs text-[#8b97a8] cursor-pointer hover:text-[#00dfa2]"
                  onClick={() => handleAssetClick(trade.asset_symbol)}
                >
                  {trade.asset_symbol}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8]">
                  {trade.trade_id}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-1 ",
                    trade.trade_type === "buy"
                      ? "text-emerald-500"
                      : "text-red-500"
                  )}
                >
                  {trade.trade_type.toUpperCase()}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8]">
                  {trade.volume.toFixed(2)}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8]">
                  {trade.opening_price}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8]">
                  {trade.open_time}
                </TableCell>
                {activeTab === "history" && (
                  <TableCell className="py-1 text-xs text-[#8b97a8]">
                    {trade.close_time || "-"}
                  </TableCell>
                )}
                <TableCell className="py-1 text-xs text-[#8b97a8] w-9">
                  {trade.take_profit > 0 ? trade.take_profit : "-"}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8] w-9">
                  {trade.stop_loss > 0 ? trade.stop_loss : "-"}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8]">
                  {trade.closing_price}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8]">
                  x{trade.leverage}
                </TableCell>
                <TableCell className="py-1 text-xs text-[#8b97a8]">
                  ${trade.margin}
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
                {activeTab === "active" &&
                  handleClosePosition &&
                  user?.can_close_trade && (
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
                        {/*<Button*/}
                        {/*    size="sm"*/}
                        {/*    variant="outline"*/}
                        {/*    className="h-6 text-xs px-2"*/}
                        {/*>*/}
                        {/*    Edit*/}
                        {/*</Button>*/}
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
          className="sticky bottom-0 py-1 text-center bg-[rgba(255,255,255,0.03)] border-t border-[rgba(255,255,255,0.06)]"
        >
          {isLoading && (
            <div className="flex justify-center items-center py-1">
              <Loader2 className="h-4 w-4 animate-spin text-[#8b97a8]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesktopTradeTable;

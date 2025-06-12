import React from "react";
import { Button } from "@/components/ui/button";

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
// import useUserStore from "@/store/userStore.ts";
import useAssetStore from "@/store/assetStore";

interface DesktopPositionTableProps {
  positions: Trade[];
  isLoading: boolean;
  error: string | null;
  activeTab: "active" | "history";
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  handleClosePosition?: (order: Trade) => void;
}

export function DesktopPositionTable({
  positions,
  isLoading,
  error,
  activeTab,
  loadMoreRef,
  handleClosePosition,
}: DesktopPositionTableProps) {
  // const user = useUserStore((state) => state.user);
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

  if (positions.length === 0 && !isLoading) {
    return (
      <div className="w-full p-4 text-center text-slate-400">
        No {activeTab === "active" ? "active" : "historical"} positions found
      </div>
    );
  }
  return (
    <div className="h-[calc(200px-38px)] w-full overflow-hidden flex flex-col">
      <div className="w-full overflow-y-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-700 z-10">
            <TableRow className="border-b border-slate-600 hover:bg-transparent">
              <TableHead className="h-8 text-xs font-medium text-slate-400">
                Symbol
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-slate-400">
                Type
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-slate-400">
                Volume
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-slate-400">
                Open Time
              </TableHead>
              {activeTab === "history" && (
                <TableHead className="h-8 text-xs font-medium text-slate-400">
                  Close Time
                </TableHead>
              )}
              <TableHead className="h-8 text-xs font-medium text-slate-400 w-9">
                TP
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-slate-400 w-9">
                SL
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-slate-400">
                {activeTab === "active" ? "Price" : "Close Price"}
              </TableHead>
              <TableHead className="h-8 text-xs font-medium text-slate-400 text-right">
                P/L
              </TableHead>
              {activeTab === "active" && handleClosePosition && (
                <TableHead className="h-8 text-xs font-medium text-slate-400 w-9">
                  Close
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow
                key={position.id}
                className="border-b border-border hover:bg-slate-700/50 bg-slate-800/50"
              >
                <TableCell
                  onClick={() => handleAssetClick(position.asset_symbol)}
                  className="py-2 text-xs font-medium cursor-pointer hover:text-primary transition-colors"
                >
                  {position.asset_symbol}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-2 text-xs font-medium",
                    position.trade_type === "buy"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {position.trade_type.toUpperCase()}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {position.volume.toFixed(2)}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  { position.open_time }
                </TableCell>
                {activeTab === "history" && (
                  <TableCell className="py-2 text-xs">
                    { position.close_time }
                  </TableCell>
                )}
                <TableCell className="py-2 text-xs">
                  {position.take_profit || "-"}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {position.stop_loss || "-"}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {position.closing_price.toFixed(5)}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-2 text-xs text-right",
                    position.pnl >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {position.pnl > 0 ? "+" : ""}
                  {position.pnl.toFixed(2)}
                </TableCell>
                {activeTab === "active" && handleClosePosition && (
                  <TableCell className="py-2 text-xs">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleClosePosition(position)}
                    >
                      ✕
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div ref={loadMoreRef} className="w-full h-4" />
    </div>
  );
}

export default DesktopPositionTable;

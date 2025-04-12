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
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                Symbol
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                ID
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                Type
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                Volume
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                Open Price
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                Open Time
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                TP
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                SL
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                {activeTab === "active" ? "Price" : "Close Price"}
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                Leverage
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                Amount
                            </TableHead>
                            <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                PnL
                            </TableHead>
                            {activeTab === "active" && (
                                <TableHead className="h-8 text-xs font-medium text-muted-foreground">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-y-auto">
                        {trades.map((trade) => (
                            <TableRow key={trade.id} className="h-8 hover:bg-muted/30">
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {trade.asset_symbol}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {trade.id.substring(0, 8)}...
                                </TableCell>
                                <TableCell  className={cn(
                                    "py-1 ",
                                    trade.trade_type === "buy"
                                        ? "text-primary"
                                        : "text-destructive"
                                )} >
                                    {trade.trade_type.toUpperCase()}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {trade.volume.toFixed(2)}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {trade.opening_price}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {new Date(trade.open_time).toLocaleString()}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {trade.take_profit > 0 ? trade.take_profit : "-"}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {trade.stop_loss > 0 ? trade.stop_loss : "-"}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    {trade.closing_price}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
                                    x{trade.leverage}
                                </TableCell>
                                <TableCell className="py-1 text-xs text-muted-foreground">
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
                                {activeTab === "active" && handleClosePosition && (
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
}

export default DesktopTradeTable;

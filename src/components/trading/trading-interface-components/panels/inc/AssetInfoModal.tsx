import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { X, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Asset } from "@/store/assetStore";
import TechnicalAnalysisWidget from "@/components/trading/partials/TechnicalAnalysisWidget";

interface AssetInfoModalProps {
    asset: Asset;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTradeClick: () => void;  // Add handler for the Trade Now button
}

export default function AssetInfoModal({
                                           asset,
                                           open,
                                           onOpenChange,
                                           onTradeClick
                                       }: AssetInfoModalProps) {
    if (!asset) return null;

    const changePercent = asset.change_percent
        ? Number.parseFloat(asset.change_percent)
        : 0;

    // Helper function for formatting numbers with comma separators
    const formatNumber = (value: string | null, decimals = 2): string => {
        if (!value) return "0";
        const num = Number.parseFloat(value);
        return isNaN(num) ? "0" : num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    // Define the type for our trading schedule
    type WeekDay = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
    type TradingSchedule = {
        hours: string;
        days: Record<WeekDay, string>;
    };

    // Trading schedules based on asset type
    const getTradingSchedule = (assetType: string): TradingSchedule => {
        switch (assetType.toLowerCase()) {
            case "crypto":
                return {
                    hours: "24/7",
                    days: {
                        "Sunday": "00:00 - 24:00",
                        "Monday": "00:00 - 24:00",
                        "Tuesday": "00:00 - 24:00",
                        "Wednesday": "00:00 - 24:00",
                        "Thursday": "00:00 - 24:00",
                        "Friday": "00:00 - 24:00",
                        "Saturday": "00:00 - 24:00"
                    }
                };
            case "forex":
                return {
                    hours: "24/5",
                    days: {
                        "Sunday": "22:00 - 24:00",
                        "Monday": "00:00 - 24:00",
                        "Tuesday": "00:00 - 24:00",
                        "Wednesday": "00:00 - 24:00",
                        "Thursday": "00:00 - 24:00",
                        "Friday": "00:00 - 22:00",
                        "Saturday": "Closed"
                    }
                };
            case "stocks":
                return {
                    hours: "Regular Market Hours",
                    days: {
                        "Sunday": "Closed",
                        "Monday": "09:30 - 16:00",
                        "Tuesday": "09:30 - 16:00",
                        "Wednesday": "09:30 - 16:00",
                        "Thursday": "09:30 - 16:00",
                        "Friday": "09:30 - 16:00",
                        "Saturday": "Closed"
                    }
                };
            case "indices":
                return {
                    hours: "Regular Market Hours",
                    days: {
                        "Sunday": "Closed",
                        "Monday": "09:30 - 16:00",
                        "Tuesday": "09:30 - 16:00",
                        "Wednesday": "09:30 - 16:00",
                        "Thursday": "09:30 - 16:00",
                        "Friday": "09:30 - 16:00",
                        "Saturday": "Closed"
                    }
                };
            case "commodities":
                return {
                    hours: "Electronic Trading",
                    days: {
                        "Sunday": "18:00 - 24:00",
                        "Monday": "00:00 - 17:00, 18:00 - 24:00",
                        "Tuesday": "00:00 - 17:00, 18:00 - 24:00",
                        "Wednesday": "00:00 - 17:00, 18:00 - 24:00",
                        "Thursday": "00:00 - 17:00, 18:00 - 24:00",
                        "Friday": "00:00 - 17:00",
                        "Saturday": "Closed"
                    }
                };
            default:
                return {
                    hours: "Standard Hours",
                    days: {
                        "Sunday": "Closed",
                        "Monday": "09:00 - 17:00",
                        "Tuesday": "09:00 - 17:00",
                        "Wednesday": "09:00 - 17:00",
                        "Thursday": "09:00 - 17:00",
                        "Friday": "09:00 - 17:00",
                        "Saturday": "Closed"
                    }
                };
        }
    };

    const schedule = getTradingSchedule(asset.type);
    const weekdays: WeekDay[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-6xl p-0 bg-background max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sticky top-0 z-10 bg-slate-700 py-3 px-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                            {asset.image ? (
                                <img
                                    src={asset.image}
                                    alt={asset.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-lg font-bold">
                                    {asset.symbol.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold">{asset.name}</DialogTitle>
                            <p className="text-sm text-muted-foreground">
                                {asset.symbol} • {asset.type.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className={cn(
                                "px-2 py-1",
                                changePercent >= 0
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                            )}
                        >
                            {changePercent >= 0 ? "+" : ""}{changePercent}%
                        </Badge>
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => {
                                onTradeClick();
                                onOpenChange(false); // Close the modal after clicking Trade Now
                            }}
                        >
                            Trade Now
                        </Button>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Left column */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-primary">Asset Information</h3>
                            <div className="bg-muted/30 rounded-lg">
                                <div className="grid grid-cols-2 gap-x-4 p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Symbol</p>
                                            <p className="text-sm font-medium">{asset.symbol}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Current Rate</p>
                                            <p className="text-sm font-medium">{asset.rate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">24h Low</p>
                                            <p className="text-sm font-medium">{asset.price_low}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Spread (Buy)</p>
                                            <p className="text-sm font-medium">{asset.buy_spread}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">24h Change</p>
                                            <p className={cn(
                                                "text-sm font-medium",
                                                changePercent >= 0 ? "text-green-500" : "text-red-500"
                                            )}>
                                                {changePercent >= 0 ? "+" : ""}{changePercent}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">24h High</p>
                                            <p className="text-sm font-medium">{asset.price_high}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Spread (Sell)</p>
                                            <p className="text-sm font-medium">{asset.sell_spread}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 border border-muted rounded">
                                <TechnicalAnalysisWidget
                                    symbol={asset?.tv_symbol || "NASDAQ:AAPL"}
                                    interval="15m"
                                    width="100%"
                                    height="350px"
                                    colorTheme="dark"
                                    showIntervalTabs={true}
                                    isTransparent={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-primary">Trading Schedule</h3>
                            <div className="bg-muted/30 rounded-lg p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between py-1">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">Trading Hours</span>
                                        </div>
                                        <span className="text-sm font-medium">{schedule.hours}</span>
                                    </div>
                                    <Separator className="bg-muted" />
                                    {weekdays.map((day) => (
                                        <div key={day} className="flex items-center justify-between py-1">
                                            <span className="text-xs text-muted-foreground">{day}</span>
                                            <span className={cn(
                                                "text-xs",
                                                schedule.days[day] === "Closed" ? "text-red-400" : ""
                                            )}>
                                                {schedule.days[day]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-3 text-primary">Contract Specifications</h3>
                            <div className="bg-muted/30 rounded-lg p-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-muted-foreground">Contract Size</span>
                                        <span className="text-xs">{asset.contract_size || '100,000'}</span>
                                    </div>
                                    <Separator className="bg-muted" />
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-muted-foreground">Position</span>
                                        <span className="text-xs">{asset.position || '1,000'}</span>
                                    </div>
                                    <Separator className="bg-muted" />
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-muted-foreground">Min Position</span>
                                        <span className="text-xs">0.01 Lots (1,000 units)</span>
                                    </div>
                                    <Separator className="bg-muted" />
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-muted-foreground">Max Position</span>
                                        <span className="text-xs">50 Lots (5,000,000 units)</span>
                                    </div>
                                    <Separator className="bg-muted" />
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-muted-foreground">Position Step</span>
                                        <span className="text-xs">0.01 Lots</span>
                                    </div>
                                    <Separator className="bg-muted" />
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-muted-foreground">Swap Long</span>
                                        <span className="text-xs">{formatNumber(asset.change, 5)}%</span>
                                    </div>
                                    <Separator className="bg-muted" />
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-muted-foreground">Swap Short</span>
                                        <span className="text-xs">{formatNumber(asset.change, 5)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/30 p-4 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Last updated: {new Date(asset.updated_at).toLocaleString()}</p>
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="text-xs">View Chart</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

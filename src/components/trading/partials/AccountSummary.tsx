import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {useCurrency} from "@/hooks/useCurrency.ts";

export interface AccountSummary {
    balance: number;
    credit: number;
    equity: number;
    margin: number;
    marginLevel: string;
    freeMargin: number;
    pnl: number;
    lifetimePnl: number;
}

interface AccountSummaryProps {
    accountData: AccountSummary;
    isDesktop: boolean;
    isCollapsed?: boolean;
    setIsCollapsed?: (collapsed: boolean) => void;
    showAccountDetails?: boolean;
    setShowAccountDetails?: (show: boolean) => void;
    children?: React.ReactNode;
}

export function AccountSummary({
                                   accountData,
                                   isDesktop,
                                   isCollapsed = false,
                                   setIsCollapsed = () => {},
                                   showAccountDetails = false,
                                   setShowAccountDetails = () => {},
                                   children,
                               }: AccountSummaryProps) {

    const { formatCurrency } = useCurrency();

    if (isDesktop) {
        return (
            <div className="w-full bg-muted/30 border-t border-muted p-2">
                <div className="flex flex-wrap gap-4 justify-between">
                    <div className="flex  gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">Balance:</span>
                            <span className="text-xs">{formatCurrency(accountData.balance)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">Credit:</span>
                            <span className="text-xs">{formatCurrency(accountData.credit)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">Equity:</span>
                            <span className="text-xs">{formatCurrency(accountData.equity)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">Margin:</span>
                            <span className="text-xs">{formatCurrency(accountData.margin)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">
                                Margin level:
                            </span>
                            <span className="text-xs">{accountData.marginLevel}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">
                                Free Margin:
                            </span>
                            <span className="text-xs">
                                {formatCurrency(accountData.freeMargin)}
                            </span>
                        </div>

                        {/*<div className="flex items-center gap-2">*/}
                        {/*    <span className="text-muted-foreground text-sm">PnL:</span>*/}
                        {/*    <span*/}
                        {/*        className={cn(*/}
                        {/*            "text-sm",*/}
                        {/*            accountData.pnl >= 0 ? "text-green-500" : "text-red-500"*/}
                        {/*        )}*/}
                        {/*    >*/}
                        {/*        {accountData.pnl >= 0 ? "$" : "-$"}*/}
                        {/*        {Math.abs(accountData.pnl).toFixed(2)}*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                    </div>

                    {/*{!isCollapsed && (*/}
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">
                                PnL:
                            </span>
                            <span
                                className={cn(
                                    "text-xs",
                                    accountData.lifetimePnl >= 0
                                        ? "text-green-500"
                                        : "text-red-500"
                                )}
                            >
                                      {accountData.pnl >= 0 ? "" : "-"}
                                {formatCurrency(accountData.pnl)}
                            </span>
                        </div>
                    {/*)}*/}

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
    }

    // Mobile layout
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
                    {children}
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
                        <CollapsibleContent className="mt-2 space-y-1 border-t border-border pt-2 absolute left-0 right-0 bg-muted/30 z-50 p-2">
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
}

export default AccountSummary;

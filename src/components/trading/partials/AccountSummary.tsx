import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, Info, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency.ts";
import AssetInfoModal from "@/components/trading/trading-interface-components/panels/inc/AssetInfoModal";
import { Asset } from "@/store/assetStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  asset: Asset; // Add asset prop
  isDesktop: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

export function AccountSummary({
  accountData,
  asset,
  isDesktop,
  isCollapsed = false,
  setIsCollapsed = () => {},
  children,
}: AccountSummaryProps) {
  const { formatCurrency } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  if (isDesktop) {
    return (
      <div className="w-full bg-[rgba(255,255,255,0.03)] border-t border-[rgba(255,255,255,0.06)] p-2 text-[#eef2f7]">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#8b97a8] text-xs">Balance:</span>
              <span className="text-xs">
                {formatCurrency(accountData.balance)}
              </span>
            </div>

            {/*<div className="flex items-center gap-2">*/}
            {/*  <span className="text-[#8b97a8] text-xs">Credit:</span>*/}
            {/*  <span className="text-xs">*/}
            {/*    {formatCurrency(accountData.credit)}*/}
            {/*  </span>*/}
            {/*</div>*/}

            <div className="flex items-center gap-2">
              <span className="text-[#8b97a8] text-xs">Equity:</span>
              <span className="text-xs">
                {formatCurrency(accountData.equity)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8b97a8] text-xs">Margin:</span>
              <span className="text-xs">
                {formatCurrency(accountData.margin)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8b97a8] text-xs">
                Margin level:
              </span>
              <span className="text-xs">{accountData.marginLevel}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8b97a8] text-xs">
                Free Margin:
              </span>
              <span className="text-xs">
                {formatCurrency(accountData.freeMargin)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8b97a8] text-xs">PnL:</span>
            <span
              className={cn(
                "text-xs",
                  accountData.pnl >= 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {accountData.pnl >= 0 ? "" : "-"}
              {formatCurrency(Math.abs(accountData.pnl))}
            </span>
          </div>

          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#8b97a8] hover:text-[#eef2f7] hover:bg-[rgba(255,255,255,0.06)]"
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
    <div className="p-2 bg-[rgba(255,255,255,0.03)] border-t border-[rgba(255,255,255,0.06)] text-[#eef2f7]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#8b97a8]">Bal:</span>
            <span className="text-xs font-medium">
              {formatCurrency(parseFloat(accountData.balance.toFixed(2)))}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#8b97a8]">PnL:</span>
            <span
              className={cn(
                "text-xs font-medium",
                accountData.pnl >= 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {accountData.pnl >= 0 ? "" : "-"}
              {formatCurrency(Math.abs(accountData.pnl))}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 pr-2">
          {children}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-[#8b97a8] hover:text-[#eef2f7] hover:bg-[rgba(255,255,255,0.06)]"
            onClick={() => setShowAccountDetails(true)}
          >
            <Wallet className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-[#8b97a8] hover:text-[#eef2f7] hover:bg-[rgba(255,255,255,0.06)]"
            onClick={() => setIsModalOpen(true)}
          >
            <Info className="h-3.5 w-3.5" />
          </Button>

          {/* Asset Info Modal */}
          <AssetInfoModal
            asset={asset}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onTradeClick={() => {}}
          />

          {/* Account Details Dialog */}
          <Dialog
            open={showAccountDetails}
            onOpenChange={setShowAccountDetails}
          >
            <DialogContent className="sm:max-w-md">
              <div className="space-y-4 p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Balance</span>
                  <span className="font-medium">
                    {formatCurrency(accountData.balance)}
                  </span>
                </div>
                {/*<div className="flex justify-between items-center">*/}
                {/*  <span className="text-sm">Credit</span>*/}
                {/*  <span className="font-medium">*/}
                {/*    {formatCurrency(accountData.credit)}*/}
                {/*  </span>*/}
                {/*</div>*/}
                <div className="flex justify-between items-center">
                  <span className="text-sm">Equity</span>
                  <span className="font-medium">
                    {formatCurrency(accountData.equity)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Margin</span>
                  <span className="font-medium">
                    {formatCurrency(accountData.margin)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Margin Level</span>
                  <span className="font-medium">{accountData.marginLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Free Margin</span>
                  <span className="font-medium">
                    {formatCurrency(accountData.freeMargin)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">PnL</span>
                  <span
                    className={cn(
                      "font-medium",
                      accountData.pnl >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {accountData.pnl >= 0 ? "" : "-"}
                    {formatCurrency(Math.abs(accountData.pnl))}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default AccountSummary;

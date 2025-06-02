import { Button } from "@/components/ui/button";
import useTradeStore from "@/store/tradeStore";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";

export default function TotalPortfolio() {
  const accountSummary = useTradeStore((state) => state.accountSummary);
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-[#1C2030] border-t border-slate-700 p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-sm font-medium text-white">
            Total Portfolio
          </span>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-400">BALANCE</span>
              <span className="ml-2 text-white">
                {formatCurrency(accountSummary.balance)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">EQUITY</span>
              <span className="ml-2 text-white">
                {formatCurrency(accountSummary.equity)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">MARGIN</span>
              <span className="ml-2 text-white">
                {formatCurrency(accountSummary.margin)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">FREE MARGIN</span>
              <span className="ml-2 text-white">
                {formatCurrency(accountSummary.freeMargin)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">P/L</span>
              <span
                className={cn(
                  "ml-2",
                  accountSummary.pnl >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {accountSummary.pnl >= 0 ? "" : "-"}
                {formatCurrency(Math.abs(accountSummary.pnl))}
              </span>
            </div>
          </div>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          SWITCH TO CRM
        </Button>
      </div>
    </div>
  );
}

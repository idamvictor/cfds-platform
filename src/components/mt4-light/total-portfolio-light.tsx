// import { Button } from "@/components/ui/button";
import useTradeStore from "@/store/tradeStore";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";

export default function TotalPortfolioLight() {
  const accountSummary = useTradeStore((state) => state.accountSummary);
  const { formatCurrency } = useCurrency();
  // const navigate = useNavigate();

  return (
    <div className="bg-[#C3C3C3] border-t border-slate-700 w-full p-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1 min-w-0">
          {/* <span className="text-sm font-medium text-slate-900 whitespace-nowrap">
            Total Portfolio
          </span> */}

          <div className="overflow-x-auto flex-1 min-w-0">
            <div className="flex gap-6 items-center text-xs min-w-max">
              <div className="flex items-center gap-2">
                <Dot className="text-slate-900" />
                <span className="text-slate-900 font-semibold">BALANCE:</span>
                <span className="ml-2 text-slate-900 font-semibold">
                  {formatCurrency(accountSummary.balance)}
                </span>
              </div>
              <div>
                <span className="text-slate-900 font-semibold">EQUITY:</span>
                <span className="ml-2 text-slate-900 font-semibold">
                  {formatCurrency(accountSummary.equity)}
                </span>
              </div>
              <div>
                <span className="text-slate-900 font-semibold">MARGIN:</span>
                <span className="ml-2 text-slate-900 font-semibold">
                  {formatCurrency(accountSummary.margin)}
                </span>
              </div>
              <div>
                <span className="text-slate-900 font-semibold">
                  FREE MARGIN:
                </span>
                <span className="ml-2 text-slate-900 font-semibold">
                  {formatCurrency(accountSummary.freeMargin)}
                </span>
              </div>
              <div>
                <span className="text-slate-900 font-semibold">P/L:</span>
                <span
                  className={cn(
                    "ml-2 font-semibold",
                    accountSummary.pnl >= 0
                      ? "text-slate-900"
                      : "text-slate-900"
                  )}
                >
                  {accountSummary.pnl >= 0 ? "" : "-"}
                  {formatCurrency(Math.abs(accountSummary.pnl))}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <Button
          className="bg-orange-600  hover:bg-orange-700 ml-4 shrink-0"
          onClick={() => navigate("/main/dashboard")}
        >
          DASHBOARD
        </Button> */}
      </div>
    </div>
  );
}

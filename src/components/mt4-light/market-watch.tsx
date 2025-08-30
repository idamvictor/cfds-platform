import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface CurrencyPair {
  symbol: string;
  flag: string;
  bid: string;
  ask: string;
}

interface MarketWatchProps {
  currencyPairs: CurrencyPair[];
}

export function MarketWatch({ currencyPairs }: MarketWatchProps) {
  return (
    <div className="p-3 border-b border-slate-300 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Market Watch: 22:56:59</h3>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2 top-2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search Market"
          className="pl-8 h-8 text-sm border-slate-300 bg-white text-slate-700"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-slate-200 text-slate-500"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-700 mb-2">
        <div>Symbol</div>
        <div className="text-center">Bid</div>
        <div className="text-center">Ask</div>
      </div>

      <div className="space-y-1">
        {currencyPairs.map((pair, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 py-1 hover:bg-slate-100 rounded text-xs"
          >
            <div className="flex items-center gap-2">
              <span>{pair.flag}</span>
              <span className="font-medium text-slate-800">{pair.symbol}</span>
            </div>
            <div className="text-center text-blue-600 font-medium">
              {pair.bid}
            </div>
            <div className="text-center text-red-600 font-medium">
              {pair.ask}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

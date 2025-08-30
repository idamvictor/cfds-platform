import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TradeHistoryItem {
  order: string;
  time: string;
  type: string;
  size: string;
  symbol: string;
  price: string;
  sl: string;
  tp: string;
  currentPrice: string;
  commission: string;
  swap: string;
  profit: string;
}

interface TradingHistoryProps {
  tradeHistory: TradeHistoryItem[];
}

export function TradingHistory({ tradeHistory }: TradingHistoryProps) {
  return (
    <div className="h-48 bg-white">
      <div className="border-b border-slate-400 px-4 py-2 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1"
        >
          Trade
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-slate-700 hover:bg-slate-200 px-3 py-1"
        >
          Account History
        </Button>
      </div>

      <div className="overflow-auto h-full">
        <table className="w-full text-xs">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="text-left p-2 font-medium text-slate-800">
                Order
              </th>
              <th className="text-left p-2 font-medium text-slate-800">Time</th>
              <th className="text-left p-2 font-medium text-slate-800">Type</th>
              <th className="text-left p-2 font-medium text-slate-800">Size</th>
              <th className="text-left p-2 font-medium text-slate-800">
                Symbol
              </th>
              <th className="text-left p-2 font-medium text-slate-800">
                Price
              </th>
              <th className="text-left p-2 font-medium text-slate-800">S/L</th>
              <th className="text-left p-2 font-medium text-slate-800">T/P</th>
              <th className="text-left p-2 font-medium text-slate-800">
                Price
              </th>
              <th className="text-left p-2 font-medium text-slate-800">
                Commission
              </th>
              <th className="text-left p-2 font-medium text-slate-800">Swap</th>
              <th className="text-left p-2 font-medium text-slate-800">
                Profit
              </th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.map((trade, index) => (
              <tr
                key={index}
                className={`border-b border-slate-200 text-slate-700 ${
                  index === 0 ? "bg-blue-100" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-2 flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs">📊</span>
                  </div>
                  {trade.order}
                </td>
                <td className="p-2">{trade.time}</td>
                <td className="p-2">{trade.type}</td>
                <td className="p-2">{trade.size}</td>
                <td className="p-2">{trade.symbol}</td>
                <td className="p-2">{trade.price}</td>
                <td className="p-2">{trade.sl}</td>
                <td className="p-2">{trade.tp}</td>
                <td className="p-2">{trade.currentPrice}</td>
                <td className="p-2">{trade.commission}</td>
                <td className="p-2 text-red-600 font-medium">{trade.swap}</td>
                <td className="p-2 text-red-600 font-medium flex items-center gap-1">
                  {trade.profit}
                  <X className="h-3 w-3" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

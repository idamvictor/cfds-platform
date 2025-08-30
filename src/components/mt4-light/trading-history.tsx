import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TradeHistoryItem {
  order: string
  time: string
  type: string
  size: string
  symbol: string
  price: string
  sl: string
  tp: string
  currentPrice: string
  commission: string
  swap: string
  profit: string
}

interface TradingHistoryProps {
  tradeHistory: TradeHistoryItem[]
}

export function TradingHistory({ tradeHistory }: TradingHistoryProps) {
  return (
    <div className="h-48 bg-white">
      <div className="border-b border-slate-300 px-4 py-2 flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-xs bg-blue-500 text-white">
          Trade
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          Account History
        </Button>
      </div>

      <div className="overflow-auto h-full">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-2 font-medium">Order</th>
              <th className="text-left p-2 font-medium">Time</th>
              <th className="text-left p-2 font-medium">Type</th>
              <th className="text-left p-2 font-medium">Size</th>
              <th className="text-left p-2 font-medium">Symbol</th>
              <th className="text-left p-2 font-medium">Price</th>
              <th className="text-left p-2 font-medium">S/L</th>
              <th className="text-left p-2 font-medium">T/P</th>
              <th className="text-left p-2 font-medium">Price</th>
              <th className="text-left p-2 font-medium">Commission</th>
              <th className="text-left p-2 font-medium">Swap</th>
              <th className="text-left p-2 font-medium">Profit</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.map((trade, index) => (
              <tr
                key={index}
                className={`border-b border-slate-100 ${index === 0 ? "bg-blue-50" : "hover:bg-slate-50"}`}
              >
                <td className="p-2 flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm flex items-center justify-center">
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
                <td className="p-2 text-red-600">{trade.swap}</td>
                <td className="p-2 text-red-600 flex items-center gap-1">
                  {trade.profit}
                  <X className="h-3 w-3" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

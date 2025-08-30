import { X } from "lucide-react";
import { useState } from "react";

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

interface AccountHistoryItem {
  order: string;
  time: string;
  type: string;
  size: string;
  symbol: string;
  price: string;
  commission: string;
  swap: string;
  profit: string;
}

interface TradingHistoryProps {
  tradeHistory: TradeHistoryItem[];
  accountHistory?: AccountHistoryItem[];
}

type TabType = "trade" | "account";

export function TradingHistory({
  tradeHistory,
  accountHistory = [],
}: TradingHistoryProps) {
  const [activeTab, setActiveTab] = useState<TabType>("trade");
  const renderTradeTable = () => (
    <table className="w-full text-xs">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          <th className="text-left p-2 font-medium text-slate-600">Order</th>
          <th className="text-left p-2 font-medium text-slate-600">Time</th>
          <th className="text-left p-2 font-medium text-slate-600">Type</th>
          <th className="text-left p-2 font-medium text-slate-600">Size</th>
          <th className="text-left p-2 font-medium text-slate-600">Symbol</th>
          <th className="text-left p-2 font-medium text-slate-600">Price</th>
          <th className="text-left p-2 font-medium text-slate-600">S/L</th>
          <th className="text-left p-2 font-medium text-slate-600">T/P</th>
          <th className="text-left p-2 font-medium text-slate-600">Price</th>
          <th className="text-left p-2 font-medium text-slate-600">
            Commission
          </th>
          <th className="text-left p-2 font-medium text-slate-600">Swap</th>
          <th className="text-left p-2 font-medium text-slate-600">Profit</th>
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
  );

  const renderAccountHistoryTable = () => (
    <table className="w-full text-xs">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          <th className="text-left p-2 font-medium text-slate-600">Order</th>
          <th className="text-left p-2 font-medium text-slate-600">Time</th>
          <th className="text-left p-2 font-medium text-slate-600">Type</th>
          <th className="text-left p-2 font-medium text-slate-600">Size</th>
          <th className="text-left p-2 font-medium text-slate-600">Symbol</th>
          <th className="text-left p-2 font-medium text-slate-600">Price</th>
          <th className="text-left p-2 font-medium text-slate-600">
            Commission
          </th>
          <th className="text-left p-2 font-medium text-slate-600">Swap</th>
          <th className="text-left p-2 font-medium text-slate-600">Profit</th>
        </tr>
      </thead>
      <tbody>
        {accountHistory.map((item, index) => (
          <tr
            key={index}
            className="border-b border-slate-200 text-slate-700 hover:bg-gray-50"
          >
            <td className="p-2">{item.order}</td>
            <td className="p-2">{item.time}</td>
            <td className="p-2">{item.type}</td>
            <td className="p-2">{item.size}</td>
            <td className="p-2">{item.symbol}</td>
            <td className="p-2">{item.price}</td>
            <td className="p-2">{item.commission}</td>
            <td className="p-2 text-red-600 font-medium">{item.swap}</td>
            <td className="p-2 text-red-600 font-medium">{item.profit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="h-48 bg-white flex flex-col">
      <div className="bg-slate-50 px-4 py-1 text-xs text-slate-600 border-b border-slate-200">
        Balance: 163960.19 USD Equity: 163960.19 Free Margin: 163960.19
      </div>
      <div className="overflow-auto flex-1">
        {activeTab === "trade"
          ? renderTradeTable()
          : renderAccountHistoryTable()}
      </div>

      <div className="flex items-center border-t border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab("trade")}
          className={`px-4 py-1.5 text-xs border-r border-slate-200 ${
            activeTab === "trade"
              ? "text-blue-600 bg-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Trade
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-1.5 text-xs ${
            activeTab === "account"
              ? "text-blue-600 bg-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Account History
        </button>
        <div className="ml-auto px-4 text-xs text-slate-500">Default</div>
        <div className="px-4 text-xs text-slate-500">230 / 15MB</div>
      </div>
    </div>
  );
}

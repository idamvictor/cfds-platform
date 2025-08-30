import { X } from "lucide-react";
import { useState } from "react";

const tradeHistory = [
  {
    order: "1602989",
    time: "2023.04.28-19:30:05",
    type: "Sell",
    size: "2.00",
    symbol: "gbpchf",
    price: "1.12259",
    sl: "1.8270660",
    tp: "1.8270660",
    currentPrice: "1.12425",
    commission: "0.00",
    swap: "-25.25",
    profit: "-371.16",
  },
  {
    order: "1602990",
    time: "2023.04.28-19:30:05",
    type: "Buy",
    size: "1.50",
    symbol: "eurusd",
    price: "1.08259",
    sl: "1.07660",
    tp: "1.09660",
    currentPrice: "1.08425",
    commission: "0.00",
    swap: "-15.25",
    profit: "245.16",
  },
  {
    order: "1602991",
    time: "2023.04.28-19:31:15",
    type: "Buy",
    size: "3.00",
    symbol: "usdjpy",
    price: "134.259",
    sl: "133.660",
    tp: "135.660",
    currentPrice: "134.425",
    commission: "0.00",
    swap: "-18.50",
    profit: "198.45",
  },
  {
    order: "1602992",
    time: "2023.04.28-19:32:30",
    type: "Sell",
    size: "1.75",
    symbol: "audusd",
    price: "0.66259",
    sl: "0.67660",
    tp: "0.64660",
    currentPrice: "0.66425",
    commission: "0.00",
    swap: "-12.75",
    profit: "-156.82",
  },
  {
    order: "1602993",
    time: "2023.04.28-19:33:45",
    type: "Buy",
    size: "2.25",
    symbol: "gbpusd",
    price: "1.24559",
    sl: "1.23660",
    tp: "1.25660",
    currentPrice: "1.24725",
    commission: "0.00",
    swap: "-22.00",
    profit: "287.34",
  },
];

const accountHistory = [
  {
    order: "1602985",
    time: "2023.04.28-18:30:05",
    type: "Buy",
    size: "1.00",
    symbol: "eurusd",
    price: "1.08159",
    commission: "0.00",
    swap: "-5.25",
    profit: "125.16",
  },
  {
    order: "1602984",
    time: "2023.04.28-17:45:05",
    type: "Sell",
    size: "2.00",
    symbol: "gbpusd",
    price: "1.25159",
    commission: "0.00",
    swap: "-12.25",
    profit: "-89.16",
  },
  {
    order: "1602983",
    time: "2023.04.28-17:15:22",
    type: "Buy",
    size: "1.50",
    symbol: "usdjpy",
    price: "133.859",
    commission: "0.00",
    swap: "-8.75",
    profit: "156.45",
  },
  {
    order: "1602982",
    time: "2023.04.28-16:55:18",
    type: "Sell",
    size: "2.50",
    symbol: "eurjpy",
    price: "147.559",
    commission: "0.00",
    swap: "-15.50",
    profit: "-178.92",
  },
  {
    order: "1602981",
    time: "2023.04.28-16:30:45",
    type: "Buy",
    size: "1.75",
    symbol: "audusd",
    price: "0.65959",
    commission: "0.00",
    swap: "-9.25",
    profit: "143.28",
  },
];

type TabType = "trade" | "account";

export function TradingHistory() {
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

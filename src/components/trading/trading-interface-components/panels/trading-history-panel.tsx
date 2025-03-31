import { ChevronDown, X } from "lucide-react";

export default function TradingHistoryPanel() {
  const tradingHistory = [
    {
      id: 1,
      time: "09:00",
      date: "Mar 26",
      pair: "AUD/CAD",
      type: "Forex",
      profit: "-$0.08",
      isPositive: false,
      amount: "1000.00 AUDCAD",
      fromPrice: "0.90395",
      toPrice: "0.90384",
    },
    {
      id: 2,
      time: "12:52",
      date: "Oct 20",
      pair: "Bitcoin",
      type: "Crypto",
      profit: "-$0.16",
      isPositive: false,
      amount: "0.01 BTCUSD",
      fromPrice: "68,436.0",
      toPrice: "68,419.9",
    },
    {
      id: 3,
      time: "16:16",
      date: "Sep 04",
      pair: "AUD/CHF",
      type: "Forex",
      profit: "+$70.33",
      isPositive: true,
      amount: "3000 AUDCHF",
      fromPrice: "0.59117",
      toPrice: "0.57127",
    },
    {
      id: 4,
      time: "16:16",
      date: "Sep 04",
      pair: "CAD/JPY",
      type: "Forex",
      profit: "+$9.32",
      isPositive: true,
      amount: "2000 CADJPY",
      fromPrice: "106.060",
      toPrice: "106.732",
    },
    {
      id: 5,
      time: "16:16",
      date: "Sep 04",
      pair: "EUR/SGD",
      type: "Forex",
      profit: "+$10.88",
      isPositive: true,
      amount: "3000 EURSGD",
      fromPrice: "1.44980",
      toPrice: "1.44507",
    },
    {
      id: 6,
      time: "16:07",
      date: "Sep 04",
      pair: "AUD/USD",
      type: "Forex",
      profit: "+$1.74",
      isPositive: true,
      amount: "3000 AUDUSD",
      fromPrice: "0.67798",
      toPrice: "0.67740",
    },
    {
      id: 7,
      time: "13:02",
      date: "Aug 22",
      pair: "Gold",
      type: "Metals",
      profit: "+$40.58",
      isPositive: true,
      amount: "2.00 XAUUSD",
      fromPrice: "2,519.92",
      toPrice: "2,499.63",
    },
  ];

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-medium">Trading History</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-px">
          {tradingHistory.map((trade) => (
            <div
              key={trade.id}
              className="p-3 border-b border-border hover:bg-muted/30"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{trade.time}</span>
                    <span className="text-xs text-muted-foreground">
                      {trade.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CurrencyFlag pair={trade.pair} />
                    <span className="text-sm">{trade.pair}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {trade.type}
                  </div>
                  <button className="text-xs text-muted-foreground flex items-center mt-1">
                    More <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      trade.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trade.profit}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {trade.amount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {trade.fromPrice} → {trade.toPrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CurrencyFlag({ pair }: { pair: string }) {
  if (pair === "Bitcoin") {
    return (
      <div className="h-5 w-5 rounded-full bg-[#F7931A] flex items-center justify-center">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.6408 14.9193L20.5295 7.0493C19.1168 3.5383 15.5068 1.7143 11.9955 2.6493L4.1255 5.0443C2.3368 5.5943 0.8995 6.9323 0.2555 8.6443C-0.3888 10.3568 -0.0328 12.2318 1.1048 13.7438L5.3908 20.2438C6.5285 21.7558 8.3175 22.6908 10.1748 22.6908C10.8188 22.6908 11.4628 22.5818 12.0715 22.3638L19.9415 19.2528C21.7302 18.7028 23.1675 17.3648 23.8115 15.6528C24.4555 13.9408 24.0995 12.0658 22.9618 10.5538L21.6335 8.6443"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.4776 14.3438C17.4776 14.3438 16.1493 15.8558 13.9296 16.5L11.9956 13.5273L9.99561 10.4053C11.9956 9.7613 13.4326 10.4053 13.4326 10.4053"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.0651 16.5C8.9271 16.9408 7.5991 16.5 7.5991 16.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.3672 10.4053C15.5052 9.9643 16.8332 10.4053 16.8332 10.4053"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  } else if (pair === "Gold") {
    return (
      <div className="h-5 w-5 rounded-full bg-[#FFD700] flex items-center justify-center text-black text-xs font-bold">
        Au
      </div>
    );
  } else {
    // For forex pairs
    const firstCurrency = pair.split("/")[0];
    let color = "bg-blue-500";

    if (firstCurrency === "AUD") color = "bg-blue-500";
    else if (firstCurrency === "CAD") color = "bg-red-500";
    else if (firstCurrency === "EUR") color = "bg-blue-600";
    else if (firstCurrency === "USD") color = "bg-green-500";

    return (
      <div
        className={`h-5 w-5 rounded-full ${color} flex items-center justify-center text-xs text-white`}
      >
        {firstCurrency.charAt(0)}
      </div>
    );
  }
}

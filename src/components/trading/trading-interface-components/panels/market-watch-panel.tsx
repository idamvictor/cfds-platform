"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MarketWatchPanelProps {
  addCurrencyPair: (pair: string) => void;
}

export default function MarketWatchPanel({
  addCurrencyPair,
}: MarketWatchPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Forex",
  ]);

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const categories = [
    {
      name: "Forex",
      count: 40,
      items: [
        {
          pair: "AUD/CAD",
          price: "0.90251",
          change: "+0.01%",
          isPositive: true,
        },
        {
          pair: "AUD/CHF",
          price: "0.55253",
          change: "-0.16%",
          isPositive: false,
        },
        {
          pair: "AUD/JPY",
          price: "93.526",
          change: "-0.31%",
          isPositive: false,
        },
        {
          pair: "AUD/NZD",
          price: "1.10033",
          change: "-0.05%",
          isPositive: false,
        },
        {
          pair: "AUD/USD",
          price: "0.62882",
          change: "-0.54%",
          isPositive: false,
        },
        {
          pair: "CAD/CHF",
          price: "0.61459",
          change: "-0.16%",
          isPositive: false,
        },
        {
          pair: "CAD/JPY",
          price: "104.231",
          change: "-0.31%",
          isPositive: false,
        },
        {
          pair: "CHF/JPY",
          price: "169.588",
          change: "-0.15%",
          isPositive: false,
        },
        {
          pair: "EUR/AUD",
          price: "1.73103",
          change: "+0.48%",
          isPositive: true,
        },
        {
          pair: "EUR/CAD",
          price: "1.55624",
          change: "+0.48%",
          isPositive: true,
        },
      ],
    },
    {
      name: "Stocks",
      count: 271,
      items: [
        { pair: "AAPL", price: "169.58", change: "+0.75%", isPositive: true },
        { pair: "MSFT", price: "417.88", change: "+0.32%", isPositive: true },
        { pair: "GOOGL", price: "147.60", change: "-0.21%", isPositive: false },
        { pair: "AMZN", price: "178.75", change: "+0.45%", isPositive: true },
        { pair: "TSLA", price: "172.63", change: "-1.23%", isPositive: false },
      ],
    },
    {
      name: "Indices",
      count: 20,
      items: [
        { pair: "US30", price: "39,118.5", change: "+0.32%", isPositive: true },
        {
          pair: "SPX500",
          price: "5,234.7",
          change: "+0.28%",
          isPositive: true,
        },
        {
          pair: "NSDQ100",
          price: "18,175.9",
          change: "+0.15%",
          isPositive: true,
        },
        {
          pair: "UK100",
          price: "7,930.4",
          change: "-0.12%",
          isPositive: false,
        },
        {
          pair: "GER40",
          price: "18,384.2",
          change: "+0.41%",
          isPositive: true,
        },
      ],
    },
    {
      name: "Crypto",
      count: 98,
      items: [
        {
          pair: "BTC/USD",
          price: "69,875.2",
          change: "+2.15%",
          isPositive: true,
        },
        {
          pair: "ETH/USD",
          price: "3,478.6",
          change: "+1.87%",
          isPositive: true,
        },
        {
          pair: "XRP/USD",
          price: "0.5423",
          change: "-0.32%",
          isPositive: false,
        },
        {
          pair: "SOL/USD",
          price: "178.45",
          change: "+3.21%",
          isPositive: true,
        },
        {
          pair: "ADA/USD",
          price: "0.4532",
          change: "-0.78%",
          isPositive: false,
        },
      ],
    },
    {
      name: "Commodities",
      count: 8,
      items: [
        { pair: "GOLD", price: "2,178.25", change: "+0.45%", isPositive: true },
        { pair: "SILVER", price: "24.87", change: "+0.32%", isPositive: true },
        { pair: "OIL", price: "81.45", change: "-0.78%", isPositive: false },
        { pair: "NATGAS", price: "1.78", change: "-1.23%", isPositive: false },
        { pair: "COPPER", price: "4.05", change: "+0.65%", isPositive: true },
      ],
    },
  ];

  return (
    <div className="h-full bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-medium mb-2">Market Watch</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8" />
        </div>
      </div>
      <div className="p-2">
        {categories.map((category) => (
          <div key={category.name} className="mb-1">
            <button
              className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted/50 rounded-md"
              onClick={() => toggleCategory(category.name)}
            >
              <div className="flex items-center">
                <CategoryIcon category={category.name} />
                <span className="font-medium ml-2">{category.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">
                  {category.count}
                </span>
                {expandedCategories.includes(category.name) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </button>

            {expandedCategories.includes(category.name) && (
              <div className="space-y-1 mt-1">
                {category.items.map((item) => (
                  <div
                    key={item.pair}
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer ml-2"
                    onClick={() => addCurrencyPair(item.pair)}
                  >
                    <div className="flex items-center">
                      <CurrencyFlag pair={item.pair} category={category.name} />
                      <span className="ml-2 text-sm">{item.pair}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{item.price}</span>
                      <span
                        className={`text-xs ${
                          item.isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case "Forex":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="6" y1="15" x2="18" y2="15"></line>
          <path d="M9 11l3-8 3 8"></path>
          <path d="M13 11l5 4-5 4"></path>
        </svg>
      );
    case "Stocks":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      );
    case "Indices":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 9h20M9 18l3-3 2 2 3-3"></path>
          <path d="M3 3v18h18"></path>
        </svg>
      );
    case "Crypto":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.5 9.5c.5-1 1.5-2 2.5-2 2 0 3 1.5 3 3 0 1.5-1 2-2 3-1 1-1.5 2-1.5 3"></path>
          <line x1="12" y1="19" x2="12" y2="19.01"></line>
        </svg>
      );
    case "Commodities":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3L4 9v12h16V9l-8-6z"></path>
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      );
  }
}

function CurrencyFlag({ pair, category }: { pair: string; category: string }) {
  const firstPart = pair.split("/")[0];
  let color = "bg-blue-500";

  if (category === "Forex") {
    // For forex pairs, use the first currency code
    color =
      firstPart === "AUD"
        ? "bg-blue-500"
        : firstPart === "EUR"
        ? "bg-yellow-500"
        : firstPart === "USD"
        ? "bg-green-500"
        : firstPart === "GBP"
        ? "bg-purple-500"
        : firstPart === "CAD"
        ? "bg-red-500"
        : firstPart === "CHF"
        ? "bg-red-500"
        : "bg-purple-500";
  } else if (category === "Crypto") {
    // For crypto, use specific colors
    color =
      firstPart === "BTC"
        ? "bg-orange-500"
        : firstPart === "ETH"
        ? "bg-purple-500"
        : firstPart === "XRP"
        ? "bg-blue-500"
        : firstPart === "SOL"
        ? "bg-green-500"
        : firstPart === "ADA"
        ? "bg-blue-400"
        : "bg-gray-500";
  } else if (category === "Stocks") {
    // For stocks, use a generic blue
    color = "bg-blue-600";
  } else if (category === "Indices") {
    // For indices, use specific colors
    color =
      pair === "US30"
        ? "bg-blue-500"
        : pair === "SPX500"
        ? "bg-green-500"
        : pair === "NSDQ100"
        ? "bg-purple-500"
        : pair === "UK100"
        ? "bg-red-500"
        : pair === "GER40"
        ? "bg-yellow-500"
        : "bg-gray-500";
  } else if (category === "Commodities") {
    // For commodities, use specific colors
    color =
      pair === "GOLD"
        ? "bg-yellow-500"
        : pair === "SILVER"
        ? "bg-gray-400"
        : pair === "OIL"
        ? "bg-black"
        : pair === "NATGAS"
        ? "bg-blue-500"
        : pair === "COPPER"
        ? "bg-orange-600"
        : "bg-gray-500";
  }

  return (
    <div
      className={`h-5 w-5 rounded-full ${color} flex items-center justify-center text-xs text-white`}
    >
      {firstPart.charAt(0)}
    </div>
  );
}

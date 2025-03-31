import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActiveOrdersPanel() {
  const [activeTab, setActiveTab] = useState("active");

  const activeOrders = [
    {
      id: 1,
      asset: "Ethereum Classic",
      icon: "eth",
      profit: "+$0.02",
      percentage: "+8.44%",
      isPositive: true,
    },
    {
      id: 2,
      asset: "Ethereum Classic",
      icon: "eth",
      profit: "-$0.02",
      percentage: "-8.60%",
      isPositive: false,
    },
    {
      id: 3,
      asset: "Tron",
      icon: "trx",
      profit: "+$0.00",
      percentage: "+3.48%",
      isPositive: true,
    },
  ];

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-medium">Active Orders</h2>
        <button className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="bg-transparent h-10 p-0 border-b border-border rounded-none">
          <TabsTrigger
            value="active"
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full"
          >
            <span className="text-xs font-medium text-primary">ACTIVE</span>
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full"
          >
            <span className="text-xs font-medium">PENDING</span>
          </TabsTrigger>
        </TabsList>

        <div className="p-3">
          <div className="bg-muted/50 rounded-md p-3 mb-3">
            <span className="text-sm">All Positions</span>
          </div>

          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div key={order.id} className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CryptoIcon type={order.icon} />
                    <span className="text-sm">{order.asset}</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      order.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.profit}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <button className="text-xs text-muted-foreground flex items-center">
                    Show more <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                  <span
                    className={`text-xs ${
                      order.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function CryptoIcon({ type }: { type: string }) {
  if (type === "eth") {
    return (
      <div className="h-5 w-5 rounded-full bg-[#627EEA] flex items-center justify-center">
        <svg
          width="10"
          height="16"
          viewBox="0 0 10 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.99967 0L4.89648 0.351484V10.9451L4.99967 11.0483L9.99935 8.0217L4.99967 0Z"
            fill="white"
          />
          <path
            d="M4.99957 0L0 8.0217L4.99957 11.0483V5.91507V0Z"
            fill="white"
            fillOpacity="0.8"
          />
          <path
            d="M4.99957 11.9717L4.94043 12.0431V15.8318L4.99957 15.9999L10.0009 8.94629L4.99957 11.9717Z"
            fill="white"
          />
          <path
            d="M4.99957 16.0001V11.9717L0 8.94629L4.99957 16.0001Z"
            fill="white"
            fillOpacity="0.8"
          />
          <path
            d="M4.99957 11.0483L9.99925 8.02174L4.99957 5.91504V11.0483Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            d="M0 8.02174L4.99957 11.0483V5.91504L0 8.02174Z"
            fill="white"
            fillOpacity="0.3"
          />
        </svg>
      </div>
    );
  } else if (type === "trx") {
    return (
      <div className="h-5 w-5 rounded-full bg-[#EF0027] flex items-center justify-center">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 3L9.5 1L7.5 9L4 5.5L2.5 3Z"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="h-5 w-5 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white">
      ?
    </div>
  );
}

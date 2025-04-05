// import { useState } from "react";
// import { ChevronDown, X } from "lucide-react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function ActiveOrdersPanel() {
//   const [activeTab, setActiveTab] = useState("active");

//   const activeOrders = [
//     {
//       id: 1,
//       asset: "Ethereum Classic",
//       icon: "eth",
//       profit: "+$0.02",
//       percentage: "+8.44%",
//       isPositive: true,
//     },
//     {
//       id: 2,
//       asset: "Ethereum Classic",
//       icon: "eth",
//       profit: "-$0.02",
//       percentage: "-8.60%",
//       isPositive: false,
//     },
//     {
//       id: 3,
//       asset: "Tron",
//       icon: "trx",
//       profit: "+$0.00",
//       percentage: "+3.48%",
//       isPositive: true,
//     },
//   ];

//   return (
//     <div className="h-full bg-background flex flex-col">
//       <div className="flex items-center justify-between p-4 border-b border-border">
//         <h2 className="text-sm font-medium">Active Orders</h2>
//         <button className="text-muted-foreground hover:text-foreground">
//           <X className="h-4 w-4" />
//         </button>
//       </div>

//       <Tabs
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="flex-1 flex flex-col"
//       >
//         <TabsList className="bg-transparent h-10 p-0 border-b border-border rounded-none">
//           <TabsTrigger
//             value="active"
//             className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full"
//           >
//             <span className="text-xs font-medium text-primary">ACTIVE</span>
//           </TabsTrigger>
//           <TabsTrigger
//             value="pending"
//             className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full"
//           >
//             <span className="text-xs font-medium">PENDING</span>
//           </TabsTrigger>
//         </TabsList>

//         <div className="p-3">
//           <div className="bg-muted/50 rounded-md p-3 mb-3">
//             <span className="text-sm">All Positions</span>
//           </div>

//           <div className="space-y-3">
//             {activeOrders.map((order) => (
//               <div key={order.id} className="border-b border-border pb-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <CryptoIcon type={order.icon} />
//                     <span className="text-sm">{order.asset}</span>
//                   </div>
//                   <span
//                     className={`text-sm font-medium ${
//                       order.isPositive ? "text-green-500" : "text-red-500"
//                     }`}
//                   >
//                     {order.profit}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between mt-1">
//                   <button className="text-xs text-muted-foreground flex items-center">
//                     Show more <ChevronDown className="h-3 w-3 ml-1" />
//                   </button>
//                   <span
//                     className={`text-xs ${
//                       order.isPositive ? "text-green-500" : "text-red-500"
//                     }`}
//                   >
//                     {order.percentage}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Tabs>
//     </div>
//   );
// }

// function CryptoIcon({ type }: { type: string }) {
//   if (type === "eth") {
//     return (
//       <div className="h-5 w-5 rounded-full bg-[#627EEA] flex items-center justify-center">
//         <svg
//           width="10"
//           height="16"
//           viewBox="0 0 10 16"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M4.99967 0L4.89648 0.351484V10.9451L4.99967 11.0483L9.99935 8.0217L4.99967 0Z"
//             fill="white"
//           />
//           <path
//             d="M4.99957 0L0 8.0217L4.99957 11.0483V5.91507V0Z"
//             fill="white"
//             fillOpacity="0.8"
//           />
//           <path
//             d="M4.99957 11.9717L4.94043 12.0431V15.8318L4.99957 15.9999L10.0009 8.94629L4.99957 11.9717Z"
//             fill="white"
//           />
//           <path
//             d="M4.99957 16.0001V11.9717L0 8.94629L4.99957 16.0001Z"
//             fill="white"
//             fillOpacity="0.8"
//           />
//           <path
//             d="M4.99957 11.0483L9.99925 8.02174L4.99957 5.91504V11.0483Z"
//             fill="white"
//             fillOpacity="0.5"
//           />
//           <path
//             d="M0 8.02174L4.99957 11.0483V5.91504L0 8.02174Z"
//             fill="white"
//             fillOpacity="0.3"
//           />
//         </svg>
//       </div>
//     );
//   } else if (type === "trx") {
//     return (
//       <div className="h-5 w-5 rounded-full bg-[#EF0027] flex items-center justify-center">
//         <svg
//           width="12"
//           height="12"
//           viewBox="0 0 12 12"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M2.5 3L9.5 1L7.5 9L4 5.5L2.5 3Z"
//             fill="white"
//             stroke="white"
//             strokeWidth="0.5"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className="h-5 w-5 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white">
//       ?
//     </div>
//   );
// }


"use client";

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

  const pendingOrders = [
    {
      id: 1,
      asset: "Bitcoin",
      icon: "btc",
      type: "Buy Limit",
      price: "$68,450.00",
      amount: "0.015 BTC",
    },
    {
      id: 2,
      asset: "EUR/USD",
      icon: "eur",
      type: "Sell Stop",
      price: "1.0725",
      amount: "10,000 EUR",
    },
    {
      id: 3,
      asset: "Gold",
      icon: "gold",
      type: "Buy Stop",
      price: "$2,520.75",
      amount: "1.5 oz",
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
            <span
              className={`text-xs font-medium ${
                activeTab === "active"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              ACTIVE
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full"
          >
            <span
              className={`text-xs font-medium ${
                activeTab === "pending"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              PENDING
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="p-3">
          <div className="bg-muted/50 rounded-md p-3 mb-3">
            <span className="text-sm">All Positions</span>
          </div>

          {activeTab === "active" ? (
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
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div key={order.id} className="border-b border-border pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CryptoIcon type={order.icon} />
                      <span className="text-sm">{order.asset}</span>
                    </div>
                    <span className="text-sm font-medium">{order.type}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <button className="text-xs text-muted-foreground flex items-center">
                      Show more <ChevronDown className="h-3 w-3 ml-1" />
                    </button>
                    <div className="text-right">
                      <div className="text-xs">{order.price}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.amount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  } else if (type === "btc") {
    return (
      <div className="h-5 w-5 rounded-full bg-[#F7931A] flex items-center justify-center">
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.64 4.32C8.04 4.12 8.31 3.72 8.24 3.13C8.15 2.36 7.45 2.08 6.56 2.01L6.56 0.83H5.87L5.87 1.99C5.69 1.99 5.5 1.99 5.31 2L5.31 0.83H4.62L4.62 2.01L3.54 2.01V2.01L2.67 2.01L2.67 2.74C2.67 2.74 3.18 2.73 3.17 2.74C3.44 2.74 3.54 2.91 3.57 3.05L3.57 4.42V6.43C3.55 6.52 3.49 6.65 3.3 6.65C3.31 6.66 2.8 6.65 2.8 6.65L2.67 7.46H3.54C3.71 7.46 3.87 7.46 4.03 7.46L4.03 8.65H4.72L4.72 7.47C4.91 7.48 5.09 7.48 5.27 7.48L5.27 8.65H5.96L5.96 7.46C7.11 7.4 7.93 7.11 8.1 6.02C8.24 5.13 7.83 4.67 7.64 4.32Z"
            fill="white"
          />
          <path
            d="M6.02 6.02C5.75 6.29 5.13 6.2 4.7 6.2C4.27 6.2 3.64 6.28 3.37 6.02C3.1 5.75 3.19 5.13 3.19 4.7C3.19 4.27 3.11 3.64 3.37 3.37C3.64 3.1 4.26 3.19 4.7 3.19C5.13 3.19 5.76 3.11 6.02 3.37C6.29 3.64 6.2 4.26 6.2 4.7C6.2 5.13 6.29 5.75 6.02 6.02Z"
            fill="#F7931A"
          />
          <path
            d="M5.6 4.7C5.6 4.09 4.74 4.35 4.5 4.35L4.5 5.05C4.75 5.05 5.6 5.32 5.6 4.7Z"
            fill="white"
          />
          <path
            d="M4.5 3.85L4.5 4.48C4.7 4.48 5.4 4.27 5.4 3.75C5.4 3.22 4.7 3.85 4.5 3.85Z"
            fill="white"
          />
        </svg>
      </div>
    );
  } else if (type === "eur") {
    return (
      <div className="h-5 w-5 rounded-full bg-[#0052B4] flex items-center justify-center">
        <span className="text-xs text-white font-semibold">€</span>
      </div>
    );
  } else if (type === "gold") {
    return (
      <div className="h-5 w-5 rounded-full bg-[#FFD700] flex items-center justify-center text-black text-xs font-bold">
        Au
      </div>
    );
  }

  return (
    <div className="h-5 w-5 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white">
      {type.charAt(0).toUpperCase()}
    </div>
  );
}


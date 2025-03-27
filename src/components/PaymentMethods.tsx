import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Cloud, CreditCard, Banknote } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  processingTime: string;
  path: string;
}

const PaymentMethods: React.FC = () => {
  const location = useLocation();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "bitcoin",
      name: "Bitcoin Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/crypto",
    },
    {
      id: "litecoin",
      name: "Litecoin Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/litecoin",
    },
    {
      id: "polyswarm",
      name: "Polyswarm Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/polyswarm",
    },
    {
      id: "dogecoin",
      name: "DogeCoin Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/dogecoin",
    },
    {
      id: "binance",
      name: "Binance Coin Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/binance",
    },
    {
      id: "ethereum",
      name: "Ethereum Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/ethereum",
    },
    {
      id: "usdt-erc20",
      name: "USDT ERC20 Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/erc20",
    },
    {
      id: "usdt-trc20",
      name: "USDT TRC20 Wallet",
      icon: <Cloud className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/trc20",
    },
    {
      id: "credit-card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/card",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: <Banknote className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/bank",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <CreditCard className="h-5 w-5 opacity-70" />,
      processingTime: "5-10 minutes",
      path: "/deposit/paypal",
    },
    {
      id: "other",
      name: "Other",
      icon: (
        <div className="h-5 w-5 opacity-70 grid grid-cols-2 gap-0.5">
          <div className="bg-muted-foreground rounded-sm"></div>
          <div className="bg-muted-foreground rounded-sm"></div>
          <div className="bg-muted-foreground rounded-sm"></div>
          <div className="bg-muted-foreground rounded-sm"></div>
        </div>
      ),
      processingTime: "5-10 minutes",
      path: "/deposit/other",
    },
  ];

  // Function to check if a method is active
  const isMethodActive = (path: string) => {
    const currentPath = location.pathname;

    // For main categories
    return currentPath === path;
  };

  return (
    <div>
      <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2 px-2">
        METHODS
      </h3>

      <div className="space-y-1">
        {paymentMethods.map((method) => (
          <Link
            key={method.id}
            to={method.path}
            className={`flex items-center gap-3 py-3 px-4 w-full border-l-4 border-transparent hover:bg-secondary/30 transition-all duration-200 rounded-sm ${
              isMethodActive(method.path)
                ? "border-l-4 border-accent bg-secondary/40"
                : ""
            }`}
          >
            <span className="text-muted-foreground w-7">{method.icon}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{method.name}</p>
              <p className="text-xs text-muted-foreground">{method.processingTime}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

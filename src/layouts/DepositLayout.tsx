import { Link, Outlet } from "react-router-dom";
import PaymentMethods from "@/components/PaymentMethods";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Cloud, CreditCard, SquareChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const paymentMethods = [
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

const DepositLayout = () => {
  return (
    <div className="animate-fade-in pt-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">DEPOSIT</h1>

        {/* Dropdown for smaller screens */}
        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SquareChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Payment Methods</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {paymentMethods.map((method) => (
                  <DropdownMenuItem key={method.id}>
                    <Link to={method.path}>{method.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar with payment methods */}
        <div className="md:w-64 shrink-0">
          <PaymentMethods paymentMethods={paymentMethods} />
        </div>

        {/* Right content area */}
        <Card className="flex-1 items-start">
          <CardContent className="p-6">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepositLayout;

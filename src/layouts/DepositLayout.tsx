import { Link, Outlet } from "react-router-dom";
import PaymentMethods from "@/components/PaymentMethods";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Cloud, CreditCard, SquareChevronDown } from "lucide-react";
import useDataStore from "@/store/dataStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

// Static payment methods that are always available
const staticPaymentMethods = [
  {
    id: "credit-card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="h-5 w-5 opacity-70" />,
    processingTime: "5-10 minutes",
    path: "/main/deposit/card",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: <Banknote className="h-5 w-5 opacity-70" />,
    processingTime: "5-10 minutes",
    path: "/main/deposit/bank",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <CreditCard className="h-5 w-5 opacity-70" />,
    processingTime: "5-10 minutes",
    path: "/main/deposit/paypal",
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
    path: "/main/deposit/other",
  },
];

const DepositLayout = () => {
  const { data, fetchData } = useDataStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate payment methods from wallets
  const paymentMethods = [
    ...(data?.wallets
      .filter((wallet) => wallet.is_general === 1 && wallet.is_active === 1)
      .map((wallet) => ({
        id: wallet.crypto.toLowerCase(),
        name: `${wallet.crypto} Wallet`,
        icon: <Cloud className="h-5 w-5 opacity-70" />,
        processingTime: "5-10 minutes",
        path: `/main/deposit/${wallet.crypto.toLowerCase()}`,
      })) || []),
    ...staticPaymentMethods,
  ];

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
                  <DropdownMenuItem key={method.id} asChild>
                    <Link to={method.path} className="w-full">
                      {method.name}
                    </Link>
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
        <Card className="items-start flex-1 rounded-none">
          <CardContent className="md:p-6 min-h-screen">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepositLayout;

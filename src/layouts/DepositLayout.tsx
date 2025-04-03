import { Outlet } from "react-router-dom";
import PaymentMethods from "@/components/PaymentMethods";
import { Card, CardContent } from "@/components/ui/card";

const DepositLayout = () => {
  return (
    <div className="animate-fade-in pt-3">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        DEPOSIT
      </h1>

      <div className="flex gap-6">
        {/* Left sidebar with payment methods */}
        <div className="w-64 shrink-0">
          <PaymentMethods />
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

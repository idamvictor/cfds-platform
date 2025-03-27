import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export function AccountSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Account</h2>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Balance</span>
            <span className="text-success font-medium">$ 610.05</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Leverage</span>
            <span className="text-primary font-medium">1:20</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Credit</span>
            <span className="text-primary font-medium">$ 0.00</span>
          </div>
          <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
            Trade Now
          </Button>
        </div>
      </div>
    </div>
  );
}

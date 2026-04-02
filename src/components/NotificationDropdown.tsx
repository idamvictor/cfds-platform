import React from "react";
import { Bell, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NotificationDropdown: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-white"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-bold text-base">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Info className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-sm">Deposit Successful</span>
              <span className="ml-auto text-[10px] text-muted-foreground">2m ago</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
              Your deposit of <span className="text-foreground font-medium">$2,500.00</span> has been confirmed. Your balance has been updated.
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-sm">KYC Approved</span>
              <span className="ml-auto text-[10px] text-muted-foreground">1h ago</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
              Congratulations! Your identity verification has been completed successfully. You now have full access to all features.
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-sm">Withdrawal Processed</span>
              <span className="ml-auto text-[10px] text-muted-foreground">5h ago</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
              Your withdrawal request for <span className="text-foreground font-medium">$500.00</span> has been processed and sent to your wallet.
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer opacity-70">
            <div className="flex items-center gap-2 w-full">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500/10 text-gray-500">
                <Info className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-sm">System Update</span>
              <span className="ml-auto text-[10px] text-muted-foreground">Yesterday</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
              We've upgraded our trading engine to provide faster execution speeds and better stability.
            </p>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full justify-center text-primary font-medium text-xs cursor-pointer hover:bg-primary/10">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;

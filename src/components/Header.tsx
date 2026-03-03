import React, { useState } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, Menu, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import DepositFunds from "./deposit-funds/DepositFunds";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const { formatCurrency } = useCurrency();
  const balance = user?.balance || 0;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <Button
          className="md:hidden p-2 rounded bg-primary text-white"
          onClick={toggleSidebar}
        >
          <Menu className="h-10 w-10" />
        </Button>
        <Logo />
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="hidden sm:block header-action-button withdraw-button"
          onClick={() => navigate("/main/withdrawal")}
        >
          Withdraw
        </Button>

        <Button
          className="header-action-button deposit-button"
          onClick={() => navigate("/main/deposit")}
        >
          Deposit
        </Button>

        <Button onClick={() => setIsDepositModalOpen(true)}>
          Deposit Funds
        </Button>

        {/* Balance Display */}
        <div className="hidden lg:flex flex-col px-4 py-2.5 rounded-lg border-0 transition-all">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(balance)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={
                  user?.account_type?.image ||
                  "https://res.cloudinary.com/dyp8gtllq/image/upload/v1744370355/main_plate_exi8jv.png"
                }
                alt="Account Badge"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-gray-300">
              {user?.account_type?.name || "Standard"}
            </span>
            <span className="text-xs text-gray-400">›</span>
          </div>
        </div>

        <Button
          className="header-action-button trade-button flex items-center gap-2"
          onClick={() => window.open("/trading", "_blank")}
        >
          <BarChart className="h-4 w-4" />
          <span>Trade Room</span>
        </Button>
      </div>

      {/* Deposit Funds Dialog */}
      <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
        <DialogContent
          className="!max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4 md:mx-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {" "}
              <h1 className="text-2xl font-bold text-foreground">
                DEPOSIT FUNDS
              </h1>
            </DialogTitle>
          </DialogHeader>
          <DepositFunds />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;

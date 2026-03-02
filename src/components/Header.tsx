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

        <Button
          className="header-action-button trade-button flex items-center gap-2"
          onClick={() => window.open("/trading", "_blank")}
        >
          <BarChart className="h-4 w-4" />
          <span>Trade Room</span>
        </Button>

        {/* Balance Display */}
        <div
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border border-border transition-all hover:border-primary/50"
          style={{
            background:
              "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1))",
          }}
        >
          <Wallet className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Balance</span>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      </div>

      {/* Deposit Funds Dialog */}
      <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
        <DialogContent className="!max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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

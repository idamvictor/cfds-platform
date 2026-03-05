import React, { useState } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, Wallet, BarChart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import DepositFunds from "./deposit-funds/DepositFunds";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";
import useSiteSettingsStore from "@/store/siteSettingStore";
import AccountPlansModal from "./AccountPlanModal";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const useDepositModal = useSiteSettingsStore(
    (state) => state.settings?.use_deposit_modal === true,
  );

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
          onClick={() => window.open("/trading", "_blank")}
          className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
        >
          <BarChart className="h-4 w-4" />
          Trade Room
        </Button>

        <Button
          onClick={() =>
            useDepositModal
              ? setIsDepositModalOpen(true)
              : navigate("/main/deposit")
          }
          className="text-white"
        >
          {useDepositModal ? "Deposit Funds" : "Deposit"}
        </Button>

        {/* Balance Display */}
        <div className="hidden lg:flex flex-col px-4 py-2.5 rounded-lg border-0 transition-all">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(balance)}
            </span>
          </div>
          <button
            onClick={() => setIsPlansModalOpen(true)}
            className="flex items-center gap-1.5 mt-1 hover:opacity-80 transition-opacity cursor-pointer"
          >
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
              {user?.account_type?.title || ""}
            </span>
            <span className="text-xs text-gray-400">›</span>
          </button>
        </div>
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

      {/* Account Plans Modal */}
      <AccountPlansModal
        open={isPlansModalOpen}
        onOpenChange={setIsPlansModalOpen}
      />
    </header>
  );
};

export default Header;

import React from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import {useNavigate} from "react-router-dom";
import {BarChart, Menu} from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const navigate = useNavigate();


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

              <Button
                  className="header-action-button trade-button flex items-center gap-2"
                  onClick={() => navigate("/trading")}
              >
                  <BarChart className="h-4 w-4" />
                  <span>Trade Room</span>
              </Button>

          </div>

      </header>
  );
};

export default Header;

import React from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-trading-dark border-b border-border/20">
      <Logo />
      <Button className="animate-scale-in bg-trading-green text-white font-medium py-2 px-6 rounded-md transition-all">
        Start Trading
      </Button>
    </header>
  );
};

export default Header;

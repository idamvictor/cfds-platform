import React from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded bg-primary text-white"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <Logo />
      </div>
      <Button className="animate-scale-in bg-primary font-medium py-2 px-6 rounded-md transition-all">
        <Link to="/trading">Start Trading</Link>
      </Button>
    </header>
  );
};

export default Header;

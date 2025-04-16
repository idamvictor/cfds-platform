import React from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-secondary border-b border-border">
      <div className="flex items-center gap-4">
        <Button
          className="md:hidden p-2 rounded bg-primary text-white"
          onClick={toggleSidebar}
        >
          <Menu className="h-10 w-10" />
        </Button>
        <Logo />
      </div>
      <Link to="/trading">
        <Button className="animate-scale-in bg-primary font-medium py-2 px-6 rounded-md transition-all">
          Start Trading
        </Button>
      </Link>
    </header>
  );
};

export default Header;

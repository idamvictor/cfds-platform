import { Mail, Phone, Settings, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Maximize, Minimize } from "react-feather";
import { Link } from "react-router-dom";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="flex md:justify-between items-center bg-background text-muted-foreground p-2 text-xs border-t-2 border-secondary mt-2">
      {/* Left Section */}
      <div className="hidden md:flex items-center gap-2">
        <Phone size={14} />
        <span>support@cfds-capital.com</span>
        <span>EVERY DAY, AROUND THE CLOCK</span>
      </div>

      {/* Right Section */}
      <div className=" w-full">
        <div className="flex items-center justify-self-end gap-4">
          <Link to="/main/chat" className="flex gap-1 items-center">
            <Mail size={14} />
            <span>LIVE CHAT</span>
          </Link>
          <Link to="/main/settings">
            <Settings size={14} />
          </Link>
          <Volume2 size={14} />
          <span>Current Time: {currentTime}</span>
          {isFullScreen ? (
            <Minimize
              size={14}
              onClick={handleFullScreen}
              className="cursor-pointer"
            />
          ) : (
            <Maximize
              size={14}
              onClick={handleFullScreen}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

import {  Mail, Settings, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { Maximize, Minimize } from "react-feather";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import AccountPlansModal from "@/components/AccountPlanModal.tsx";
import useSoundStore from "@/store/soundStore";
import useUserStore from "@/store/userStore.ts";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const { isSoundEnabled, toggleSound } = useSoundStore();

  const user = useUserStore((state) => state.user);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const headerStyle = {
    backgroundColor: user?.account_type.color || "gray"
  };

  return (
    <div className="flex justify-between items-center bg-background text-muted-foreground p-2 text-xs border-t-2 border-secondary mt-2">
      {/* Left Section */}
      { user?.account_type ? (
          <div className="hidden md:flex">
            <Button
                style={headerStyle}
                onClick={() => setIsPlansModalOpen(true)}
                className="text-white cursor-pointer font-medium rounded-md shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-1">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm">
                  <img
                      src={user?.account_type?.icon}
                      alt={`${user?.account_type?.title} icon`}
                      className="w-4 h-4 object-contain"
                  />
                </div>
                <div className="flex flex-col items-start">
              <span className="text-xs text-white font-bold">
                { user?.account_type?.title }
              </span>
                </div>
              </div>
            </Button>
          </div>
      ) : null}

      {/* Right Section */}
      <div className="">
        <div className="flex items-center justify-self-end gap-4">
          <Link to="/main/chat" className="flex gap-1 items-center">
            <Mail size={14} />
            <span>LIVE CHAT</span>
          </Link>
          <Link to="/main/settings">
            <Settings size={14} />
          </Link>
          <button onClick={toggleSound} className="cursor-pointer">
            {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

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
      <AccountPlansModal
        open={isPlansModalOpen}
        onOpenChange={setIsPlansModalOpen}
      />
    </div>
  );
}

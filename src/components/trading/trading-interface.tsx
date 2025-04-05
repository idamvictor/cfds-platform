import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Move, X, ChevronUp } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Toaster } from "sonner";

// Import trading interface components
import { VolumeControl } from "@/components/trading/trading-interface-components/volume-control";
import { ProfitCalculator } from "@/components/trading/trading-interface-components/profit-calculator";
import { TakeProfitStopLoss } from "@/components/trading/trading-interface-components/take-profit-stop-loss";
import { PendingOrder } from "@/components/trading/trading-interface-components/pending-order";
import { MarketActions } from "@/components/trading/trading-interface-components/market-actions";
import { TradingDetails } from "@/components/trading/trading-interface-components/trading-details";

export default function TradingInterface() {
  const [volume, setVolume] = useState(0.01);
  const [activeTab, setActiveTab] = useState("lots");

  const isMobile = useMobile(1024); // Match the lg breakpoint
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const miniRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  useEffect(() => {
    if (!isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(window.innerWidth - 150, e.clientX - dragOffset.x)
        );
        const newY = Math.max(
          0,
          Math.min(window.innerHeight - 150, e.clientY - dragOffset.y)
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const touch = e.touches[0];
        const newX = Math.max(
          0,
          Math.min(window.innerWidth - 150, touch.clientX - dragOffset.x)
        );
        const newY = Math.max(
          0,
          Math.min(window.innerHeight - 150, touch.clientY - dragOffset.y)
        );
        setPosition({ x: newX, y: newY });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, dragOffset, isMobile]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!miniRef.current) return;

    setIsDragging(true);

    if ("touches" in e && e.touches[0]) {
      const touch = e.touches[0];
      const rect = miniRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    } else if ("clientX" in e) {
      const rect = miniRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Full trading interface content
  const FullTradingInterface = () => (
    <Card className="w-full max-w-[300px] bg-muted/50 border-muted">
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          {/* Volume Control */}
          <VolumeControl
            volume={volume}
            setVolume={setVolume}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Trading Details */}
          <TradingDetails />

          {/* Profit Calculator Button */}
          <ProfitCalculator />

          {/* Take Profit & Stop Loss */}
          <TakeProfitStopLoss />

          {/* Pending Button */}
          <PendingOrder />
        </div>

        <Separator />

        {/* Market Section */}
        <div className="p-4">
          <MarketActions />
        </div>
      </CardContent>
    </Card>
  );

  // Desktop version (sidebar)
  if (!isMobile) {
    return (
      <div className="w-[300px] border-l border-border overflow-y-auto">
        <Toaster />
        <div className="flex items-center justify-center p-4">
          <FullTradingInterface />
        </div>
      </div>
    );
  }

  // Mobile version (floating mini + modal)
  return (
    <>
      <Toaster />
      {/* Floating mini trading interface */}
      <div
        ref={miniRef}
        className="fixed z-40 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "140px",
          transition: isDragging ? "none" : "all 0.2s ease",
        }}
      >
        <div
          className="bg-muted/30 p-2 cursor-move flex items-center justify-between"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <Move className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">Trading</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0"
            onClick={() => setIsModalOpen(true)}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
        </div>

        <div className="p-2 space-y-2">
          <div className="grid grid-cols-2 gap-1">
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 h-auto"
            >
              BUY
              <br />
              93.153
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 h-auto"
            >
              SELL
              <br />
              93.147
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium text-green-500">
              {volume.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Margin:</span>
            <span className="font-medium text-green-500">$31.24</span>
          </div>
        </div>
      </div>

      {/* Full trading interface modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <div className="flex items-center justify-between p-4">
            <h3 className="text-lg font-medium">Trading Interface</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-4 pb-4">
            <FullTradingInterface />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


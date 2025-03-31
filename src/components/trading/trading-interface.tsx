"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sonner } from "@/components/ui/sonner";

import { VolumeControl } from "@/components/trading/trading-interface-components/volume-control";
import { TradingDetails } from "@/components/trading/trading-interface-components/trading-details";
import { ProfitCalculator } from "@/components/trading/trading-interface-components/profit-calculator";
import { TakeProfitStopLoss } from "@/components/trading/trading-interface-components/take-profit-stop-loss";
import { PendingOrder } from "@/components/trading/trading-interface-components/pending-order";
import { MarketActions } from "@/components/trading/trading-interface-components/market-actions";

export default function TradingInterface() {
  const [volume, setVolume] = useState(0.01);
  const [activeTab, setActiveTab] = useState("lots");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Sonner />
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
    </div>
  );
}

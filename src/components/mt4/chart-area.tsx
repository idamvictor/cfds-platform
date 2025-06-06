// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { BarChart3 } from "lucide-react";

import TradingViewWidget from "../trading/trading-interface-components/trading-view-widget";

export default function ChartArea() {
  return (
    <div className="flex-1 bg-[#1C2030] relative">
      <TradingViewWidget />
    </div>
  );
}

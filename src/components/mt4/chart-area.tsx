import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ChartArea() {
  return (
    <div className="flex-1 bg-slate-900 p-4 relative">
      {/* Trading Controls */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <Button className="bg-green-600 hover:bg-green-700 px-8 py-2">
          BUY
          <div className="text-xs mt-1">43702.10</div>
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 px-8 py-2">
          SELL
          <div className="text-xs mt-1">43702.10</div>
        </Button>
      </div>

      {/* Chart Placeholder */}
      <Card className="h-full bg-slate-800 border-slate-700">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              Trading Chart
            </h3>
            <p className="text-slate-500">Candlestick chart placeholder</p>
            <p className="text-xs text-slate-600 mt-2">
              Chart component will be implemented here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Price Levels */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
        <div className="bg-green-600 px-2 py-1 rounded text-xs">1198.69</div>
        <div className="bg-blue-600 px-2 py-1 rounded text-xs">1193.55</div>
      </div>
    </div>
  );
}

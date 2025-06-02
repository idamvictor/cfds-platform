import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronDown, TrendingUp } from "lucide-react";

export default function MarketWatch() {
  return (
    <div className="h-full flex flex-col">
      {/* Market Watch Header - Fixed */}
      <div className="p-4 border-b border-slate-700 bg-slate-800 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Market Watch: 22:56:59</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Market"
            className="w-full bg-slate-700 border border-slate-600 rounded px-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Market Data - Scrollable */}
      <div className="flex-1 min-h-0 p-4 bg-slate-800 overflow-auto">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-500" />
              <h3 className="font-semibold text-slate-300 mb-2">Market Data</h3>
              <p className="text-sm text-slate-500">
                Currency pairs and pricing
              </p>
              <p className="text-xs text-slate-600 mt-2">
                Market listing component will be implemented here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

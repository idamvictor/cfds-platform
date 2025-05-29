import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Search, ChevronDown, TrendingUp, User, X } from "lucide-react";

export default function RightPanels() {
  return (
    <aside className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* Market Watch Header */}
      <div className="p-4 border-b border-slate-700">
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

      {/* Market Data Placeholder */}
      <div className="flex-1 overflow-auto">
        <Card className="m-4 bg-slate-700 border-slate-600">
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

      {/* Algo Trader Section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Algo Trader</span>
          <div className="flex items-center gap-2">
            <Switch />
            <X className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Account Section */}
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-3">
            <div className="text-center">
              <User className="w-10 h-10 mx-auto mb-2 text-slate-500" />
              <h4 className="font-medium text-slate-300 mb-1">
                Account & Advisors
              </h4>
              <p className="text-xs text-slate-500">
                Trading account management
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Assistant listing component will be implemented here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </aside>
  );
}

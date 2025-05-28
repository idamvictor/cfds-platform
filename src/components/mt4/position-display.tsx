import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function PositionDisplay() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <Card className="rounded-none border-x-0 border-b-0 bg-slate-800 py-0">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-300">
                Total Portfolio
              </h3>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-slate-400 hover:text-slate-300 transition-colors flex items-center"
              >
                <span className="text-sm text-slate-300 mr-2">
                  Show Positions
                </span>
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            {!isCollapsed && (
              <>
                {" "}
                <TrendingUp className="w-10 h-10 mx-auto mb-3 text-slate-500" />
                <h3 className="font-semibold text-slate-300 mb-2">
                  Position Display
                </h3>
                <p className="text-sm text-slate-500">
                  Current trading positions and orders
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Position management component will be implemented here
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

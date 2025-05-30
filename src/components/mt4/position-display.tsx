import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function PositionDisplay() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="relative">
      {/* Base collapsed state */}
      <div className="bg-slate-700 border-t border-slate-700 relative z-10">
        <Card className="rounded-none border-x-0 border-b-0 bg-slate-700 py-0">
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
          </CardContent>
        </Card>
      </div>

      {/* Overlay that expands from position display */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 z-50 transition-all duration-200">
          <div className="absolute bottom-full left-0 right-0 h-[calc(100vh-100%)] bg-black/30" />
          <div className="bg-slate-700 border-t border-slate-700">
            <Card className="rounded-none border-x-0 border-b-0 bg-slate-700 py-0">
              <CardContent className="p-3">
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

                <div className="flex flex-col items-center justify-center py-8 gap-4 ">
                  <p className="text-slate-400">
                    You have no open position yet
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-md border border-slate-600 transition-colors">
                    <span className="text-lg">+</span> Select Asset
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

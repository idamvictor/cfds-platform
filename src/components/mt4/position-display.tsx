import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function PositionDisplay() {
  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4">
      <Card className="bg-slate-700 border-slate-600">
        <CardContent className="p-4">
          <div className="text-center">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

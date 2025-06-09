import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useOverlayStore from "@/store/overlayStore";

export default function AutomatedTrading() {
  const { setAutomatedTrading } = useOverlayStore();

  return (
    <Card className="w-[350px] bg-[#1C2030] text-slate-300 border-slate-800 pt-0">
      <CardHeader className="bg-slate-700 flex flex-row items-center justify-between py-4 px-4 border-b border-slate-800 rounded-md">
        <CardTitle className="text-sm font-medium text-slate-200">
          Automated Trading - ExpertMACD
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-slate-100"
          onClick={() => setAutomatedTrading(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-right text-slate-400 pr-4">Status:</div>
          <div>
            <Badge
              variant="outline"
              className="font-medium bg-transparent border-transparent text-green-500"
            >
              Running
            </Badge>
          </div>

          <div className="text-right text-slate-400 pr-4">Broker GMT:</div>
          <div>0</div>

          <div className="text-right text-slate-400 pr-4">Current Profit:</div>
          <div className="text-green-500">0.27</div>

          <div className="text-right text-slate-400 pr-4">Today's Profit:</div>
          <div className="text-green-500">0.00</div>

          <div className="text-right text-slate-400 pr-4">
            This Week Profit:
          </div>
          <div className="text-green-500">0.00</div>

          <div className="text-right text-slate-400 pr-4">Balance:</div>
          <div>5000000.00</div>

          <div className="text-right text-slate-400 pr-4">Leverage:</div>
          <div>1:100</div>

          <div className="text-right text-slate-400 pr-4">Account Name:</div>
          <div>Albert Einstein</div>

          <div className="text-right text-slate-400 pr-4">Account Server:</div>
          <div>MetaQuotes-Demo</div>

          <div className="text-right text-slate-400 pr-4">
            Number Of Trade today:
          </div>
          <div>MetaQuotes-Demo</div>

          <div className="text-right text-slate-400 pr-4">Slippage Trades:</div>
          <div>0 | 0%</div>
        </div>
      </CardContent>
    </Card>
  );
}

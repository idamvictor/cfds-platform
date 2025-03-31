import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BarChart2, X } from "lucide-react";

export function ProfitCalculator() {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-background"
        >
          <BarChart2 className="h-4 w-4" />
          <span>Profit Calculator</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-muted/90 border-none p-0">
        <div className="bg-muted/90 text-foreground rounded-md">
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCalculator(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                BUY
              </Button>
              <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                SELL
              </Button>
            </div>

            <div className="relative">
              <Input
                placeholder="Price from profit"
                className="w-full bg-transparent border-green-500 text-center"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-muted/80 p-2 rounded">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium">100000</span>
              </div>

              <div className="flex justify-between items-center bg-muted/80 p-2 rounded">
                <span className="text-muted-foreground">Entry Price</span>
                <span className="font-medium">93.083</span>
              </div>

              <div className="flex justify-between items-center bg-muted/80 p-2 rounded">
                <span className="text-muted-foreground">Take Profit</span>
                <span className="font-medium">93.183</span>
              </div>

              <div className="flex justify-between items-center bg-muted/80 p-2 rounded">
                <span className="text-muted-foreground">Stop Loss</span>
                <span className="font-medium">92.983</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Max Position: 19000 AUD/JPY
            </div>

            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              Calculate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

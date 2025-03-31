import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp } from "lucide-react";

export function PendingOrder() {
  const [showPending, setShowPending] = useState(false);

  return (
    <Dialog open={showPending} onOpenChange={setShowPending}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-background"
        >
          <span>Pending</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-muted/90 border-none p-0">
        <div className="bg-muted/90 text-foreground rounded-md">
          <div className="p-4 space-y-4">
            <div className="text-center font-medium">PENDING</div>

            <div className="space-y-2">
              <div className="flex items-center bg-muted/80 rounded">
                <div className="p-2 flex-1 text-muted-foreground">
                  Asset Price
                </div>
                <div className="p-2 flex-1 font-medium">Current</div>
                <div className="flex flex-col border-l">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 rounded-none hover:bg-muted"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 rounded-none hover:bg-muted"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={() => setShowPending(false)}
            >
              Apply
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Position will be opened automatically when the price reaches this
              level
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

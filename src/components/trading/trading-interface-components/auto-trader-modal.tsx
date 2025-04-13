import { useState } from "react";
import { X , BotIcon as Robot, } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export default function AutoTraderModal() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [tradingLevel, setTradingLevel] = useState("medium");
  const [accepted, setAccepted] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-full gap-3 text-primary border-primary hover:bg-trading-green/10"
        >
          <Robot className="h-5 w-5" />
          <span className="text-base">Auto Trader</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row mt-5 justify-between bg-slate-700 px-4 py-3">
          <DialogTitle className="text-sm">Auto Trader</DialogTitle>
          <div className="flex items-center space-x-2">
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup
            value={tradingLevel}
            onValueChange={setTradingLevel}
            className="space-y-2"
          >
            <div className="flex items-center justify-between bg-slate-700 px-4 py-3">
              <Label
                htmlFor="low"
                className="flex flex-1 cursor-pointer items-center"
              >
                Low
              </Label>
              <RadioGroupItem
                value="low"
                id="low"
                className="border-white text-primary"
              />
            </div>
            <div className="flex items-center justify-between bg-slate-700 px-4 py-3">
              <Label
                htmlFor="medium"
                className="flex flex-1 cursor-pointer items-center text-white"
              >
                Medium
              </Label>
              <RadioGroupItem
                value="medium"
                id="medium"
                className="border-white text-green-500"
              />
            </div>
            <div className="flex items-center justify-between rounded bg-slate-700 px-4 py-3">
              <Label
                htmlFor="high"
                className="flex flex-1 cursor-pointer items-center text-white"
              >
                High
              </Label>
              <RadioGroupItem
                value="high"
                id="high"
                className="border-white text-primary"
              />
            </div>
          </RadioGroup>

          <div className="flex items-center justify-between rounded bg-slate-700 px-4 py-3">
            <span className="text-white">Trades per day:</span>
            <span className="text-white">1-3</span>
          </div>

          <div className="text-sm text-slate-400 mt-4">
            Trading CFDs and other leveraged products can lead to losses. Before
            trading, clients should read the relevant risk statements on our
            Risk Disclosure page. Automated trading does not guarantee results.
            The company accepts no responsibility for the loss of funds in
            automatic trading. Please make sure that you fully understand the
            risks and take measures to manage risks.
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="accept"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
            <label
              htmlFor="accept"
              className="text-sm font-medium leading-none text-white cursor-pointer"
            >
              Accept
            </label>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={!accepted}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

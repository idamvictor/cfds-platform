import { useState } from "react";
import { BotIcon as Robot } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
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
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const showRobot = !location.pathname.startsWith("/main");

  const getTradingLevelInfo = (level: string) => {
    switch (level) {
      case "low":
        return "1-3";
      case "medium":
        return "3-4";
      case "high":
        return "5+";
      default:
        return "1-3";
    }
  };

  const handleSave = async () => {
    if (!accepted) return;

    try {
      setIsSubmitting(true);
      await axiosInstance.post("/update/autotrader", {
        autotrader_type: tradingLevel,
      });

      toast.success("AutoTrader settings saved successfully");
      setOpen(false);
    } catch (error: any) {
      // Check for pending request error
      if (
        error.response?.data?.message?.includes("pending auto trader request")
      ) {
        toast.error(
          "You already have a pending AutoTrader request. Please wait for approval."
        );
      } else {
        toast.error("Failed to save AutoTrader settings");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-full w-full gap-3 text-primary border-primary hover:bg-trading-green/10 justify-start"
        >
          <span className="flex items-center gap-2">
            {showRobot && <Robot className="h-5 w-5" />}
            <span>Auto Trader</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-track]:bg-transparent">
        <DialogHeader className="flex flex-row mt-5 justify-between bg-slate-700 px-4 py-3 ">
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
            <span className="text-white">Open Trades:</span>
            <span className="text-white">
              {getTradingLevelInfo(tradingLevel)}
            </span>
          </div>

          <div className="text-sm text-slate-400 mt-4">
            <p>
              Trading CFDs and other leveraged products can lead to losses.
              Before trading, clients should read the relevant risk statements
              on our Risk Disclosure page. Automated trading does not guarantee
              results. The company accepts no responsibility for the loss of
              funds in automatic trading. Please make sure that you fully
              understand the risks and take measures to manage risks.
            </p>
            <div className="mt-2">
              <button
                className="text-blue-500 underline"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show less" : "Show more"}
              </button>
              {showMore && (
                <div className="mt-2 max-h-[300px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-track]:bg-transparent">
                  <p>
                    An AI trading software is an advanced tool that uses
                    artificial intelligence, machine learning, and real-time
                    data analysis to make trading decisions and execute trades
                    in financial markets. Here's a clear breakdown of what it
                    does:
                  </p>
                  <ul className="list-disc list-inside mt-2">
                    <li>
                      <strong>📈 What AI Trading Software Does:</strong>
                    </li>
                    <li>
                      Analyzes Massive Data Sets: It scans and processes
                      thousands of data points, including market trends, news,
                      price charts, and historical patterns in seconds.
                    </li>
                    <li>
                      Generates Trade Signals: Based on data analysis and
                      predictive algorithms, the software identifies
                      high-probability entry and exit points for trades.
                    </li>
                    <li>
                      Executes Trades Automatically: Once a trading signal is
                      confirmed, the AI executes trades instantly, often faster
                      and more accurately than a human could.
                    </li>
                    <li>
                      Manages Risk Smartly: The system uses risk-management
                      tools like stop-loss, take-profit levels, and trailing
                      stops to protect capital and lock in profits.
                    </li>
                    <li>
                      Adapts and Learns Over Time: Advanced AI software uses
                      machine learning to improve its strategies by learning
                      from previous trades and market behavior.
                    </li>
                    <li>
                      Operates 24/7: Unlike human traders, AI software doesn’t
                      need rest. It monitors the market and acts on
                      opportunities around the clock.
                    </li>
                  </ul>
                  <p className="mt-2">
                    <strong>✅ Benefits for the Client:</strong>
                  </p>
                  <ul className="list-disc list-inside mb-2">
                    <li>Emotion-free trading (removes fear/greed)</li>
                    <li>Faster reaction to market events</li>
                    <li>Consistent execution of strategy</li>
                    <li>
                      Increased efficiency and potential for higher returns
                    </li>
                  </ul>
                </div>
              )}
            </div>
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
            disabled={!accepted || isSubmitting}
            onClick={handleSave}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useOverlayStore from "@/store/overlayStore";
import useUserStore from "@/store/userStore";
import useDataStore from "@/store/dataStore";
import { useCallback, useEffect, useState } from "react";
import type { ExpertAdvisor } from "@/store/dataStore";

interface AutomatedTradingProps {
  advisorId?: string;
}

export default function AutomatedTrading({ advisorId }: AutomatedTradingProps) {
  const { setAutomatedTrading } = useOverlayStore();
  const { data } = useDataStore();
  const user = useUserStore((state) => state.user);
  const [isActive, setIsActive] = useState(true);
  const [currentAdvisor, setCurrentAdvisor] = useState<ExpertAdvisor | null>(
    null
  );

  // Find and validate the expert advisor on component mount
  useEffect(() => {
    if (!advisorId || !data?.expert_advisors) {
      return;
    }

    const advisor = data.expert_advisors.find((adv) => adv.id === advisorId);
    if (!advisor) {
      toast.error("Expert Advisor not found");
      setAutomatedTrading(false);
      return;
    }

    const isAvailable =
      user?.eas?.includes(advisorId);
    if (!isAvailable) {
      toast.error("This Expert Advisor is not available for your plan");
      setAutomatedTrading(false);
      return;
    }

    setCurrentAdvisor(advisor);
  }, [
    advisorId,
    data?.expert_advisors,
    user?.eas,
    setAutomatedTrading,
  ]);

  // Handle toggling the advisor status
  const toggleStatus = useCallback(() => {
    setIsActive((prev) => !prev);
    toast.info(isActive ? "Expert Advisor stopped" : "Expert Advisor started");
  }, [isActive]);

  // If no advisor is selected or validated, don't render
  if (!currentAdvisor) {
    return null;
  }

  return (
    <Card className="w-[350px] bg-[#1C2030] text-slate-300 border-slate-800 pt-0">
      <CardHeader className="bg-slate-700 flex flex-row items-center justify-between py-4 px-4 border-b border-slate-800 rounded-md">
        <CardTitle className="text-sm font-medium text-slate-200">
          Automated Trading - {currentAdvisor.name}
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
            <Button
              variant="ghost"
              onClick={toggleStatus}
              className="h-6 px-2 py-0"
            >
              <Badge
                variant="outline"
                className={`font-medium bg-transparent border-transparent ${
                  isActive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isActive ? "Running" : "Stopped"}
              </Badge>
            </Button>
          </div>

          <div className="text-right text-slate-400 pr-4">Current Profit:</div>
          <div className="text-green-500">0.27</div>

          <div className="text-right text-slate-400 pr-4">Today's Profit:</div>
          <div className="text-green-500">0.00</div>

          <div className="text-right text-slate-400 pr-4">
            This Week Profit:
          </div>
          <div className="text-green-500">0.00</div>

          <div className="text-right text-slate-400 pr-4">Balance:</div>
          <div>{user?.balance?.toFixed(2) || "0.00"}</div>

          <div className="text-right text-slate-400 pr-4">Leverage:</div>
          <div>1:{user?.account_type?.leverage || 100}</div>

          <div className="text-right text-slate-400 pr-4">Account Name:</div>
          <div>{`${user?.first_name || ""} ${user?.last_name || ""}`}</div>

          <div className="text-right text-slate-400 pr-4">Account Server:</div>
          <div>MetaQuotes-Demo</div>

          <div className="text-right text-slate-400 pr-4">
            Number of Trades Today:
          </div>
          <div>5</div>

          <div className="text-right text-slate-400 pr-4">Slippage Trades:</div>
          <div>0 | 0%</div>
        </div>
      </CardContent>
    </Card>
  );
}

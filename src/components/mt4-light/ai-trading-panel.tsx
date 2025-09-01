import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface AITradingOption {
  name: string;
  icon: string;
}

interface AITradingPanelProps {
  autoTrading: boolean;
  onAutoTradingChange: (checked: boolean) => void;
  aiTradingOptions: AITradingOption[];
}

export function AITradingPanel({
  autoTrading,
  onAutoTradingChange,
  aiTradingOptions,
}: AITradingPanelProps) {
  return (
    <div className="p-2 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-sm">
          Artificial Intelligent (AI) Trading
        </h3>
        <Switch
          checked={autoTrading}
          onCheckedChange={onAutoTradingChange}
          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-300"
        />
      </div>
      <div className="space-y-1">
        {aiTradingOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-1.5 hover:bg-gray-100 rounded"
          >
            <div className="flex items-center gap-1.5">
              <span>{option.icon}</span>
              <span className="text-sm text-slate-800">{option.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-slate-200 text-slate-600"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

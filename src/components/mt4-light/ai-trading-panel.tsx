import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"

interface AITradingOption {
  name: string
  icon: string
}

interface AITradingPanelProps {
  autoTrading: boolean
  onAutoTradingChange: (checked: boolean) => void
  aiTradingOptions: AITradingOption[]
}

export function AITradingPanel({ autoTrading, onAutoTradingChange, aiTradingOptions }: AITradingPanelProps) {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-700">Artificial Intelligent (AI) Trading</h3>
        <Switch
          checked={autoTrading}
          onCheckedChange={onAutoTradingChange}
          className="data-[state=checked]:bg-green-500"
        />
      </div>

      <div className="space-y-2">
        {aiTradingOptions.map((option, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
            <div className="flex items-center gap-2">
              <span>{option.icon}</span>
              <span className="text-sm">{option.name}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="text-xs text-slate-600 mb-2">Symbols</div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs">Balance: 163 9600.19 USD Equity: 163 960.19 Free Margin: 163 960.19</span>
        </div>
      </div>
    </div>
  )
}

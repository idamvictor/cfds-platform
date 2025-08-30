import { Button } from "@/components/ui/button"
import { Minimize2, Square, X } from "lucide-react"

export function TitleBar() {
  return (
    <div className="bg-slate-200 border-b border-slate-300 px-4 py-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">📊</span>
        </div>
        <span className="text-slate-700 text-xs">
          S1285120 ICMarketsEC Demo: Demo Account - Hedge - Raw Trading Ltd - [ GBPUSD,M1 ]
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Minimize2 className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Square className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white">
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, BarChart3, Play } from "lucide-react"

export function Toolbar() {
  return (
    <div className="bg-slate-50 border-b border-slate-300 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <BarChart3 className="h-4 w-4" />
          Switch to Trading View
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Play className="h-4 w-4 text-green-500" />
        <span className="text-sm">Auto Trading</span>
        <Badge variant="destructive" className="rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
          1
        </Badge>
      </div>
    </div>
  )
}

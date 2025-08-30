import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, Play } from "lucide-react";

export function Toolbar() {
  return (
    <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white border-blue-300 text-slate-700 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white border-blue-300 text-slate-700 hover:bg-blue-50"
        >
          <BarChart3 className="h-4 w-4" />
          Switch to Trading View
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Play className="h-4 w-4 text-green-600 fill-green-600" />
        <span className="text-sm text-slate-700 font-medium">Auto Trading</span>
        <Badge className="rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0">
          1
        </Badge>
      </div>
    </div>
  );
}

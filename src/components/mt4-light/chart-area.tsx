import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function ChartArea() {
  return (
    <div className="flex-1 bg-white border-b border-slate-300 relative">
      {/* Chart Header */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <span className="text-xs text-slate-600">USDCHF,H4 0.87724087741 0.87412 0.87527</span>
        <span className="text-xs text-slate-500">83.43</span>
      </div>

      {/* Trading Controls */}
      <div className="absolute top-2 left-1/4 z-10 flex items-center gap-2">
        <div className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2">
          <span className="text-xs">SELL</span>
          <ChevronDown className="h-3 w-3" />
        </div>
        <div className="bg-white border border-slate-300 px-2 py-1 rounded">
          <span className="text-xs">1.00</span>
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded">
          <span className="text-xs">SELL</span>
        </div>
      </div>

      {/* Price Display */}
      <div className="absolute top-12 left-1/4 z-10 flex items-center gap-4">
        <div className="text-red-500">
          <div className="text-xs">0.67</div>
          <div className="text-2xl font-bold">52'</div>
        </div>
        <div className="text-red-500">
          <div className="text-xs">0.67</div>
          <div className="text-2xl font-bold">55'</div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden">
          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute w-full border-t border-slate-300" style={{ top: `${i * 5}%` }} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute h-full border-l border-slate-300" style={{ left: `${i * 5}%` }} />
            ))}
          </div>

          {/* Candlestick Chart Placeholder */}
          <div className="absolute inset-0 flex items-end justify-center p-4">
            <div className="flex items-end gap-1 h-full w-full">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className={`w-full ${Math.random() > 0.5 ? "bg-green-500" : "bg-red-500"} opacity-80`}
                    style={{ height: `${Math.random() * 80 + 10}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Price Scale */}
          <div className="absolute right-2 top-0 h-full flex flex-col justify-between py-4 text-xs text-slate-600">
            <div>83.43</div>
            <div>69.65</div>
            <div>55.47</div>
            <div>55.47</div>
            <div>83.43</div>
            <div>69.65</div>
            <div>55.47</div>
            <div>55.47</div>
            <div>83.43</div>
            <div>69.65</div>
            <div>55.47</div>
          </div>
        </div>
      </div>

      {/* Chart Timeframe Tabs */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          EURUSD, Daily
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs bg-slate-200">
          EURUSD, M5
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          GBPCHF,M5
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          AUDUSD,M5
        </Button>
      </div>
    </div>
  )
}

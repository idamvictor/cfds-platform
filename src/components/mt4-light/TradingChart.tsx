// import { ChevronDown } from "lucide-react";

export function TradingChart() {
  return (
    <div className="w-full h-full bg-white relative">
      {/* Chart Header */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <span className="text-xs text-slate-700 font-medium">
          USDCHF,H4 0.87724087741 0.87412 0.87527
        </span>
        <span className="text-xs text-slate-600">83.43</span>
      </div>

      {/* Trading Controls */}
      {/* <div className="absolute top-2 left-1/4 z-10 flex items-center gap-2">
        <div className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2 shadow-sm">
          <span className="text-xs font-medium">SELL</span>
          <ChevronDown className="h-3 w-3" />
        </div>
        <div className="bg-white border border-slate-400 px-2 py-1 rounded shadow-sm">
          <span className="text-xs text-slate-800 font-medium">1.00</span>
        </div>
        <div className="bg-red-600 text-white px-3 py-1 rounded shadow-sm">
          <span className="text-xs font-medium">SELL</span>
        </div>
      </div> */}

      {/* Price Display */}
      {/* <div className="absolute top-12 left-1/4 z-10 flex items-center gap-4">
        <div className="text-red-600">
          <div className="text-xs font-medium">0.67</div>
          <div className="text-2xl font-bold">52'</div>
        </div>
        <div className="text-red-600">
          <div className="text-xs font-medium">0.67</div>
          <div className="text-2xl font-bold">55'</div>
        </div>
      </div> */}

      <div className="w-full h-full relative overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-slate-300"
              style={{ top: `${i * 5}%` }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-full border-l border-slate-300"
              style={{ left: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Candlestick Chart */}
        <div className="absolute inset-0 flex items-end justify-center p-4">
          <div className="flex items-end gap-1 h-full w-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className={`w-full ${
                    Math.random() > 0.5 ? "bg-green-500" : "bg-red-500"
                  } opacity-90`}
                  style={{ height: `${Math.random() * 80 + 10}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Price Scale */}
        <div className="absolute right-2 top-0 h-full flex flex-col justify-between py-4 text-xs text-slate-700 font-medium">
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
  );
}

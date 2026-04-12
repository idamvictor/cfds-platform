import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartComponent } from "./pie-cahrt";
import { useState } from "react";
import useUserStore from "@/store/userStore";

export function SuccessRateCard() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const user = useUserStore((state) => state.user);
  const summary = user?.trades_summary || {
    total_wins: 0,
    total_losses: 0,
    trades_count: 0,
    total_pnl: 0,
    win_rate: 0,
  };
  const averageReturn =
    summary.trades_count > 0 ? summary.total_pnl / summary.trades_count : null;

  const handlePieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card className="row-span-2 h-full rounded-[22px]- border-0 bg-transparent p-0 text-white shadow-none">
      <CardHeader className="px-0 ">
        <CardTitle className="text-[15px] sm:text-[17px] font-semibold tracking-tight text-white">
          Success Rate
        </CardTitle>
      </CardHeader>

      <CardContent className="flex h-full flex-col px-0">
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/6 bg-[#111319]  px-6 pb-8">
          <div className="relative flex h-[250px] w-full items-center justify-center">
            <PieChartComponent
              activeIndex={activeIndex}
              onPieEnter={handlePieEnter}
              onPieLeave={handlePieLeave}
              />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[3rem] font-semibold leading-none text-white">
                {Math.round(summary.win_rate || 0)}%
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#5f6b82]">
                Win Rate
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-5 text-sm">
            <div
              className="flex items-center gap-2 transition-opacity duration-300"
              style={{
                opacity:
                  activeIndex !== undefined
                    ? activeIndex === 0
                      ? 1
                      : 0.35
                    : 1,
              }}
              onMouseEnter={() => setActiveIndex(0)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-[#16e28d]" />
              <span className="text-[#b5c0d4]">Profit</span>
            </div>
            <div
              className="flex items-center gap-2 transition-opacity duration-300"
              style={{
                opacity:
                  activeIndex !== undefined
                    ? activeIndex === 1
                      ? 1
                      : 0.35
                    : 1,
              }}
              onMouseEnter={() => setActiveIndex(1)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5b7f]" />
              <span className="text-[#b5c0d4]">Loss</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-white/6 bg-[#111319]">
          <div className="border-b border-r border-white/6 px-4 py-5 text-center">
            <div className="text-2xl font-semibold text-[#16e28d]">
              {summary.total_wins}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5f6b82]">
              Wins
            </div>
          </div>
          <div className="border-b border-white/6 px-4 py-5 text-center">
            <div className="text-2xl font-semibold text-[#ff5b7f]">
              {summary.total_losses}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5f6b82]">
              Losses
            </div>
          </div>
          <div className="border-r border-white/6 px-4 py-5 text-center">
            <div className="text-2xl font-semibold text-white">
              {summary.trades_count}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5f6b82]">
              Total
            </div>
          </div>
          <div className="px-4 py-5 text-center">
            <div className="text-2xl font-semibold text-white">
              {averageReturn !== null
                ? `${averageReturn >= 0 ? "+" : ""}${averageReturn.toFixed(2)}`
                : "-"}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5f6b82]">
              Avg Return
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

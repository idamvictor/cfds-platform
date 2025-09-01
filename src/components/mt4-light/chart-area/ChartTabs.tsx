import { Button } from "@/components/ui/button";

interface ChartTab {
  pair: string;
  timeframe: string;
  isActive?: boolean;
}

interface ChartTabsProps {
  tabs: ChartTab[];
  onSelectTab: (tab: ChartTab) => void;
}

export function ChartTabs({ tabs, onSelectTab }: ChartTabsProps) {
  return (
    <div className="flex items-center gap-1 p-3">
      {tabs.map((tab, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className={`h-6 px-2 text-xs ${
            tab.isActive
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "text-slate-600 hover:bg-slate-200"
          }`}
          onClick={() => onSelectTab(tab)}
        >
          {tab.pair}, {tab.timeframe}
        </Button>
      ))}
    </div>
  );
}

import ChartArea from "./chart-area";
import PositionDisplay from "./position-display";
import RightPanels from "./right-panels";

export default function MainContent() {
  return (
    <main className="flex-1 flex flex-col h-full">
      {/* Chart and Right Panels Container */}
      <div className="flex flex-1 min-h-0">
        <ChartArea />
        <RightPanels />
      </div>

      {/* Position Display - Full width of main content */}
      <PositionDisplay />
    </main>
  );
}

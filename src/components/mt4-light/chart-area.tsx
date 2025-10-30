// import { AssetListingTabs } from "../mt4/header/asset-listing-tabs";
// import TradingViewWidget from "../trading/trading-interface-components/trading-view-widget";
// import BuySellFloatingButtons from "../mt4/main-content/buy-sell-floating-buttons";
import BuySellFloatingButtonsLight from "./chart-area/buy-sell-floating-buttons-light";
import { ChartTabs } from "./chart-area/ChartTabs";
import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";
import useDarkModeStore from "@/store/darkModeStore";
// import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";

export function ChartArea() {
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);

  return (
    <div
      className={`flex-1 ${
        isDarkMode ? "bg-slate-900" : "bg-gray-50"
      } border-b ${isDarkMode ? "border-slate-600" : "border-slate-400"}`}
    >
      <div className="h-[93%] relative">
        <div className="absolute top-20 right-4 z-10">
          <BuySellFloatingButtonsLight />
        </div>
        <TradingViewLightWidget />
      </div>
      <div className="overflow-x-auto w-full">
        <ChartTabs />
      </div>
    </div>
  );
}

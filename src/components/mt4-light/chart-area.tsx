// import { AssetListingTabs } from "../mt4/header/asset-listing-tabs";
// import TradingViewWidget from "../trading/trading-interface-components/trading-view-widget";
// import BuySellFloatingButtons from "../mt4/main-content/buy-sell-floating-buttons";
import BuySellFloatingButtonsLight from "./chart-area/buy-sell-floating-buttons-light";
import { ChartTabs } from "./chart-area/ChartTabs";
import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";
// import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";

export function ChartArea() {
  return (
    <div className="flex-1 bg-gray-50 border-b border-slate-400 ">
      <div className="h-[93%] relative">
        <div className="absolute top-20 left-4 z-10">
          <BuySellFloatingButtonsLight />
        </div>
        <TradingViewLightWidget />
      </div>
      <ChartTabs />
    </div>
  );
}

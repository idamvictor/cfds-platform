// import { AssetListingTabs } from "../mt4/header/asset-listing-tabs";
// import TradingViewWidget from "../trading/trading-interface-components/trading-view-widget";
import BuySellFloatingButtons from "../mt4/main-content/buy-sell-floating-buttons";
import { ChartTabs } from "./chart-area/ChartTabs";
import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";
// import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";

export function ChartArea() {
  return (
    <div className="flex-1 bg-gray-50 border-b border-slate-400 ">
      <div className="h-[93%] relative">
        <div className="absolute top-10 left-4 z-10">
          <BuySellFloatingButtons />
        </div>
        <TradingViewLightWidget />
      </div>
      <ChartTabs />
    </div>
  );
}

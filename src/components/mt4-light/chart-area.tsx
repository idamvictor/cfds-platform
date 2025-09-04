// import { AssetListingTabs } from "../mt4/header/asset-listing-tabs";
// import TradingViewWidget from "../trading/trading-interface-components/trading-view-widget";
import { ChartTabs } from "./chart-area/ChartTabs";
import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";
// import TradingViewLightWidget from "./chart-area/TradingViewLightWidget";

export function ChartArea() {
  return (
    <div className="flex-1 bg-gray-50 border-b border-slate-400 ">
      <div className="h-[80%]">
        <TradingViewLightWidget />
        {/* <TradingViewWidget /> */}
      </div>
      <ChartTabs />
      {/* <AssetListingTabs /> */}
    </div>
  );
}

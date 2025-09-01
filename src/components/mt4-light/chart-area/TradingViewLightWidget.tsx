import { useEffect, useRef, memo } from "react";
import useAssetStore from "@/store/assetStore";

interface TradingViewLightWidgetProps {
  theme?: "light" | "dark";
  interval?: string;
}

function TradingViewLightWidget({
  theme = "light",
  interval = "D",
}: TradingViewLightWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const tvSymbol =
    useAssetStore((state) => state.activeAsset?.tv_symbol) || "OANDA:EURUSD";

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: interval,
      locale: "en",
      save_image: true,
      style: "1",
      symbol: tvSymbol,
      theme: theme,
      timezone: "Etc/UTC",
      backgroundColor: theme === "dark" ? "#131722" : "#ffffff",
      gridColor:
        theme === "dark"
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(46, 46, 46, 0.06)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true,
    });

    if (container.current) {
      container.current.innerHTML = "";
      container.current.appendChild(script);
    }

    const containerElement = container.current;
    return () => {
      if (containerElement) {
        containerElement.innerHTML = "";
      }
    };
  }, [tvSymbol, theme, interval]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      />
      <div className="tradingview-widget-copyright">
        <a
          href={`https://www.tradingview.com/symbols/${tvSymbol}/?exchange=OANDA`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">
            {tvSymbol.replace("OANDA:", "")} Chart by TradingView
          </span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewLightWidget);

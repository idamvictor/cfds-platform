import { useEffect, useRef, memo } from "react";
import useAssetStore from "@/store/assetStore";

function TradingViewWidget() {
  const container = useRef<HTMLDivElement | null>(null);
  const { activeAsset } = useAssetStore();

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing widgets
    container.current.innerHTML = "";

    // Create container elements
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widgetElement = document.createElement("div");
    widgetElement.className = "tradingview-widget-container__widget";
    widgetElement.style.height = "calc(100% - 32px)";
    widgetElement.style.width = "100%";

    const copyrightElement = document.createElement("div");
    copyrightElement.className = "tradingview-widget-copyright";

    const copyrightLink = document.createElement("a");
    copyrightLink.href = "https://www.tradingview.com/";
    copyrightLink.rel = "noreferrer noopener nofollow";
    copyrightLink.target = "_blank";

    const spanElement = document.createElement("span");
    spanElement.className = "blue-text";
    spanElement.textContent = "Track all markets on TradingView";

    copyrightLink.appendChild(spanElement);
    copyrightElement.appendChild(copyrightLink);

    // Append elements to container
    widgetContainer.appendChild(widgetElement);
    widgetContainer.appendChild(copyrightElement);
    container.current.appendChild(widgetContainer);

    // Create and load script
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Set script content (widget configuration)
    const symbol = activeAsset?.tv_symbol || "NASDAQ:AAPL";

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    });

    widgetContainer.appendChild(script);

    // Cleanup function
    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [activeAsset]);

  return <div ref={container} style={{ height: "100%", width: "100%" }} />;
}

export default memo(TradingViewWidget);

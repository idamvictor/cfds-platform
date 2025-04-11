import { useEffect, useRef, memo } from "react";
import useAssetStore from "@/store/assetStore";

function TradingViewWidget() {
  const container = useRef<HTMLDivElement | null>(null);
  // Only use the tv_symbol property from activeAsset to prevent unnecessary re-renders
  const tvSymbol = useAssetStore((state) => state.activeAsset?.tv_symbol);

  useEffect(() => {
    if (!container.current || !tvSymbol) return;

    // Store a reference to the container for cleanup
    const currentContainer = container.current;
    const currentSymbol = tvSymbol;

    // Get the computed background color from CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const backgroundColor = computedStyle
      .getPropertyValue("--background")
      .trim();

    // Clear any existing widgets
    currentContainer.innerHTML = "";

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
    currentContainer.appendChild(widgetContainer);

    // Create and load script
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Set script content (widget configuration)
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: currentSymbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
      backgroundColor: backgroundColor,
    });

    widgetContainer.appendChild(script);

    // Cleanup function
    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, [tvSymbol]); // Only re-run when tvSymbol changes

  return <div ref={container} style={{ height: "100%", width: "100%" }} />;
}

// Memoize to prevent unnecessary rerenders
export default memo(TradingViewWidget);

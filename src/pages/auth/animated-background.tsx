import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  console.log(windowSize)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate chart lines
  const chartLines = Array.from({ length: 12 }).map((_, i) => {
    const isUptrend = Math.random() > 0.5;
    const startX = Math.random() * 100;
    const startY = 300 + Math.random() * 200;

    return {
      id: i,
      color: isUptrend ? "var(--primary)" : "var(--destructive)",
      opacity: 0.4 + Math.random() * 0.4,
      duration: 8 + Math.random() * 12,
      delay: i * 0.3,
      path: generateChartPath(startX, startY, isUptrend),
    };
  });

  // Generate currency symbols
  const currencySymbols = Array.from({ length: 20 }).map((_, i) => {
    const symbols = ["$", "€", "£", "¥", "₹", "₽", "₣", "₴", "₩"];
    return {
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: 16 + Math.random() * 30,
      opacity: 0.3 + Math.random() * 0.4,
      duration: 15 + Math.random() * 25,
      delay: i * 0.5,
    };
  });

  // Generate price tickers
  const priceTickers = Array.from({ length: 8 }).map((_, i) => {
    const pairs = [
      "BTC/USD",
      "ETH/USD",
      "EUR/USD",
      "GBP/USD",
      "USD/JPY",
      "AUD/USD",
      "USD/CAD",
      "NZD/USD",
    ];
    const prices = [
      "29,345.21",
      "1,876.54",
      "1.0923",
      "1.2654",
      "149.32",
      "0.6721",
      "1.3542",
      "0.6123",
    ];
    const isUp = Math.random() > 0.5;

    return {
      id: i,
      pair: pairs[i % pairs.length],
      price: prices[i % prices.length],
      isUp,
      x: `${10 + Math.random() * 80}%`,
      y: `${10 + Math.random() * 80}%`,
      opacity: 0.4 + Math.random() * 0.4,
      duration: 20 + Math.random() * 20,
      delay: i * 1.5,
    };
  });

  function generateChartPath(startX: number, startY: number, isUptrend: boolean) {
    let path = `M ${startX} ${startY} `;
    const segments = 10;
    const width = 300;
    const segmentWidth = width / segments;

    for (let i = 1; i <= segments; i++) {
      const x = startX + i * segmentWidth;
      const trend = isUptrend ? -1 : 1;
      const volatility = 20 + Math.random() * 30;
      const y = startY + trend * i * 5 + Math.sin(i * 0.5) * volatility;
      path += `L ${x} ${y} `;
    }

    return path;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-background" />

      {/* Animated chart lines */}
      <svg className="absolute inset-0 w-full h-full">
        {chartLines.map((line) => (
          <motion.path
            key={line.id}
            d={line.path}
            stroke={line.color}
            strokeWidth={2}
            strokeOpacity={line.opacity}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0, line.opacity],
            }}
            transition={{
              pathLength: {
                duration: line.duration,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "linear",
              },
              opacity: {
                duration: 2,
                delay: line.delay,
              },
            }}
          />
        ))}
      </svg>

      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="w-full h-px bg-border"
            style={{ gridRow: i + 1, gridColumn: "1 / -1" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.4 }}
            transition={{ duration: 2, delay: i * 0.2 }}
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="h-full w-px bg-border"
            style={{ gridColumn: i + 1, gridRow: "1 / -1" }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.4 }}
            transition={{ duration: 2, delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* Animated currency symbols */}
      {currencySymbols.map((symbol) => (
        <motion.div
          key={symbol.id}
          className="absolute text-primary font-bold"
          style={{
            left: symbol.x,
            top: symbol.y,
            fontSize: symbol.size,
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: [0, -100],
            opacity: [0, symbol.opacity, 0],
          }}
          transition={{
            y: {
              duration: symbol.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            },
            opacity: {
              duration: symbol.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              times: [0, 0.1, 1],
            },
          }}
        >
          {symbol.symbol}
        </motion.div>
      ))}

      {/* Price tickers */}
      {priceTickers.map((ticker) => (
        <motion.div
          key={ticker.id}
          className="absolute bg-card/80 backdrop-blur-sm px-3 py-1 rounded border border-border"
          style={{
            left: ticker.x,
            top: ticker.y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, ticker.opacity, 0],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            opacity: {
              duration: ticker.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              times: [0, 0.1, 1],
            },
            scale: {
              duration: ticker.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            },
          }}
        >
          <div className="text-xs font-medium text-card-foreground">
            {ticker.pair}
          </div>
          <div
            className={`text-sm font-bold ${
              ticker.isUp ? "text-primary" : "text-destructive"
            }`}
          >
            {ticker.price} {ticker.isUp ? "↑" : "↓"}
          </div>
        </motion.div>
      ))}

      {/* Overlay for better text contrast - reduced opacity to make animation more visible */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
    </div>
  );
}

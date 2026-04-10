import { useEffect, useRef } from "react";

const TICKER_COINS = [
  { sym: "BTC", price: "67,234.50", change: "+3.45" },
  { sym: "ETH", price: "3,892.10", change: "+2.18" },
  { sym: "XRP", price: "2.48", change: "+1.92" },
  { sym: "SOL", price: "189.32", change: "+4.67" },
  { sym: "DOGE", price: "0.42", change: "+5.23" },
  { sym: "ADA", price: "1.15", change: "+2.14" },
  { sym: "POL", price: "0.89", change: "+7.32" },
  { sym: "LINK", price: "18.45", change: "+1.84" },
  { sym: "ARB", price: "1.78", change: "+3.21" },
  { sym: "OP", price: "3.45", change: "+2.76" },
  { sym: "AVAX", price: "48.92", change: "+2.45" },
  { sym: "ATOM", price: "12.34", change: "+1.67" },
  { sym: "NEAR", price: "7.89", change: "+3.92" },
  { sym: "INJ", price: "56.78", change: "+4.18" },
];

export function TickerBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!trackRef.current) return;
      const priceEls = trackRef.current.querySelectorAll<HTMLSpanElement>("[data-ticker-price]");
      priceEls.forEach((el) => {
        if (Math.random() > 0.15) return;
        const base = parseFloat(el.dataset.basePrice || "0");
        const delta = base * (Math.random() * 0.004 - 0.002);
        const newVal = Math.max(0.01, base + delta);
        el.dataset.basePrice = String(newVal);
        el.textContent = `$${newVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const isUp = delta >= 0;
        el.style.color = isUp ? "var(--ticker-accent, #00dfa2)" : "var(--ticker-red, #f43f5e)";
        setTimeout(() => {
          el.style.color = "";
        }, 600);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const items = TICKER_COINS.map((coin) => {
    const isUp = coin.change.startsWith("+");
    return (
      <div
        key={coin.sym}
        className="inline-flex items-center gap-2 border-r border-white/[0.03] px-[22px] text-[0.68rem] font-semibold transition-colors duration-200 hover:bg-white/[0.03]"
      >
        <span
          className={`h-1 w-1 rounded-full ${isUp ? "bg-[#00dfa2] shadow-[0_0_6px_#00dfa2]" : "bg-[#f43f5e] shadow-[0_0_6px_#f43f5e]"}`}
        />
        <span className="font-mono text-[0.66rem] font-bold tracking-[0.04em] text-[#eef2f7]">
          {coin.sym}
        </span>
        <span
          className="font-mono text-[0.66rem] text-[#8b97a8] transition-colors duration-600"
          data-ticker-price
          data-base-price={parseFloat(coin.price.replace(/,/g, ""))}
        >
          ${coin.price}
        </span>
        <span
          className={`font-mono text-[0.63rem] font-bold ${isUp ? "text-[#00dfa2]" : "text-[#f43f5e]"}`}
        >
          {coin.change}%
        </span>
      </div>
    );
  });

  return (
    <div className="flex h-8 items-center overflow-hidden border-b border-white/[0.04] bg-[rgba(7,8,12,0.75)] backdrop-blur-[20px]">
      <div
        ref={trackRef}
        className="inline-flex animate-ticker-scroll whitespace-nowrap hover:[animation-play-state:paused]"
      >
        {items}
        {items}
      </div>
    </div>
  );
}

import OrderTable from "@/components/trading/order-table";
import TickerTape from "@/components/trading/ticker-tape";
import TradingViewWidget from "@/components/trading/trading-chart";
import TradingInterface from "@/components/trading/trading-interface";

export default function Test() {
  return (
    <div>
      <TickerTape />
      <TradingViewWidget />
      <TradingInterface />
      <OrderTable />
    </div>
  )
}

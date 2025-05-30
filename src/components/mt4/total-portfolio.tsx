import { Button } from "@/components/ui/button";

interface PortfolioData {
  balance: string;
  equity: string;
  margin: string;
  freeMargin: string;
  pnl: string;
}

const portfolioData: PortfolioData = {
  balance: "0.00",
  equity: "0.00",
  margin: "0.00",
  freeMargin: "0.00",
  pnl: "0.00",
};

export default function TotalPortfolio() {
  return (
    <div className="bg-[#1C2030] border-t border-slate-700 p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-sm font-medium text-white">
            Total Portfolio
          </span>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-400">BALANCE</span>
              <span className="ml-2 text-white">{portfolioData.balance}</span>
            </div>
            <div>
              <span className="text-gray-400">EQUITY</span>
              <span className="ml-2 text-white">{portfolioData.equity}</span>
            </div>
            <div>
              <span className="text-gray-400">MARGIN</span>
              <span className="ml-2 text-white">{portfolioData.margin}</span>
            </div>
            <div>
              <span className="text-gray-400">FREE MARGIN</span>
              <span className="ml-2 text-white">
                {portfolioData.freeMargin}
              </span>
            </div>
            <div>
              <span className="text-gray-400">P/L</span>
              <span className="ml-2 text-red-400">{portfolioData.pnl}</span>
            </div>
          </div>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          SWITCH TO CRM
        </Button>
      </div>
    </div>
  );
}

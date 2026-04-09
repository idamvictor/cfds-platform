import { Network } from "lucide-react";

interface Coin {
  symbol: string;
  name: string;
  network: string;
  color: string;
  glyph: string;
}

const coins: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", network: "Native SegWit", color: "#F7931A", glyph: "₿" },
  { symbol: "ETH", name: "Ethereum", network: "ERC-20", color: "#627EEA", glyph: "Ξ" },
  { symbol: "USDT", name: "Tether", network: "TRC-20", color: "#26A17B", glyph: "₮" },
  { symbol: "BNB", name: "BNB Chain", network: "BEP-20", color: "#F0B90B", glyph: "B" },
  { symbol: "SOL", name: "Solana", network: "SOL Net", color: "#9945FF", glyph: "◎" },
];

interface CoinGridProps {
  selectedCoin: string;
  /** The network value from react-hook-form — single source of truth for display */
  formNetwork: string;
  onCoinSelect: (symbol: string, name: string, network: string) => void;
}

export function CoinGrid({ selectedCoin, formNetwork, onCoinSelect }: CoinGridProps) {
  const selected = coins.find((c) => c.symbol === selectedCoin) || coins[0];
  // Display the form's network value; fall back to the coin's default only for the label
  const displayNetwork = formNetwork || selected.network;

  return (
    <div>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
        Select Asset to Withdraw
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {coins.map((coin) => {
          const isSelected = selectedCoin === coin.symbol;
          return (
            <button
              key={coin.symbol}
              type="button"
              onClick={() => onCoinSelect(coin.symbol, coin.name, coin.network)}
              className={`flex flex-col items-center rounded-xl border-[1.5px] p-3 text-center transition-all duration-200 ${
                isSelected
                  ? "border-[#00dfa2] bg-[#00dfa2]/[0.06] shadow-[0_0_0_1px_#00dfa2]"
                  : "border-white/[0.06] bg-[#131a28] hover:border-[#00dfa2]/50"
              }`}
            >
              <div
                className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold"
                style={{
                  background: `${coin.color}22`,
                  color: coin.color,
                }}
              >
                {coin.glyph}
              </div>
              <div className="text-xs font-extrabold text-white">{coin.symbol}</div>
              <div className="text-[10px] text-[#4a5468]">{coin.name}</div>
            </button>
          );
        })}
      </div>

      {/* Network badge */}
      <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#131a28] px-3.5 py-2 text-xs font-semibold text-[#a8b5c8]">
        <Network className="h-3.5 w-3.5 text-[#c8e64e]" />
        <span>{displayNetwork} ({selected.name} Network)</span>
      </div>
    </div>
  );
}

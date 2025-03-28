
import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

export function CurrencySelector() {
  const [currency, setCurrency] = React.useState("USD");

  const currencies: Currency[] = [
    { code: "AUD", name: "Australian Dollar", symbol: "$", flag: "🇦🇺" },
    { code: "BNB", name: "Binance Coin", symbol: "BNB", flag: "🪙" },
    { code: "BTC", name: "Bitcoin", symbol: "₿", flag: "🪙" },
    { code: "CAD", name: "Canadian Dollar", symbol: "$", flag: "🇨🇦" },
    { code: "ETC", name: "Ethereum Classic", symbol: "ETC", flag: "🪙" },
    { code: "ETH", name: "Ethereum", symbol: "Ξ", flag: "🪙" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "PLN", name: "Polish Złoty", symbol: "zł", flag: "🇵🇱" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "XLM", name: "Stellar Lumens", symbol: "XLM", flag: "🪙" },
    { code: "XRP", name: "Ripple", symbol: "XRP", flag: "🪙" },
  ];

  return (
    <RadioGroup
      value={currency}
      onValueChange={setCurrency}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
    >
      {currencies.map((curr) => (
        <div key={curr.code} className="flex items-center space-x-2">
          <RadioGroupItem
            value={curr.code}
            id={`currency-${curr.code}`}
            className="border-primary/20"
          />
          <Label
            htmlFor={`currency-${curr.code}`}
            className="flex items-center gap-1 cursor-pointer"
          >
            <span className="w-5">{curr.flag}</span>
            <span>{curr.code}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

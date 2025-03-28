import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Currency type
type Currency = "BTC" | "USD";

// Lock period type
type LockPeriod = "flexible" | "1month" | "1quarter" | "6months" | "1year";

// Interest rates by currency and period
const interestRates: Record<Currency, Record<LockPeriod, number>> = {
  BTC: {
    flexible: 0.2,
    "1month": 0.4,
    "1quarter": 1.5,
    "6months": 4.6,
    "1year": 9.5,
  },
  USD: {
    flexible: 0.0,
    "1month": 0.0,
    "1quarter": 0.0,
    "6months": 0.0,
    "1year": 0.0,
  },
};

// Period display names
const periodNames: Record<LockPeriod, string> = {
  flexible: "Flexible",
  "1month": "Locked 1 Month",
  "1quarter": "Locked 1 Quarter",
  "6months": "Locked 6 Months",
  "1year": "Locked 1 Year",
};

export default function SavingsPage() {
  // State
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<Currency>("BTC");
  const [expandedCurrency, setExpandedCurrency] =
    React.useState<Currency>("BTC");
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<LockPeriod>("flexible");
  const [amount, setAmount] = React.useState<string>("");

  // Calculate release date (current date + lock period)
  const calculateReleaseDate = (): string => {
    const now = new Date();
    const releaseDate = new Date(now);

    switch (selectedPeriod) {
      case "1month":
        releaseDate.setMonth(now.getMonth() + 1);
        break;
      case "1quarter":
        releaseDate.setMonth(now.getMonth() + 3);
        break;
      case "6months":
        releaseDate.setMonth(now.getMonth() + 6);
        break;
      case "1year":
        releaseDate.setFullYear(now.getFullYear() + 1);
        break;
      default:
        // Flexible has no release date
        return "";
    }

    return (
      releaseDate.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      releaseDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
  };

  // Calculate earnings
  const calculateEarnings = (): string => {
    if (!amount || isNaN(Number.parseFloat(amount))) return "0.00";

    const principal = Number.parseFloat(amount);
    const rate = interestRates[selectedCurrency][selectedPeriod] / 100;

    // Simple interest calculation (for demonstration)
    let timeInYears = 0;
    switch (selectedPeriod) {
      case "flexible":
        timeInYears = 1 / 12;
        break; // Assume 1 month for flexible
      case "1month":
        timeInYears = 1 / 12;
        break;
      case "1quarter":
        timeInYears = 3 / 12;
        break;
      case "6months":
        timeInYears = 6 / 12;
        break;
      case "1year":
        timeInYears = 1;
        break;
    }

    const earnings = principal * rate * timeInYears;
    return earnings.toFixed(2);
  };

  // Toggle currency expansion
  const toggleCurrencyExpansion = (currency: Currency) => {
    setExpandedCurrency(
      expandedCurrency === currency ? ("" as Currency) : currency
    );
  };

  // Format currency symbol
  const getCurrencySymbol = (currency: Currency): string => {
    return currency === "BTC" ? "₿" : "$";
  };

  // Current time
  const currentTime =
    new Date().toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">SAVINGS</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">DETAILED INFORMATION</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Currency and period selection */}
          <div className="space-y-2">
            {/* BTC Section */}
            <div className="rounded-md overflow-hidden">
              <button
                className="w-full flex items-center justify-between bg-card p-3 text-left"
                onClick={() => toggleCurrencyExpansion("BTC")}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-black text-xs">
                    ₿
                  </span>
                  <span>BTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>0.2 - 9.5 %</span>
                  {expandedCurrency === "BTC" ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {expandedCurrency === "BTC" && (
                <div className="bg-card/50">
                  <RadioGroup
                    value={selectedCurrency === "BTC" ? selectedPeriod : ""}
                    onValueChange={(value) => {
                      setSelectedCurrency("BTC");
                      setSelectedPeriod(value as LockPeriod);
                    }}
                  >
                    {Object.entries(periodNames).map(([period, name]) => (
                      <div
                        key={period}
                        className="flex items-center justify-between p-3 border-t border-border/10"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={period}
                            id={`btc-${period}`}
                            className="text-success border-success/30"
                          />
                          <Label htmlFor={`btc-${period}`}>{name}</Label>
                        </div>
                        <span className="text-success">
                          {interestRates.BTC[period as LockPeriod]}%
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>

            {/* USD Section */}
            <div className="rounded-md overflow-hidden">
              <button
                className="w-full flex items-center justify-between bg-card p-3 text-left"
                onClick={() => toggleCurrencyExpansion("USD")}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">
                    <span className="text-xs">🇺🇸</span>
                  </span>
                  <span>USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>0 %</span>
                  {expandedCurrency === "USD" ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {expandedCurrency === "USD" && (
                <div className="bg-card/50">
                  <RadioGroup
                    value={selectedCurrency === "USD" ? selectedPeriod : ""}
                    onValueChange={(value) => {
                      setSelectedCurrency("USD");
                      setSelectedPeriod(value as LockPeriod);
                    }}
                  >
                    {Object.entries(periodNames).map(([period, name]) => (
                      <div
                        key={period}
                        className="flex items-center justify-between p-3 border-t border-border/10"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={period}
                            id={`usd-${period}`}
                            className="text-success border-success/30"
                          />
                          <Label htmlFor={`usd-${period}`}>{name}</Label>
                        </div>
                        <span className="text-success">
                          {interestRates.USD[period as LockPeriod]}%
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Savings details */}
          <div className="bg-card/50 p-6 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Time:</span>
              <span>{currentTime}</span>
            </div>

            {selectedPeriod !== "flexible" && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Release Time:</span>
                <span>{calculateReleaseDate()}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Currency Chosen:</span>
              <span>{selectedCurrency}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Period Chosen:</span>
              <span>{periodNames[selectedPeriod]}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Your Rate:</span>
              <span className="text-success">
                {interestRates[selectedCurrency][selectedPeriod]}%
              </span>
            </div>

            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Your earnings:</span>
                <span>
                  {getCurrencySymbol(selectedCurrency)} {calculateEarnings()}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Account to transfer funds from:
                </span>
              </div>
              <Select defaultValue="710.05">
                <SelectTrigger className="bg-card border-card-foreground/10">
                  <SelectValue>710.05</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="710.05">710.05</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Enter Amount (In {selectedCurrency}):
                </span>
              </div>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-card border-card-foreground/10"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            className="bg-success hover:bg-success/90 text-success-foreground"
            disabled={!amount || Number.parseFloat(amount) <= 0}
          >
            Open Savings Account and invest{" "}
            {getCurrencySymbol(selectedCurrency)}
            {amount || "0.00"}
          </Button>
        </div>
      </div>
    </div>
  );
}

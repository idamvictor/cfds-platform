import { useState } from "react";
import {
  ArrowDownToLine,
  Wallet,
  Building2,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import useSiteSettingsStore from "@/store/siteSettingStore";
import useDataStore from "@/store/dataStore";
import CryptoFunding from "@/components/deposit-funds/CryptoFunding";
import CardFunding from "@/components/deposit-funds/CardFunding";
import { ExchangePartners } from "@/components/deposit/ExchangePartners";

type DepositMethod = "crypto" | "bank-wire" | "card" | null;

interface ContributePanelProps {
  onDepositSuccess?: () => void;
}

export function ContributePanel({ onDepositSuccess }: ContributePanelProps) {
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod>(null);
  const [showFundingForm, setShowFundingForm] = useState(false);
  const { settings } = useSiteSettingsStore();
  const { deposit_config } = useDataStore();

  const cryptoEnabled = deposit_config?.crypto?.enabled !== false;
  const cardEnabled =
    deposit_config?.credit_card?.enabled !== false &&
    settings?.credit_card_deposit;

  const url = window.location.href.toLowerCase();
  const stepsCount: 3 | 4 =
    url.includes("fincapitalmarkets.org") ||
    url.includes("equitymarketspro.com")
      ? 4
      : 3;

  const handleMethodSelect = (method: DepositMethod) => {
    setSelectedMethod(method);
  };

  const handleProceed = () => {
    if (selectedMethod) {
      setShowFundingForm(true);
    }
  };

  const handleBack = () => {
    setShowFundingForm(false);
    setSelectedMethod(null);
  };

  // When a funding sub-form is active, render it directly
  if (showFundingForm && selectedMethod) {
    // Bank-wire shows the exchange-partner selection screen
    if (selectedMethod === "bank-wire") {
      return <ExchangePartners onBack={handleBack} />;
    }

    return (
      <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="relative">
          {selectedMethod === "crypto" ? (
            <CryptoFunding
              onChangeMethod={handleBack}
              stepsCount={stepsCount}
              onDepositSuccess={onDepositSuccess}
            />
          ) : (
            <CardFunding
              onChangeMethod={handleBack}
              onClose={onDepositSuccess}
              onDepositSuccess={onDepositSuccess}
              stepsCount={stepsCount}
            />
          )}
        </div>
      </div>
    );
  }

  // Method-selection view (matches HTML reference design)
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-extrabold text-white sm:text-base">
            <ArrowDownToLine className="h-4 w-4 text-[#00dfa2]" />
            Deposit Funds
          </div>
          <div className="text-xs text-[#4a5468]">
            Choose how you want to add funds to your account
          </div>
        </div>

        {/* Method Cards */}
        <div className="flex flex-col gap-3">
          {/* Crypto Deposit */}
          {cryptoEnabled && (
            <button
              type="button"
              onClick={() => handleMethodSelect("crypto")}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedMethod === "crypto"
                  ? "border-[#00dfa2]/40 bg-[#00dfa2]/[0.06] shadow-[0_0_16px_rgba(0,223,162,0.08)]"
                  : "border-white/[0.06] bg-transparent hover:border-white/[0.12] hover:bg-white/[0.04]"
              }`}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(0,223,162,0.1)",
                  color: "#00dfa2",
                }}
              >
                <Wallet className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">
                  Crypto Deposit
                </div>
                <div className="text-xs text-[#5f6b7f]">
                  Send from external wallet
                </div>
                <span className="mt-1 inline-block rounded-full bg-[#c8e64e]/10 px-2 py-0.5 text-[10px] font-bold text-[#c8e64e]">
                  Recommended
                </span>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#4a5468]" />
            </button>
          )}

          {/* Bank Wire Transfer */}
          <button
            type="button"
            onClick={() => handleMethodSelect("bank-wire")}
            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
              selectedMethod === "bank-wire"
                ? "border-[#4A90E2]/40 bg-[#4A90E2]/[0.06] shadow-[0_0_16px_rgba(74,144,226,0.08)]"
                : "border-white/[0.06] bg-transparent hover:border-white/[0.12] hover:bg-white/[0.04]"
            }`}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(74,144,226,0.1)",
                color: "#4A90E2",
              }}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">
                Bank Wire Transfer
              </div>
              <div className="text-xs text-[#5f6b7f]">
                Via trusted exchange partners
              </div>
              <span className="mt-1 inline-block rounded-full bg-[#4A90E2]/10 px-2 py-0.5 text-[10px] font-bold text-[#4A90E2]">
                Trusted Partners
              </span>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#4a5468]" />
          </button>

          {/* Credit / Debit Card */}
          {cardEnabled && (
            <button
              type="button"
              onClick={() => handleMethodSelect("card")}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedMethod === "card"
                  ? "border-[#4A90E2]/40 bg-[#4A90E2]/[0.06] shadow-[0_0_16px_rgba(74,144,226,0.08)]"
                  : "border-white/[0.06] bg-transparent hover:border-white/[0.12] hover:bg-white/[0.04]"
              }`}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(74,144,226,0.1)",
                  color: "#4A90E2",
                }}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">
                  Credit / Debit Card
                </div>
                <div className="text-xs text-[#5f6b7f]">
                  Buy instantly via card
                </div>
                <span className="mt-1 inline-block rounded-full bg-[#4A90E2]/10 px-2 py-0.5 text-[10px] font-bold text-[#4A90E2]">
                  Visa · MC · Amex
                </span>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#4a5468]" />
            </button>
          )}
        </div>

        {/* Proceed Button */}
        {selectedMethod && (
          <div className="mt-5">
            <button
              type="button"
              onClick={handleProceed}
              className="gradient-btn-green flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-bold sm:w-auto"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Proceed to Deposit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

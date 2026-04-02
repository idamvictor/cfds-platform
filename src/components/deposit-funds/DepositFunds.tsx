import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import CardFunding from "./CardFunding";
import CryptoFunding from "./CryptoFunding";
import useDataStore from "@/store/dataStore";
import { Bitcoin, CreditCard } from "lucide-react";
import useUserStore from "@/store/userStore";

interface DepositFundsProps {
  onClose?: () => void;
}

const DepositFunds: React.FC<DepositFundsProps> = ({ onClose }) => {
  // selectedMethod keeps track of whether the user wants to use card or crypto for funding
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  // showCardFunding determines if we should show the detailed funding form (CardFunding or CryptoFunding)
  const [showCardFunding, setShowCardFunding] = useState(false);

  const url = window.location.href.toLowerCase();
  // stepsCount varies based on the domain to cater to different checkout flows
  const stepsCount =
    url.includes("fincapitalmarkets.org") ||
    url.includes("equitymarketspro.com")
      ? 4
      : 3;
  const mutedClass = useMutedTextClass();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const isVerified =
    user?.verification_status === "approved" ||
    user?.verification_status === "verified";
  const { deposit_config } = useDataStore();

  const cryptoEnabled = deposit_config?.crypto?.enabled !== false; // Default to true if not specified
  const cardEnabled = deposit_config?.credit_card?.enabled !== false;

  // If showCardFunding is true, render the specific funding component based on selectedMethod
  if (showCardFunding) {
    return (
      <div className="px-0">
        {" "}
        {selectedMethod === "card" ? (
          <CardFunding
            onChangeMethod={() => setShowCardFunding(false)}
            onClose={onClose}
            stepsCount={stepsCount}
          />
        ) : (
          <CryptoFunding
            onChangeMethod={() => setShowCardFunding(false)}
            stepsCount={stepsCount}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 px-0 text-white">
      <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#202635_0%,#161b27_8%,#131826_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.16),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#7ca2ff,#4d6bff)] text-lg font-semibold text-white">
                  D
                </div>
                <div className="text-sm text-white/60">
                  <span className="font-semibold text-white">
                    Deposit Funds
                  </span>
                  <span className="ml-1 hidden sm:inline">
                    secure account funding
                  </span>
                </div>
              </div>

              <div
                className={`max-w-2xl text-xs leading-relaxed md:text-sm ${mutedClass}`}
              >
                Add funds to your account to start trading instantly. You can
                deposit using Fiat or crypto payment methods below. For a record
                of your previous deposits, view your{" "}
                <span
                  className="cursor-pointer text-[#8bc5ff]"
                  onClick={() => {
                    if (onClose) onClose();
                    navigate("/main/deposit-history");
                  }}
                >
                  Transaction History
                </span>
                .
              </div>

              <div
                className={`mt-4 max-w-2xl rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-xs leading-relaxed md:text-sm ${mutedClass}`}
              >
                <strong>Note: Anti-Fraud Verification</strong> <br />
                For your security, some deposits may require additional
                verification. In certain cases, our team may request phone or
                identity confirmation before funds are credited.
              </div>
            </div>

            <div className="w-full max-w-[300px] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#1a1f2d,#121621)] px-4 py-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Payment Flow
              </div>
              <h3 className="mt-2 text-lg font-medium tracking-[-0.03em] text-white">
                Payment Method
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Choose your preferred funding route and continue to the secure
                deposit step.
              </p>
              {selectedMethod && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70">
                  Selected:{" "}
                  <span className="font-medium text-[#8bc5ff]">
                    {selectedMethod === "card"
                      ? "Credit/Debit Card"
                      : "Cryptocurrency"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <h3 className="text-base font-medium text-white md:text-lg">
              Payment Method
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Card Payment Option */}
            {cardEnabled && (
              <div
                onClick={() => setSelectedMethod("card")}
                className={`cursor-pointer rounded-[22px] border p-4 transition-all md:p-5 ${
                  selectedMethod === "card"
                    ? "border-[#8bc5ff] bg-[linear-gradient(180deg,rgba(53,74,129,0.48),rgba(18,24,39,0.95))] shadow-[0_18px_60px_rgba(73,116,255,0.18)]"
                    : "border-white/10 bg-[linear-gradient(180deg,#1a1f2d,#141925)] hover:border-white/20"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18253d] text-[#8bc5ff]">
                    <CreditCard className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {selectedMethod === "card" && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5b87ff] text-white">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    )}
                    {!isVerified && (
                      <span className="whitespace-nowrap rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-amber-400 md:text-[11px]">
                        KYC Required
                      </span>
                    )}
                  </div>
                </div>
                <h4 className="text-base font-semibold text-white md:text-lg">
                  Credit/Debit Card
                </h4>
                <div className="mb-2 mt-2 flex items-center gap-1 text-xs text-[#8bc5ff] md:text-sm">
                  <span>+</span>
                  <span>
                    {deposit_config?.credit_card?.estimated_time || "Instant"}
                  </span>
                </div>
                <p className={`text-xs md:text-sm ${mutedClass}`}>
                  Supported: Visa, Mastercard, Amex, Discover
                </p>
              </div>
            )}

            {/* Crypto Payment Option */}
            {cryptoEnabled && (
              <div
                onClick={() => setSelectedMethod("crypto")}
                className={`cursor-pointer rounded-[22px] border p-4 transition-all md:p-5 ${
                  selectedMethod === "crypto"
                    ? "border-[#8bc5ff] bg-[linear-gradient(180deg,rgba(53,74,129,0.48),rgba(18,24,39,0.95))] shadow-[0_18px_60px_rgba(73,116,255,0.18)]"
                    : "border-white/10 bg-[linear-gradient(180deg,#1a1f2d,#141925)] hover:border-white/20"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3a2416] text-[#ffae5d]">
                    <Bitcoin className="h-5 w-5 md:h-6 md:w-6" />
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    {selectedMethod === "crypto" && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5b87ff] text-white">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="text-base font-semibold text-white md:text-lg">
                  Cryptocurrency
                </h4>
                <div className="mb-2 mt-2 flex items-center gap-1 text-xs text-[#8bc5ff] md:text-sm">
                  <span>+</span>
                  <span>
                    {deposit_config?.crypto?.estimated_time || "Instant"}
                  </span>
                </div>
                <p className={`text-xs md:text-sm ${mutedClass}`}>
                  Supported: BTC, ETH, USDT, and other major assets
                </p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {selectedMethod && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowCardFunding(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5b87ff] px-6 py-3 font-semibold text-white transition-all hover:bg-[#6b92ff] md:w-auto"
              >
                Next
                <span> → </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositFunds;

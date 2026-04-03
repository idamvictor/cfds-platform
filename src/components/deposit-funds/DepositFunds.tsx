import { useState } from "react";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import { Lock } from "lucide-react";
import CardFunding from "./CardFunding";
import CryptoFunding from "./CryptoFunding";
import useDataStore from "@/store/dataStore";
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
  const stepsCount = (url.includes("fincapitalmarkets.org") || url.includes("equitymarketspro.com")) ? 4 : 3;
  const mutedClass = useMutedTextClass();
  const { user } = useUserStore();
  const isVerified = user?.verification_status === "approved" || user?.verification_status === "verified";
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
            onClose={onClose}
            stepsCount={stepsCount}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground px-0">

      {/* Info Text */}
      <div className="space-y-4">
        <p className={`text-xs md:text-sm ${mutedClass} leading-relaxed`}>
          Add funds to your account to start trading instantly. You can deposit
          using Fiat or crypto payment methods below
        </p>

        <div className="flex items-start gap-2">
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className={`text-xs md:text-sm ${mutedClass} leading-relaxed`}>
            <strong>Note: Anti-Fraud Verification</strong> <br />
            For your security, some deposits may require additional verification.
            In certain cases, our team may request phone or identity confirmation
            before funds are credited.
          </p>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          Payment Method
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {/* Card Payment Option */}
          {cardEnabled && (
            <div
              onClick={() => setSelectedMethod("card")}
              className={`rounded-lg md:rounded-2xl border-2 p-4 md:p-6 transition-all duration-300 cursor-pointer group ${
                selectedMethod === "card"
                  ? "border-accent border-dashed bg-accent/10 shadow-xl scale-[1.03] z-10"
                  : "border-accent/30 bg-card/40 hover:border-accent/50 hover:bg-accent/5 hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {!isVerified && (
                    <span className="bg-amber-500/10 text-amber-500 text-[9px] md:text-[10px] px-2 py-1 rounded-lg font-black whitespace-nowrap border border-amber-500/20 uppercase tracking-tighter">
                      KYC Required
                    </span>
                  )}
                  <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-2xl flex-shrink-0 p-2 border border-blue-500/20 shadow-inner">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png" 
                      alt="Credit Card" 
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {selectedMethod === "card" && (
                    <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 bg-accent rounded-full flex-shrink-0">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-1">
                Credit/Debit Card
              </h4>
              <div className="flex items-center gap-1 text-accent text-xs md:text-sm mb-2">
                <span>⚡</span>
                <span>{deposit_config?.credit_card?.estimated_time || "Instant"}</span>
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
              className={`rounded-lg md:rounded-2xl border-2 p-4 md:p-6 transition-all duration-300 cursor-pointer group ${
                selectedMethod === "crypto"
                  ? "border-accent border-dashed bg-accent/10 shadow-xl scale-[1.03] z-10"
                  : "border-accent/30 bg-card/40 hover:border-accent/50 hover:bg-accent/5 hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-orange-500/10 rounded-2xl flex-shrink-0 p-2 border border-orange-500/20 shadow-inner">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/7048/7048906.png" 
                    alt="Cryptocurrency" 
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  {selectedMethod === "crypto" && (
                    <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 bg-accent rounded-full flex-shrink-0">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-1">
                Cryptocurrency
              </h4>
              <div className="flex items-center gap-1 text-accent text-xs md:text-sm mb-2">
                <span>🕑</span>
                <span>{deposit_config?.crypto?.estimated_time || "Instant"}</span>
              </div>
              <p className={`text-xs md:text-sm ${mutedClass}`}>
                Supported: BTC, ETH, USDT, and other major assets
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {selectedMethod && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setShowCardFunding(true)}
            className="w-full md:w-auto inline-flex items-center justify-center md:justify-start gap-2 px-10 py-3.5 font-black uppercase tracking-tighter rounded-xl transition-all bg-accent text-background hover:bg-accent/90 hover:scale-[1.02] hover:shadow-xl shadow-lg cursor-pointer"
          >
            Next
            <span>→</span>
          </button>
        </div>
      )}


    </div>
  );
};

export default DepositFunds;

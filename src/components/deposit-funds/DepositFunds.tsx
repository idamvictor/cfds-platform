import { useState, useRef } from "react";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import CardFunding from "./CardFunding";
import CryptoFunding from "./CryptoFunding";
import DepositHistory from "@/components/deposit-history";

const DepositFunds = () => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showCardFunding, setShowCardFunding] = useState(false);
  const mutedClass = useMutedTextClass();
  const depositHistoryRef = useRef<HTMLDivElement>(null);

  if (showCardFunding) {
    return (
      <div className="px-4 md:px-6 lg:px-10">
        {" "}
        {selectedMethod === "card" ? (
          <CardFunding onChangeMethod={() => setShowCardFunding(false)} />
        ) : (
          <CryptoFunding onChangeMethod={() => setShowCardFunding(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground px-4 md:px-6 lg:px-10">
      {/* Info Text */}
      <div className="space-y-4">
        <p className={`text-xs md:text-sm ${mutedClass} leading-relaxed`}>
          You can speed up the checkout process by ensuring ahead of time that
          you have adequate funds in your account to cover all planned
          purchases. On this page, you can top-up your account funds using any
          accepted payment method. To view your previous top-up transactions,
          click here:{" "}
          <span
            className="text-accent cursor-pointer"
            onClick={() =>
              depositHistoryRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Transaction History
          </span>
        </p>

        <p className={`text-xs md:text-sm ${mutedClass} leading-relaxed`}>
          When topping up your balance, please note: Per our fraud control
          guidelines, some transactions (especially those involving third-party
          payments) may require additional verification. In some cases, we'll
          need phone verification for
        </p>
      </div>

      {/* Payment Method Section */}
      <div className="space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          Payment Method
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {/* Card Payment Option */}
          <div
            onClick={() => setSelectedMethod("card")}
            className={`rounded-lg md:rounded-2xl border-2 p-4 md:p-6 cursor-pointer transition-all ${
              selectedMethod === "card"
                ? "border-accent bg-accent/5 shadow-md"
                : "border-border hover:border-border/80 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 8H4V6h16m0 12H4v-6h16m0-8H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
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
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-1">
              Credit/Debit Card
            </h4>
            <div className="flex items-center gap-1 text-accent text-xs md:text-sm mb-2">
              <span>⚡</span>
              <span>Instant processing</span>
            </div>
            <p className={`text-xs md:text-sm ${mutedClass}`}>
              Visa, Mastercard, Amex, Discover
            </p>
          </div>

          {/* Crypto Payment Option */}
          <div
            onClick={() => setSelectedMethod("crypto")}
            className={`rounded-lg md:rounded-2xl border-2 p-4 md:p-6 cursor-pointer transition-all ${
              selectedMethod === "crypto"
                ? "border-accent bg-accent/5 shadow-md"
                : "border-border hover:border-border/80 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
                </svg>
              </div>
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
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-1">
              Cryptocurrency
            </h4>
            <div className="flex items-center gap-1 text-accent text-xs md:text-sm mb-2">
              <span>⏱</span>
              <span>Instant</span>
            </div>
            <p className={`text-xs md:text-sm ${mutedClass}`}>
              BTC, ETH, USDT, and more
            </p>
          </div>
        </div>
      </div>

      {/* Next Button */}
      {selectedMethod && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setShowCardFunding(true)}
            className="w-full md:w-auto inline-flex items-center justify-center md:justify-start gap-2 px-6 py-2 bg-accent text-primary-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Next
            <span>→</span>
          </button>
        </div>
      )}

      {/* Deposit History */}
      <div ref={depositHistoryRef}>
        <DepositHistory />
      </div>
    </div>
  );
};

export default DepositFunds;

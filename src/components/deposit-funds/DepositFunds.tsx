import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import CardFunding from "./CardFunding";

const DepositFunds = () => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showCardFunding, setShowCardFunding] = useState(false);
  const mutedClass = useMutedTextClass();

  if (showCardFunding) {
    return (
      <div className="px-10">
        {" "}
        <CardFunding onChangeMethod={() => setShowCardFunding(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground px-10">
      {/* Info Text */}
      <div className="space-y-4">
        <p className={`text-sm ${mutedClass} leading-relaxed`}>
          You can speed up the checkout process by ensuring ahead of time that
          you have adequate funds in your account to cover all planned
          purchases. On this page, you can top-up your account funds using any
          accepted payment method. To view your previous top-up transactions,
          click here:{" "}
          <span className="text-accent cursor-pointer">
            Transaction History
          </span>
        </p>

        <p className={`text-sm ${mutedClass} leading-relaxed`}>
          When topping up your balance, please note: Per our fraud control
          guidelines, some transactions (especially those involving third-party
          payments) may require additional verification. In some cases, we'll
          need phone verification for
        </p>
      </div>

      {/* Payment Method Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Payment Method
        </h3>

        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="space-y-4">
            {/* Card Payment Option */}
            <div
              className={`flex items-start space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                selectedMethod === "card"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:bg-card/50"
              }`}
              onClick={() => setSelectedMethod("card")}
            >
              <RadioGroupItem value="card" id="card" className="mt-1" />
              <div className="flex-1">
                <label
                  htmlFor="card"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-6 h-6 bg-muted-foreground/20 rounded flex items-center justify-center">
                    <span className="text-xs">💳</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    Card Payment
                  </span>
                </label>
                <p className={`text-sm ${mutedClass} mt-2`}>
                  We accept Visa, Mastercard, American Express and Discover
                </p>
              </div>
            </div>

            {/* Crypto Option - Disabled */}
            <div className="flex items-start space-x-4 rounded-lg border p-4 cursor-not-allowed opacity-50 transition-colors border-border">
              <RadioGroupItem
                value="crypto"
                id="crypto"
                className="mt-1"
                disabled
              />
              <div className="flex-1">
                <label htmlFor="crypto" className="cursor-not-allowed">
                  <span className={`font-semibold ${mutedClass}`}>
                    Crypto (Coming Soon)
                  </span>
                </label>
                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">₿</span>
                    <span className={`text-sm ${mutedClass}`}>Bitcoin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">Ξ</span>
                    <span className={`text-sm ${mutedClass}`}>
                      Ethereum, and more
                    </span>
                  </div>
                </div>
                <p className={`text-sm ${mutedClass} mt-2`}>
                  Cryptocurrency payments are coming soon.
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Next Button */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setShowCardFunding(true)}
          className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-primary-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
        >
          Next
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default DepositFunds;

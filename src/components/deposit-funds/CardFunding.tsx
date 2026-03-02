import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import { useMutedPlaceholderClass } from "@/hooks/useMutedPlaceholderClass";
import { useStepNumberColor } from "@/hooks/useStepNumberColor";

interface CardFundingProps {
  onChangeMethod: () => void;
}

const CardFunding: React.FC<CardFundingProps> = ({ onChangeMethod }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const mutedClass = useMutedTextClass();
  const mutedPlaceholderClass = useMutedPlaceholderClass();
  const stepNumberColor = useStepNumberColor();
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  return (
    <div className="space-y-6 text-foreground">
      {/* Header and Progress Tracker */}
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-2xl">
          {[
            { number: 1, label: "Fund Account" },
            { number: 2, label: "Payment Details" },
            { number: 3, label: "Successful" },
          ].map((step, index, allSteps) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                  step.number < currentStep
                    ? "bg-accent text-primary-foreground"
                    : step.number === currentStep
                      ? "bg-primary text-primary-foreground border-2 border-accent"
                      : `bg-muted ${stepNumberColor}`
                }`}
              >
                {step.number < currentStep ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step Label */}
              <span
                className={`ml-2 text-sm font-medium ${
                  step.number <= currentStep ? "text-foreground" : mutedClass
                }`}
              >
                {step.label}
              </span>

              {/* Divider */}
              {index < allSteps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    step.number < currentStep ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <p className={`text-sm ${mutedClass} leading-relaxed`}>
            When topping up your account balance with credit card, the minimum
            amount is $250.00 and the maximum amount is $100000.00 a day. If you
            need to increase your limit, please{" "}
            <span className="text-accent cursor-pointer">
              contact our Support team
            </span>
          </p>

          <div className="space-y-4 max-w-md">
            {/* Quick Amount Selection */}
            <div className="space-y-2">
              <p className={`text-xs font-semibold ${mutedClass} uppercase`}>
                Quick Select
              </p>
              <div className="flex gap-3">
                {["250", "1000", "5000"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      amount === value
                        ? "border-accent bg-accent text-primary-foreground"
                        : `border-input text-foreground hover:border-accent hover:bg-accent/10`
                    }`}
                  >
                    ${Number(value).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-base font-bold text-foreground">
                Amount to Add
              </label>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Amount"
                  className={`flex-1 px-4 py-2 rounded-lg border-2 border-input bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
              </div>
            </div>

            {/* Payment Method Display */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Payment Method
              </label>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💳</span>
                  <span className="text-foreground">Card Payment</span>
                </div>
                <button
                  onClick={onChangeMethod}
                  className="text-accent hover:text-accent/80 font-semibold text-sm"
                >
                  CHANGE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Security Notice */}
          <p
            className={`text-sm ${mutedClass} leading-relaxed bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800`}
          >
            Citation invest uses secure, encrypted technology to store and
            handle your credit card information. Rest assured, the confidential
            data you enter here is safe. Where possible, we've pre-populated the
            entry fields on this page with your previously stored information.
          </p>

          {/* Card Details Section */}
          <div className="space-y-4 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              Card Details
            </h3>

            <input
              type="text"
              placeholder="Name on Card"
              value={cardDetails.nameOnCard}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, nameOnCard: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg border-2 border-input bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
            />

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border-2 border-input bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      expiryDate: e.target.value,
                    })
                  }
                  className={`px-4 py-2 rounded-lg border-2 border-input bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  className={`px-4 py-2 rounded-lg border-2 border-input bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6 text-center py-8">
          {/* Loading Spinner */}
          <div className="flex justify-center">
            <div className="animate-spin">
              <svg
                className="w-12 h-12 text-accent"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Payment Processing Heading */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Payment Processing
            </h2>

            {/* Status Messages */}
            <div className={`space-y-3 ${mutedClass}`}>
              <p className="text-sm leading-relaxed">
                Your payment is under review
              </p>
              <p className="text-sm leading-relaxed">
                as part of compliance and regulation, the account department
                <br />
                may call the client to complete verification.
              </p>
              <p className="text-sm leading-relaxed">
                Once payment is approved and verified, the account will be
                funded.
              </p>
            </div>
          </div>

          {/* Okay Button */}
          <div className="pt-4">
            <button className="inline-flex items-center gap-2 px-8 py-2 bg-accent text-primary-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {currentStep < 3 && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => {
              if (currentStep === 1) {
                onChangeMethod();
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors"
          >
            ← Previous
          </button>
          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-primary-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Next
              <span>→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardFunding;

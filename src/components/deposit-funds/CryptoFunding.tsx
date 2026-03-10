import React, { useState } from "react";
import {
  CheckCircle2,
  Info,
  Wifi,
  Copy,
  RotateCw,
  AlertCircle,
  Check,
} from "lucide-react";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import { useStepNumberColor } from "@/hooks/useStepNumberColor";

interface CryptoFundingProps {
  onChangeMethod: () => void;
}

const CryptoFunding: React.FC<CryptoFundingProps> = ({ onChangeMethod }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCrypto, setSelectedCrypto] = useState("usdc");
  const [copied, setCopied] = useState(false);
  const mutedClass = useMutedTextClass();
  const stepNumberColor = useStepNumberColor();

  const depositAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivNa";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cryptoOptions = [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      price: "$64,240.21",
      change: "+1.24%",
      icon: "₿",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      price: "$3,452.12",
      change: "-0.45%",
      icon: "Ξ",
    },
    {
      id: "usdt",
      name: "Tether",
      symbol: "USDT",
      price: "$1.00",
      change: "0.00%",
      icon: "₮",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      price: "$1.00",
      change: "0.00%",
      icon: "◇",
      selected: true,
    },
  ];

  return (
    <div className="space-y-6 text-foreground min-h-[550px]">
      {/* Header and Progress Tracker */}
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-2xl">
          {[
            { number: 1, label: "Network" },
            { number: 2, label: "Address" },
            { number: 3, label: "Confirm" },
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

      {/* Step 1: Select Network */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Crypto Selection Cards */}
            <div className="lg:col-span-2 space-y-4">
              {/* Crypto Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                {cryptoOptions.map((crypto) => (
                  <div
                    key={crypto.id}
                    onClick={() => setSelectedCrypto(crypto.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                      selectedCrypto === crypto.id
                        ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/40"
                        : "border-border bg-card dark:bg-slate-800 hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="text-3xl">{crypto.icon}</div>
                      </div>

                      {/* Name and Symbol */}
                      <div className="flex-grow">
                        <p className="font-semibold text-foreground text-sm">
                          {crypto.name}
                        </p>
                        <p className={`text-xs ${mutedClass}`}>
                          {crypto.symbol}
                        </p>
                      </div>

                      {/* Price and Change */}
                      <div className="flex-shrink-0 text-right">
                        <p className="font-semibold text-foreground text-sm">
                          {crypto.price}
                        </p>
                        <p
                          className={`text-xs ${
                            crypto.change.startsWith("+")
                              ? "text-green-600 dark:text-green-400"
                              : crypto.change.startsWith("0")
                                ? mutedClass
                                : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {crypto.change}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Choosing the right asset */}
              <div
                className={`p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 space-y-3`}
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                      Choosing the right asset
                    </h4>
                    <p className={`text-sm leading-relaxed mt-1 ${mutedClass}`}>
                      Ensure you select the correct asset you intend to send.
                      Sending an unsupported or incorrect asset to your deposit
                      address may result in permanent loss of funds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Guarantee */}
              <div
                className={`p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 space-y-3`}
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                      Security Guarantee
                    </h4>
                    <p className={`text-sm leading-relaxed mt-1 ${mutedClass}`}>
                      Your payment information is encrypted and never stored on
                      our servers directly. We comply with PCI-DSS standards to
                      ensure your data remains 100% secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HOW IT WORKS Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                How it works
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Select Network",
                    description: "Match the network of your source wallet.",
                    icon: Wifi,
                  },
                  {
                    title: "Copy Address",
                    description: "Copy or scan the unique deposit address",
                    icon: Copy,
                  },
                  {
                    title: "Confirmations",
                    description: "Wait for blockchain confirmations",
                    icon: RotateCw,
                  },
                ].map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <IconComponent className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {step.title}
                        </p>
                        <p className={`text-xs ${mutedClass} mt-0.5`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Select Network and Get Deposit Address */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Description */}
          <p className={`text-sm ${mutedClass}`}>
            Select your preferred network and get your deposit address.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Select Coin, Network, and Warning */}
            <div className="space-y-4">
              {/* Select Coin */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Select Coin
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card dark:bg-slate-800">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    ₿
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Bitcoin
                    </p>
                    <p className={`text-xs ${mutedClass}`}>BTC</p>
                  </div>
                  <RotateCw className="w-4 h-4 text-foreground" />
                </div>
              </div>

              {/* Select Network */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Select Network
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card dark:bg-slate-800">
                  <p className="flex-1 text-sm text-foreground">
                    Bitcoin (BTC)
                  </p>
                  <RotateCw className="w-4 h-4 text-foreground" />
                </div>
              </div>

              {/* Safety Warning */}
              <div className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200">
                      Safety Warning
                    </h4>
                    <p
                      className={`text-sm leading-relaxed mt-1 text-yellow-800 dark:text-yellow-300`}
                    >
                      Ensure you are sending Bitcoin (BTC) only to this address
                      via the BTC network. Sending any other asset or using a
                      different network may result in permanent loss of funds.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: QR Code and Deposit Address */}
            <div className="space-y-4">
              {/* QR Code Section */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Scan QR code to deposit
                </label>
                <div className="flex items-center justify-center p-8 rounded-lg bg-black dark:bg-black">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-24 h-24"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Simple QR code placeholder */}
                        <rect
                          x="10"
                          y="10"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="20"
                          y="10"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="30"
                          y="10"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="10"
                          y="20"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="30"
                          y="20"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="10"
                          y="30"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="20"
                          y="30"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="30"
                          y="30"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="50"
                          y="50"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="60"
                          y="50"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="70"
                          y="50"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="50"
                          y="60"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="70"
                          y="60"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="50"
                          y="70"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="60"
                          y="70"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="70"
                          y="70"
                          width="10"
                          height="10"
                          fill="black"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deposit Address */}
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 rounded-lg border border-border bg-card dark:bg-slate-800">
                  <span className={`text-sm break-all ${mutedClass}`}>
                    {depositAddress}
                  </span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyAddress}
                  className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors ${
                    copied
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Expected Arrival and Minimum Deposit */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p
                    className={`text-xs font-semibold uppercase ${mutedClass} mb-2`}
                  >
                    Expected Arrival
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    ~10-60 Minutes
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold uppercase ${mutedClass} mb-2`}
                  >
                    Minimum Deposit
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    0.0001 BTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
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
                Your crypto deposit is being processed
              </p>
              <p className="text-sm leading-relaxed">
                once the required blockchain confirmations are complete,
                <br />
                your funds will appear in your trading account.
              </p>
              <p className="text-sm leading-relaxed">
                This process typically takes 10-60 minutes depending on network
                congestion.
              </p>
            </div>
          </div>

          {/* Okay Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
              }}
              className="inline-flex items-center gap-2 px-8 py-2 bg-accent text-primary-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="inline-flex items-center gap-2 px-6 py-2 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            ← Previous
          </button>
        )}
        {currentStep === 1 && (
          <button
            type="button"
            onClick={onChangeMethod}
            className="inline-flex items-center gap-2 px-6 py-2 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            ← Previous
          </button>
        )}
        {currentStep < 3 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-primary-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Next
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CryptoFunding;

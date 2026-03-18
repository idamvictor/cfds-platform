import React, { useEffect, useState, useMemo } from "react";
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
import useDataStore from "@/store/dataStore";
import { useDepositMutation } from "@/services/deposit/deposit-queries";
import { QRCodeSVG } from "qrcode.react";

interface CryptoFundingProps {
  onChangeMethod: () => void;
  stepsCount?: 3 | 4;
}

const CryptoFunding: React.FC<CryptoFundingProps> = ({ 
  onChangeMethod,
  stepsCount = 4
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const mutedClass = useMutedTextClass();
  const stepNumberColor = useStepNumberColor();

  const { data } = useDataStore();
  const depositMutation = useDepositMutation();

  const wallets = useMemo(() => data?.wallets || [], [data?.wallets]);
  const cryptoNetworks = useMemo(
    () => data?.crypto_networks || [],
    [data?.crypto_networks],
  );

  // Set first wallet as default
  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0].id);
    }
  }, [wallets, selectedWallet]);

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet);

  const handleCopyAddress = () => {
    if (selectedWalletData) {
      navigator.clipboard.writeText(selectedWalletData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const qrCodeValue = useMemo(() => {
    if (!selectedWalletData?.address) return "";
    
    const address = selectedWalletData.address;
    const amount = depositAmount;
    const crypto = selectedWalletData.crypto.toLowerCase();

    if (!amount) return address;

    // Standard URI schemes for common cryptocurrencies
    switch (crypto) {
      case "btc":
      case "bitcoin":
        return `bitcoin:${address}?amount=${amount}`;
      case "eth":
      case "ethereum":
        // ETH value is usually in wei in some specs, but many wallets accept decimal ETH
        return `ethereum:${address}?value=${amount}`;
      case "usdt":
        // USDT doesn't have a single standard URI, often just the address is used
        // or a specific network scheme. Sticking to address if it's not ETH/BTC
        return address;
      default:
        return address;
    }
  }, [selectedWalletData, depositAmount]);

  const handleSubmitDeposit = async () => {
    if (!depositAmount || !selectedWallet) return;

    try {
      await depositMutation.mutateAsync({
        amount: parseFloat(depositAmount),
        method: "crypto",
        wallet_id: selectedWallet,
        card_holder_name: "",
        card_number: "",
        exp_date: "",
        csv: "",
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Deposit submission failed:", error);
    }
  };

  const handleNextStep = () => {
    if (stepsCount === 3 && currentStep === 2) {
      handleSubmitDeposit();
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      if (stepsCount === 3 && currentStep === 3) {
        setIsSubmitted(false);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-2 md:space-y-3 text-foreground">
      {/* Header and Progress Tracker */}
      <div className="space-y-2 md:space-y-3">
        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-2xl overflow-x-auto pb-1">
          {(stepsCount === 3
            ? [
                { number: 1, label: "Network" },
                { number: 2, label: "Address" },
                { number: 3, label: "Completed" },
              ]
            : [
                { number: 1, label: "Network" },
                { number: 2, label: "Address" },
                { number: 3, label: "Payment Review" },
                { number: 4, label: "Completed" },
              ]
          ).map((step, index, allSteps) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full font-semibold text-xs md:text-sm transition-colors flex-shrink-0 ${
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
                className={`ml-1 md:ml-2 text-xs md:text-sm font-medium whitespace-nowrap ${
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
        <div className="space-y-2 md:space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            {/* Crypto Selection Cards */}
            <div className="lg:col-span-2 space-y-2 md:space-y-3">
              {/* Wallet Cards Grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    onClick={() => setSelectedWallet(wallet.id)}
                    className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all relative ${
                      selectedWallet === wallet.id
                        ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/40"
                        : "border-border bg-card dark:bg-slate-800 hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="text-xl md:text-2xl">
                          {wallet.crypto === "BTC"
                            ? "₿"
                            : wallet.crypto === "ETH"
                              ? "Ξ"
                              : "◇"}
                        </div>
                      </div>

                      {/* Name and Network */}
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-foreground text-xs md:text-sm truncate">
                          {wallet.crypto}
                        </p>
                        <p className={`text-xs ${mutedClass} truncate`}>
                          {wallet.crypto_network}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <div className="flex-shrink-0 text-right">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            wallet.type === "wallet"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {wallet.type === "wallet" ? "Wallet" : "Link"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Choosing the right asset and Security */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div
                  className={`p-2 md:p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 space-y-1 md:space-y-2`}
                >
                  <div className="flex items-start gap-1.5 md:gap-2">
                    <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[10px] md:text-xs text-blue-900 dark:text-blue-200">
                        Choosing the right asset
                      </h4>
                      <p
                        className={`text-[10px] md:text-xs leading-tight mt-0.5 ${mutedClass}`}
                      >
                        Ensure you select the correct asset to avoid loss of funds.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-2 md:p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 space-y-1 md:space-y-2`}
                >
                  <div className="flex items-start gap-1.5 md:gap-2">
                    <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[10px] md:text-xs text-blue-900 dark:text-blue-200">
                        Security Guarantee
                      </h4>
                      <p
                        className={`text-[10px] md:text-xs leading-tight mt-0.5 ${mutedClass}`}
                      >
                        Your payment data is encrypted and secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HOW IT WORKS Section */}
            <div className="space-y-2 md:space-y-3 hidden lg:block">
              <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                How it works
              </h3>

              <div className="space-y-2 md:space-y-3">
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
                    <div key={index} className="flex gap-1.5 md:gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] md:text-xs font-semibold text-foreground">
                          {step.title}
                        </p>
                        <p className={`text-[10px] ${mutedClass} mt-0.5 leading-tight`}>
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
      {currentStep === 2 && selectedWallet && (
        <div className="space-y-2 md:space-y-3">
          {/* Description */}
          <p className={`text-[10px] md:text-xs ${mutedClass}`}>
            Confirm your deposit method and get your deposit address.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {/* Left Side: Selected Wallet and Networks */}
            <div className="space-y-2 md:space-y-3">
              {/* Selected Wallet */}
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-semibold text-foreground">
                  Deposit Method
                </label>
                <div className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-lg border border-border bg-card dark:bg-slate-800">
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] md:text-xs flex-shrink-0">
                    {wallets.find((w) => w.id === selectedWallet)?.crypto ===
                    "BTC"
                      ? "₿"
                      : "◇"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] md:text-xs font-semibold text-foreground truncate">
                      {wallets.find((w) => w.id === selectedWallet)?.crypto}
                    </p>
                    <p className={`text-[10px] ${mutedClass} truncate`}>
                      {
                        wallets.find((w) => w.id === selectedWallet)
                          ?.crypto_network
                      }
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      wallets.find((w) => w.id === selectedWallet)?.type ===
                      "wallet"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {wallets.find((w) => w.id === selectedWallet)?.type ===
                    "wallet"
                      ? "Wallet"
                      : "Link"}
                  </span>
                </div>
              </div>

              {/* Available Networks */}
              {cryptoNetworks.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[10px] md:text-xs font-semibold text-foreground">
                    Available Networks
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    {cryptoNetworks.map((network) => (
                      <div
                        key={network}
                        className="flex items-center justify-center p-1.5 md:p-2 rounded-lg border border-border bg-card dark:bg-slate-800"
                      >
                        <p className="text-[10px] md:text-xs text-foreground text-center">
                          {network}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deposit Amount */}
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-semibold text-foreground">
                  Deposit Amount
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-card dark:bg-slate-800 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent text-[10px] md:text-xs"
                  />
                  <span className="w-16 px-1.5 py-1.5 text-[10px] md:text-xs font-semibold text-foreground bg-card dark:bg-slate-800 rounded-lg border border-border text-center">
                    {wallets.find((w) => w.id === selectedWallet)?.crypto ||
                      "BTC"}
                  </span>
                </div>
              </div>

              {/* Safety Warning */}
              <div className="p-2 md:p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20 space-y-1 md:space-y-1.5">
                <div className="flex items-start gap-1.5 md:gap-2">
                  <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[10px] md:text-xs text-yellow-900 dark:text-yellow-200">
                      Safety Warning
                    </h4>
                    <p
                      className={`text-[10px] md:text-xs leading-tight mt-0.5 text-yellow-800 dark:text-yellow-300`}
                    >
                      Ensure you reach via the correct network. Sending other assets or using a different network may result in loss of funds.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: QR Code and Deposit Address */}
            <div className="space-y-2 md:space-y-3">
              {/* QR Code Section */}
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-semibold text-foreground">
                  {selectedWalletData?.address && depositAmount
                    ? "Scan QR code to deposit"
                    : "Deposit Information"}
                </label>
                <div className="flex items-center justify-center p-2.5 md:p-4 rounded-lg transition-colors bg-white border border-gray-100 dark:bg-slate-900/50 dark:border-slate-800">
                  {selectedWalletData?.address && depositAmount ? (
                    <div className="text-black dark:text-slate-200">
                      <QRCodeSVG
                        value={qrCodeValue}
                        size={160}
                        level="H"
                        includeMargin={false}
                        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                        fgColor="currentColor"
                        bgColor="transparent"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center text-center p-3">
                      <span className={`text-[10px] md:text-[11px] ${mutedClass}`}>
                        {!selectedWalletData?.address 
                          ? "No address" 
                          : "Enter amount for QR"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deposit Address */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 p-1.5 md:p-2 rounded-lg border border-border bg-card dark:bg-slate-800 overflow-hidden">
                  <span
                    className={`text-[10px] md:text-[11px] break-all ${mutedClass}`}
                  >
                    {selectedWalletData?.address || "No address"}
                  </span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyAddress}
                  className={`flex-shrink-0 inline-flex items-center justify-center gap-1 px-2 md:px-2.5 py-1.5 font-semibold text-[10px] md:text-xs rounded-lg transition-colors ${
                    copied
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Expected Arrival and Minimum Deposit */}
              <div className="flex justify-between pt-1 md:pt-2">
                <div>
                  <p
                    className={`text-[8px] md:text-[10px] font-semibold uppercase ${mutedClass} mb-0.5`}
                  >
                    Expected Arrival
                  </p>
                  <p className="text-[10px] md:text-xs font-bold text-foreground">
                    ~10-60 Min
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-[8px] md:text-[10px] font-semibold uppercase ${mutedClass} mb-0.5`}
                  >
                    Min Deposit
                  </p>
                  <p className="text-[10px] md:text-xs font-bold text-foreground">
                    0.0001 BTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment Review & Processing */}
      {currentStep === 3 && (
        <div className="space-y-4 md:space-y-6 w-full">
          {!isSubmitted ? (
            <>
              {/* Review Summary Card */}
              <div className="bg-card border-2 border-border/50 rounded-xl overflow-hidden">
                <div className="p-4 md:p-6 space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
                    <span>📋</span> Deposit Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className={`text-xs md:text-sm ${mutedClass}`}>
                        Amount to Deposit
                      </span>
                      <span className="text-sm md:text-base font-bold text-accent">
                        {depositAmount}{" "}
                        {selectedWalletData?.crypto || "BTC"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className={`text-xs md:text-sm ${mutedClass}`}>
                        Network
                      </span>
                      <span className="text-xs md:text-sm font-medium">
                        {selectedWalletData?.crypto_network}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className={`text-xs md:text-sm ${mutedClass}`}>
                        To Address
                      </span>
                      <span className="text-[10px] md:text-xs font-medium break-all text-right max-w-[200px]">
                        {selectedWalletData?.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-muted/30 p-4 md:p-6 border-t border-border/50">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className={`text-[10px] md:text-xs ${mutedClass}`}>
                      Please ensure you have sent the exact amount to the
                      address above before confirming. The transaction will be
                      reviewed by our team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 md:gap-3 pt-2 md:pt-4 w-full">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-muted text-foreground font-semibold text-sm md:text-base rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={depositMutation.isPending}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitDeposit}
                  disabled={depositMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-accent text-background font-semibold text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositMutation.isPending
                    ? "Processing..."
                    : "Confirm & Notify Admin"}
                  <span>→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 md:space-y-6 text-center py-6 md:py-8">
              {/* Loading Spinner */}
              {depositMutation.isPending && (
                <div className="flex justify-center">
                  <div className="animate-spin">
                    <svg
                      className="w-8 h-8 md:w-12 md:h-12 text-accent"
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
              )}

              {/* Payment Processing Heading */}
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {depositMutation.isPending
                    ? "Payment Processing"
                    : depositMutation.isSuccess
                      ? "Waiting for Confirmation"
                      : "Deposit Failed"}
                </h2>

                {/* Status Messages */}
                <div className={`space-y-2 md:space-y-3 ${mutedClass}`}>
                  {depositMutation.isSuccess &&
                    selectedWalletData &&
                    depositAmount && (
                      <p className="text-xs md:text-sm leading-relaxed">
                        Your deposit of{" "}
                        <span className="text-foreground font-semibold">
                          {depositAmount} {selectedWalletData.crypto}
                        </span>{" "}
                        is being processed on the{" "}
                        <span className="text-foreground font-semibold">
                          {selectedWalletData.crypto_network}
                        </span>{" "}
                        network. Funds will appear in your account after
                        confirmations.
                      </p>
                    )}

                  {depositMutation.isPending && (
                    <>
                      <p className="text-base md:text-lg font-semibold text-foreground">
                        Sending {depositAmount} {selectedWalletData?.crypto}
                      </p>
                      <p className="text-xs md:text-sm leading-relaxed">
                        Your crypto deposit is being processed
                      </p>
                      <p className="text-xs md:text-sm leading-relaxed">
                        once the required blockchain confirmations are complete,
                        <br />
                        your funds will appear in your trading account.
                      </p>
                    </>
                  )}

                  {depositMutation.isError && (
                    <p className="text-xs md:text-sm leading-relaxed text-red-600 dark:text-red-400">
                      {depositMutation.error instanceof Error
                        ? depositMutation.error.message
                        : "Failed to submit deposit. Please try again."}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 md:pt-4">
                {!depositMutation.isPending && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setDepositAmount("");
                      setIsSubmitted(false);
                      depositMutation.reset();
                    }}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-2 bg-accent text-background font-semibold text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    {depositMutation.isSuccess
                      ? "Deposit Another"
                      : "Try Again"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2 md:gap-3 pt-1 md:pt-2">
        {currentStep === 2 && (
          <button
            type="button"
            onClick={handlePreviousStep}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 bg-muted text-foreground font-semibold text-xs md:text-sm rounded-lg hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            ← Previous
          </button>
        )}
        {currentStep === 1 && (
          <button
            type="button"
            onClick={onChangeMethod}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 bg-muted text-foreground font-semibold text-xs md:text-sm rounded-lg hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            ← Previous
          </button>
        )}
        {currentStep < 3 && (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStep === 2 && (!depositAmount || !selectedWallet)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 bg-accent text-background font-semibold text-xs md:text-sm rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {stepsCount === 3 && currentStep === 2 ? (depositMutation.isPending ? "Processing..." : "Confirm & Deposit") : "Next"}
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CryptoFunding;

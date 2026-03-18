import React, { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  Info,
  Wifi,
  Copy,
  RotateCw,
  AlertCircle,
} from "lucide-react";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import { useStepNumberColor } from "@/hooks/useStepNumberColor";
import useDataStore from "@/store/dataStore";
import { useDepositMutation } from "@/services/deposit/deposit-queries";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/ui/sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("0.00");
  const [copied, setCopied] = useState(false);
  const mutedClass = useMutedTextClass();
  const stepNumberColor = useStepNumberColor();

  const { data, fetchData, isLoading, deposit_config } = useDataStore();
  const depositMutation = useDepositMutation();

  useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [data, fetchData]);

  useEffect(() => {
    if (data) {
      console.log("Site Data Loaded:", data);
      console.log("Deposit Config:", deposit_config);
      console.log("Available Wallets:", data.wallets);
    }
  }, [data, deposit_config]);

  const wallets = useMemo(() => data?.wallets || [], [data?.wallets]);

  // Derived unique assets (cryptos) from deposit_config
  const availableAssets = useMemo(() => {
    return deposit_config?.crypto?.wallets || [];
  }, [deposit_config]);

  // Find current selected asset config
  const selectedAssetConfig = useMemo(() => {
    return availableAssets.find(a => a.id === selectedAssetId);
  }, [availableAssets, selectedAssetId]);

  const selectedCrypto = useMemo(() => selectedAssetConfig?.code || "", [selectedAssetConfig]);

  // Derived networks for selected crypto from the specific config entry
  const availableNetworks = useMemo(() => {
    return selectedAssetConfig?.networks || [];
  }, [selectedAssetConfig]);

  // Find matching wallet
  const selectedWalletData = useMemo(() => {
    if (!selectedCrypto) return wallets[0];
    
    // First try exact match
    let match = wallets.find(w => 
      w.crypto === selectedCrypto && 
      w.crypto_network === selectedNetwork
    );
    
    // Then try case-insensitive or partial match for network
    if (!match) {
      match = wallets.find(w => 
        w.crypto === selectedCrypto && 
        (w.crypto_network.toLowerCase().includes(selectedNetwork.toLowerCase()) || 
         selectedNetwork.toLowerCase().includes(w.crypto_network.toLowerCase()))
      );
    }
    
    // Then try just crypto match
    if (!match) {
      match = wallets.find(w => w.crypto === selectedCrypto);
    }
    
    return match || wallets[0];
  }, [wallets, selectedCrypto, selectedNetwork]);

  // Update selectedNetwork when crypto changes if current network is not available
  useEffect(() => {
    if (availableNetworks.length > 0 && !availableNetworks.includes(selectedNetwork)) {
      setSelectedNetwork(availableNetworks[0]);
    }
  }, [availableNetworks, selectedNetwork]);

  // Set initial selected crypto if none is selected
  useEffect(() => {
    if (availableAssets.length > 0 && !selectedAssetId) {
      const defaultAsset = availableAssets.find(a => a.default) || availableAssets[0];
      setSelectedAssetId(defaultAsset.id);
    }
  }, [availableAssets, selectedAssetId]);

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
    if (!depositAmount || !selectedWalletData) return;

    try {
      await depositMutation.mutateAsync({
        amount: parseFloat(depositAmount),
        method: "crypto",
        wallet_id: selectedWalletData.id,
        crypto: selectedCrypto,
        crypto_network: selectedNetwork,
        card_holder_name: "",
        card_number: "",
        exp_date: "",
        csv: "",
      });
      setIsSubmitted(true);
      setCurrentStep(stepsCount);
      toast.success("Deposit request submitted successfully!", {
        description: "Your deposit is awaiting admin approval.",
      });
    } catch (error: any) {
      console.error("Deposit submission failed:", error);
      toast.error("Submission Failed", {
        description: error?.response?.data?.message || "Failed to submit deposit. Please try again.",
      });
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
      if (currentStep === stepsCount && isSubmitted) {
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

      {/* Step 1: Deposit Configuration */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Deposit Cryptocurrency</h2>
            <p className={`text-xs ${mutedClass}`}>
              Select asset and network to generate a secure deposit address.
            </p>
          </div>

          {isLoading && !data && (
            <div className="flex justify-center py-8">
              <RotateCw className="w-6 h-6 animate-spin text-accent" />
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset Select */}
              <div className="space-y-1.5 focus-within:z-50">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-tight opacity-50">Select Asset</label>
                <Select value={selectedAssetId} onValueChange={(val) => setSelectedAssetId(val)}>
                  <SelectTrigger className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-accent transition-all cursor-pointer h-9">
                    <div className="flex items-center gap-2">
                      <SelectValue placeholder="Select Asset" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {availableAssets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          <img src={asset.logo} alt={asset.name} className="w-4 h-4 rounded-full" />
                          <span>{asset.name} ({asset.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Network Select */}
              <div className="space-y-1.5 focus-within:z-50">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-tight opacity-50">Network</label>
                <Select value={selectedNetwork} onValueChange={(val) => setSelectedNetwork(val)}>
                  <SelectTrigger className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-accent transition-all cursor-pointer h-9">
                    <div className="flex items-center gap-2 max-w-full">
                      <SelectValue placeholder="Select Network" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-w-[90vw]">
                    {availableNetworks.map(network => (
                      <SelectItem key={network} value={network} className="text-xs">
                        <div className="flex items-center gap-2">
                           {selectedAssetConfig?.logo && (
                             <img src={selectedAssetConfig.logo} alt={selectedAssetConfig.name} className="w-3 h-3 rounded-full" />
                           )}
                           <span>{network}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-tight opacity-50">Deposit Amount</label>
                <div className="relative group">
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-muted/10 border-2 border-border/50 rounded-xl px-4 py-4 text-2xl font-black text-center focus:outline-none focus:border-accent transition-all tracking-tight"
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-sm font-bold opacity-30 tracking-widest">{selectedCrypto}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] px-1 opacity-60">
                 <div className="flex items-center gap-1">
                   <RotateCw className="w-2.5 h-2.5 animate-spin-slow" />
                   <span>≈ <span className="font-bold text-foreground">${ (parseFloat(depositAmount || '0') * 65000).toLocaleString() } USD</span></span>
                 </div>
                 <div>1 {selectedCrypto} ≈ $64,281.40</div>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-2">
                {["250", "500", "1000", "5000"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDepositAmount( (parseInt(val) / 64000).toFixed(4) )}
                    className="py-1.5 rounded-lg border border-border bg-card hover:bg-accent hover:text-background font-bold text-[10px] transition-all shadow-sm active:scale-95"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>


          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-3 flex gap-3">
             <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
             </div>
             <p className={`text-[10px] ${mutedClass} leading-tight self-center`}>
                Only send {selectedCrypto} via the {selectedNetwork} network to avoid loss of funds. Min: 0.0001 {selectedCrypto}.
             </p>
          </div>

          
        </div>
      )}
         {/* Step 2: Complete Your Deposit */}
      {currentStep === 2 && selectedWalletData && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-foreground">Complete Your Deposit</h2>
            <p className={`text-xs ${mutedClass}`}>
              Transfer the exact amount to the unique address below.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
             <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6 items-center">
                {/* QR Code Stylized */}
                <div className="relative p-3 bg-white rounded-xl shadow-sm border border-border/50">
                   <QRCodeSVG
                      value={qrCodeValue}
                      size={120}
                      level="H"
                      className="w-24 h-24 md:w-32 md:h-32"
                      fgColor="black"
                      bgColor="white"
                    />
                    
                </div>

                {/* Amount Info */}
                <div className="flex-1 space-y-3 text-center md:text-left w-full">
                   <div className="space-y-0.5">
                      <p className={`text-[9px] font-black uppercase tracking-widest opacity-40`}>Amount to Deposit</p>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground">{depositAmount} {selectedCrypto}</h3>
                      <p className="text-sm font-medium opacity-60">≈ ${ (parseFloat(depositAmount || '0') * 65000).toLocaleString() } USD</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/30">
                      <div>
                         <p className="text-[8px] font-black opacity-30 tracking-wider uppercase">NETWORK</p>
                         <p className="text-xs font-bold flex items-center justify-center md:justify-start gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                           {selectedCrypto}
                         </p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black opacity-30 tracking-wider uppercase">ESTIMATED TIME</p>
                         <p className="font-bold text-xs">
                             {selectedWalletData.type === 'link' ? 'External' : '10-30 Min'}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Address/Link Bar */}
              <div className="bg-muted/20 border-t border-border p-4 flex flex-col sm:flex-row gap-3">
                 <div className="flex-1 flex items-center gap-3 bg-card border border-border/50 p-3 rounded-lg min-w-0">
                    {selectedWalletData.type === 'link' ? (
                      <Wifi className="w-4 h-4 text-accent flex-shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-accent flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                       <p className="text-[7px] font-black opacity-40 uppercase tracking-widest">
                         {selectedWalletData.type === 'link' ? 'Payment Instruction' : 'Unique Address'}
                       </p>
                       <p className="text-[10px] md:text-xs font-bold text-foreground truncate">
                         {selectedWalletData.type === 'link' ? selectedWalletData.crypto_network : selectedWalletData.address}
                       </p>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     if (selectedWalletData.type === 'link') {
                       window.open(selectedWalletData.address, '_blank');
                     } else {
                       handleCopyAddress();
                     }
                   }}
                   className="bg-accent text-background px-5 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-accent/90 transition-all active:scale-95"
                 >
                   {selectedWalletData.type === 'link' ? (
                     <><span>External Link</span><span>↗</span></>
                   ) : (
                     <><Copy className="w-3.5 h-3.5" />{copied ? "Copied!" : "Copy"}</>
                   )}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Step 3: Payment Review */}
      {currentStep === 3 && !isSubmitted && (
        <div className="space-y-4 md:space-y-6 w-full">
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
        </div>
      )}

      {/* Success/Processing State (Final Step) */}
      {currentStep === stepsCount && isSubmitted && (
        <div className="space-y-4 md:space-y-6 text-center py-6 md:py-8 w-full">
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

              {depositMutation.isSuccess && (
                <p className="text-xs md:text-sm leading-relaxed font-medium text-accent">
                  You will receive an email shortly with instructions on the next steps.
                </p>
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
                  setDepositAmount("0.00");
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
        {currentStep < stepsCount && (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={(!depositAmount || parseFloat(depositAmount) <= 0) || (currentStep === 2 && !selectedWalletData)}
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

import React, { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  Info,
  Wifi,
  Copy,
  RotateCw,
  AlertCircle,
  ArrowRightLeft,
} from "lucide-react";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import { useStepNumberColor } from "@/hooks/useStepNumberColor";
import useDataStore from "@/store/dataStore";
import { useDepositMutation } from "@/services/deposit/deposit-queries";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/ui/sonner";
import useAssetStore from "@/store/assetStore";
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
  const [isUsdMode, setIsUsdMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const mutedClass = useMutedTextClass();
  const stepNumberColor = useStepNumberColor();

  const { data, fetchData, isLoading, deposit_config } = useDataStore();
  const { fetchAssets, assets } = useAssetStore();
  const depositMutation = useDepositMutation();

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(() => {
      fetchAssets();
    }, 60000); // Refresh every 1 minute
    return () => clearInterval(interval);
  }, [fetchAssets]);

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

  const availableNetworks = useMemo<string[]>(() => {
    return selectedAssetConfig?.networks?.map(n => n.name) || [];
  }, [selectedAssetConfig]);

  // Find matching wallet
  const selectedWalletData = useMemo(() => {
    if (!selectedAssetConfig || !selectedNetwork) return null;

    const networkConfig = selectedAssetConfig.networks?.find(
      (n) => n.name === selectedNetwork
    );

    let baseWallet = null;
    if (networkConfig?.wallets && networkConfig.wallets.length > 0) {
       baseWallet = networkConfig.wallets[0]; 
    }

    if (!baseWallet) {
      // Fallback search
      return wallets.find(w => w.crypto === selectedCrypto && w.crypto_network === selectedNetwork) || wallets[0];
    }

    // Try to find the full wallet data in the root wallets list by ID
    const fullWallet = wallets.find(w => w.id === baseWallet.id);

    if (fullWallet) return fullWallet;

    // Construct a minimal version if full metadata is not found
    return {
        id: baseWallet.id,
        type: "wallet" as const,
        crypto: selectedCrypto,
        crypto_network: selectedNetwork,
        address: baseWallet.address,
        balance: "0",
        barcode: baseWallet.qrcode,
        status: "active"
    };
  }, [selectedAssetConfig, selectedNetwork, selectedCrypto, wallets]);

  // Dynamic price calculation from assetStore
  const currentAssetPrice = useMemo(() => {
    if (!selectedCrypto || assets.length === 0) return 0;
    
    // Attempt to find matching asset in assetStore
    const asset = assets.find(a => 
      a.type === "crypto" && 
      (a.symbol.toLowerCase().includes(selectedCrypto.toLowerCase()) || 
       a.sy.toLowerCase().includes(selectedCrypto.toLowerCase()) || 
       a.name.toLowerCase().includes(selectedCrypto.toLowerCase()))
    );
    
    if (asset) return parseFloat(asset.rate);
    
    // Fallback for common stablecoins if not in store
    if (["USDT", "USDC", "BUSD", "DAI"].includes(selectedCrypto.toUpperCase())) {
      return 1.0;
    }
    
    return 0;
  }, [assets, selectedCrypto]);

  const usdEquivalent = useMemo(() => {
    const amount = parseFloat(depositAmount || "0");
    return isUsdMode ? amount : amount * currentAssetPrice;
  }, [depositAmount, isUsdMode, currentAssetPrice]);

  const cryptoAmount = useMemo(() => {
    const amount = parseFloat(depositAmount || "0");
    if (isUsdMode) {
      return currentAssetPrice > 0 ? (amount / currentAssetPrice).toFixed(8) : "0.00";
    }
    return depositAmount;
  }, [depositAmount, isUsdMode, currentAssetPrice]);

  const handleToggleMode = () => {
    const val = parseFloat(depositAmount || "0");
    if (isUsdMode) {
      // Swapping from USD to Crypto
      if (currentAssetPrice > 0) {
        setDepositAmount((val / currentAssetPrice).toFixed(8));
      }
    } else {
      // Swapping from Crypto to USD
      setDepositAmount((val * currentAssetPrice).toFixed(2));
    }
    setIsUsdMode(!isUsdMode);
  };

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
    const amount = cryptoAmount;
    const crypto = selectedWalletData.crypto.toLowerCase();

    if (!amount || parseFloat(amount) <= 0) return address;

    // Standard URI schemes for common cryptocurrencies
    switch (crypto) {
      case "btc":
      case "bitcoin":
        return `bitcoin:${address}?amount=${amount}`;
      case "eth":
      case "ethereum":
        return `ethereum:${address}?value=${amount}`;
      case "usdt":
        return address;
      default:
        return address;
    }
  }, [selectedWalletData, cryptoAmount]);

  const handleSubmitDeposit = async () => {
    if (!depositAmount || !selectedWalletData) return;

    try {
      await depositMutation.mutateAsync({
        amount: usdEquivalent, // Send the dollar equivalent
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

  const steps = useMemo(() => {
    return stepsCount === 3 
      ? [
          { number: 1, label: "Asset & Network" },
          { number: 2, label: "Payment Details" },
          { number: 3, label: "Completed" },
        ]
      : [
          { number: 1, label: "Asset & Network" },
          { number: 2, label: "Payment Details" },
          { number: 3, label: "Payment Review" },
          { number: 4, label: "Completed" },
        ];
  }, [stepsCount]);

  const currentLabel = useMemo(() => {
    return steps.find((s) => s.number === currentStep)?.label || "";
  }, [steps, currentStep]);

  return (
    <div className="space-y-4 md:space-y-6 text-foreground">
      {/* Header and Progress Tracker */}
      <div className="space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-2xl px-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full font-bold text-[11px] md:text-sm transition-all duration-300 flex-shrink-0 ${
                  step.number < currentStep
                    ? "bg-accent text-primary-foreground shadow-sm"
                    : step.number === currentStep
                      ? "bg-primary text-primary-foreground border-2 border-accent ring-2 ring-primary/20"
                      : `bg-muted ${stepNumberColor}`
                }`}
              >
                {step.number < currentStep ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step Label - Show only on desktop, hidden on mobile */}
              <span
                className={`hidden md:inline-block ml-2 text-xs font-bold whitespace-nowrap ${
                  step.number <= currentStep ? "text-foreground" : mutedClass
                }`}
              >
                {step.label}
              </span>

              {/* Divider */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 md:mx-4 ${
                    step.number < currentStep ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Title - Mobile Only (Below the bar) */}
        <div className="md:hidden pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded tracking-tighter uppercase">Step 0{currentStep}</span>
            <h2 className="text-sm font-black text-foreground uppercase tracking-tight">{currentLabel}</h2>
          </div>
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

          <div className="bg-card border border-border rounded-xl p-3 md:p-4 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Asset Select */}
              <div className="space-y-1 focus-within:z-50">
                <label className="text-[11px] font-bold text-foreground uppercase tracking-tight opacity-60 ml-0.5">Select Asset</label>
                <Select value={selectedAssetId} onValueChange={(val) => setSelectedAssetId(val)}>
                  <SelectTrigger className="w-full bg-neutral-50 border border-border rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-white focus:ring-1 focus:ring-accent transition-all cursor-pointer h-10 md:h-9">
                    <div className="flex items-center gap-2">
                      <SelectValue placeholder="Select Asset" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {availableAssets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id} className="text-xs md:text-sm">
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
              <div className="space-y-1 focus-within:z-50">
                <label className="text-[11px] font-bold text-foreground uppercase tracking-tight opacity-60 ml-0.5">Network</label>
                <Select value={selectedNetwork} onValueChange={(val) => setSelectedNetwork(val)}>
                  <SelectTrigger className="w-full bg-neutral-50 border border-border rounded-lg px-3 py-2 text-xs md:text-sm font-semibold text-white focus:ring-1 focus:ring-accent transition-all cursor-pointer h-10 md:h-9">
                    <div className="flex items-center gap-2 max-w-full">
                      <SelectValue placeholder="Select Network" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-w-[90vw]">
                    {availableNetworks.map(network => (
                      <SelectItem key={network} value={network} className="text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                           {selectedAssetConfig?.logo && (
                             <img src={selectedAssetConfig.logo} alt={selectedAssetConfig.name} className="w-3.5 h-3.5 rounded-full" />
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
              <div className="space-y-1.5 focus-within:z-40">
                <div className="flex items-center justify-between ml-0.5">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-tight opacity-60">
                    Amount ({isUsdMode ? "USD" : selectedCrypto})
                  </label>
                  <button 
                    onClick={handleToggleMode}
                    className="flex items-center gap-1 text-[11px] font-bold text-accent hover:opacity-80 transition-opacity bg-accent/5 px-2 py-0.5 rounded cursor-pointer"
                  >
                    <ArrowRightLeft className="w-2.5 h-2.5" />
                    {isUsdMode ? selectedCrypto : "USD"}
                  </button>
                </div>
                <div className="relative group">
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-border rounded-xl pl-4 pr-16 py-3 md:py-4 text-xl md:text-2xl font-black text-left text-black focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all tracking-tight h-14 md:h-16 shadow-sm placeholder:text-black/20"
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-xs md:text-sm font-bold opacity-30 tracking-widest">{isUsdMode ? "USD" : selectedCrypto}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] md:text-xs px-1 opacity-60 font-medium">
                 <div className="flex items-center gap-1">
                   <RotateCw className="w-2.5 h-2.5 animate-spin-slow" />
                   <span>
                     ≈ <span className="font-bold text-foreground">
                       {isUsdMode 
                         ? `${cryptoAmount} ${selectedCrypto}` 
                         : `$${usdEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                     </span>
                   </span>
                 </div>
                 <div>1 {selectedCrypto} ≈ ${currentAssetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-2">
                {["250", "500", "1000", "5000"].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      const dollarAmount = parseInt(val);
                      if (isUsdMode) {
                        setDepositAmount(dollarAmount.toString());
                      } else if (currentAssetPrice > 0) {
                        setDepositAmount((dollarAmount / currentAssetPrice).toFixed(6));
                      }
                    }}
                    className="py-2.5 md:py-1.5 rounded-lg border border-border bg-card hover:bg-accent hover:text-background font-bold text-[10px] md:text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
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
             <p className={`text-[11px] md:text-xs font-medium ${mutedClass} leading-tight self-center`}>
                Only send <span className="font-bold text-foreground">{selectedCrypto}</span> via the <span className="font-bold text-foreground">{selectedNetwork}</span> network to avoid loss of funds. Min: 0.0001 {selectedCrypto}.
             </p>
          </div>
        </div>
      )}
         {/* Step 2: Complete Your Deposit */}
      {currentStep === 2 && (
        !selectedWalletData ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
            <p className="text-sm font-semibold text-foreground">No wallet address available</p>
            <p className={`text-xs ${mutedClass}`}>
              No deposit wallet has been configured for the selected asset/network. Please go back and try a different selection, or contact support.
            </p>
          </div>
        ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-foreground">Complete Your Deposit</h2>
            <p className={`text-xs ${mutedClass}`}>
              Transfer the exact amount to the unique address below.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
             <div className="p-4 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6 items-center">
                {/* QR Code Stylized */}
                <div className="p-3 bg-white rounded-xl shadow-sm border border-border/50 flex flex-col items-center gap-2">
                   <QRCodeSVG
                      value={qrCodeValue}
                      size={120}
                      level="H"
                      className="w-32 h-32 md:w-32 md:h-32"
                      fgColor="black"
                      bgColor="white"
                    />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:block">Scan to Pay</span>
                </div>

                {/* Amount Info */}
                 <div className="flex-1 space-y-3 text-center md:text-left w-full">
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Amount to Deposit</p>
                       <h3 className="text-2xl md:text-3xl font-black text-foreground">{cryptoAmount} {selectedCrypto}</h3>
                       <p className="text-xs md:text-sm font-medium opacity-60">≈ ${ usdEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
                      <div>
                         <p className="text-[9px] font-black opacity-30 tracking-wider uppercase">NETWORK</p>
                         <p className="text-xs font-bold flex items-center justify-center md:justify-start gap-1.5">
                           <span className="w-2 h-2 rounded-full bg-orange-500" />
                           {selectedNetwork}
                         </p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black opacity-30 tracking-wider uppercase">ESTIMATED TIME</p>
                         <p className="font-bold text-xs">
                             {selectedWalletData.type === 'link' ? 'Redirect' : '10-30 Min'}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Address/Link Bar */}
              <div className="bg-muted/30 border-t border-border p-4 flex flex-col gap-3">
                 <div className="flex-1 flex items-center gap-3 bg-card border border-border/50 p-2.5 md:p-3 rounded-lg min-w-0">
                    {selectedWalletData.type === 'link' ? (
                      <Wifi className="w-4 h-4 text-accent flex-shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-accent flex-shrink-0 uppercase" />
                    )}
                    <div className="min-w-0">
                       <p className="text-[8px] font-black opacity-50 uppercase tracking-widest leading-none mb-1">
                         {selectedWalletData.type === 'link' ? 'Payment Instruction' : 'Deposit Address'}
                       </p>
                       <p className="text-[11px] md:text-xs font-bold text-foreground truncate select-all">
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
                   className="w-full bg-accent text-background px-5 py-3 md:py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-accent/90 transition-all active:scale-95 shadow-sm cursor-pointer"
                 >
                   {selectedWalletData.type === 'link' ? (
                     <><span>Continue Externally</span><span>↗</span></>
                   ) : (
                     <><Copy className="w-4 h-4" />{copied ? "Address Copied!" : "Copy Address"}</>
                   )}
                 </button>
              </div>
           </div>
        </div>
        )
      )}

      {/* Step 3: Payment Review */}
      {currentStep === 3 && !isSubmitted && (
        <div className="space-y-4 md:space-y-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Review Summary Card */}
          <div className="bg-card border-2 border-border/50 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 space-y-4">
              <h3 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="text-xl">📋</span> Deposit Summary
              </h3>

              <div className="space-y-2 md:space-y-3">
                 <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                   <span className={`text-xs md:text-sm font-medium ${mutedClass}`}>
                     Estimated Value
                   </span>
                   <span className="text-sm md:text-base font-bold text-accent">
                     ${ usdEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                   </span>
                 </div>

                 <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                   <span className={`text-xs md:text-sm font-medium ${mutedClass}`}>
                     Amount to Send
                   </span>
                   <span className="text-sm md:text-base font-bold text-foreground">
                     {cryptoAmount} {selectedCrypto}
                   </span>
                 </div>

                <div className="flex justify-between items-start py-2.5 border-b border-border/50">
                  <span className={`text-xs md:text-sm font-medium ${mutedClass} mt-0.5`}>
                    Network
                  </span>
                  <span className="text-xs md:text-sm font-bold bg-accent/10 text-accent px-2 py-0.5 rounded uppercase">
                    {selectedNetwork}
                  </span>
                </div>

                <div className="flex flex-col gap-1 py-1">
                  <span className={`text-[10px] md:text-xs font-bold uppercase opacity-40`}>
                    Recipient Address
                  </span>
                  <span className="text-[10px] md:text-xs font-mono font-medium break-all bg-muted/30 p-2 rounded border border-border/50 text-foreground/80">
                    {selectedWalletData?.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-muted/30 p-4 md:p-5 border-t border-border/50">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-[11px] md:text-sm font-medium leading-relaxed opacity-80 italic">
                  Ensure you have sent the exact amount to the
                  address above before confirming. The transaction will be
                  manually verified by our security team.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 md:gap-3 py-2 w-full">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-muted text-foreground font-bold text-xs md:text-sm rounded-xl hover:bg-muted/80 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              disabled={depositMutation.isPending}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmitDeposit}
              disabled={depositMutation.isPending}
              className="flex-[2] inline-flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-accent text-background font-bold text-xs md:text-sm rounded-xl hover:bg-accent/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md cursor-pointer"
            >
              {depositMutation.isPending
                ? "Processing..."
                : "Confirm"}
              <span className="text-sm">→</span>
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
                    Sending {cryptoAmount} {selectedWalletData?.crypto}
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
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-2 bg-accent text-background font-semibold text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors cursor-pointer"
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
      <div className="flex gap-2 md:gap-3 pt-4">
        {currentStep === 2 && (
          <button
            type="button"
            onClick={handlePreviousStep}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 md:px-4 py-3 md:py-2 bg-muted text-foreground font-bold text-xs md:text-sm rounded-xl hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            ← Previous
          </button>
        )}
        {currentStep === 1 && (
          <button
            type="button"
            onClick={onChangeMethod}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 md:px-4 py-3 md:py-2 bg-muted text-foreground font-bold text-xs md:text-sm rounded-xl hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            ← Previous
          </button>
        )}
        {currentStep < stepsCount && currentStep < 3 && (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={(!depositAmount || parseFloat(depositAmount) <= 0) || (currentStep === 2 && !selectedWalletData)}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 px-3 md:px-4 py-3 md:py-2 bg-accent text-background font-bold text-xs md:text-sm rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            {stepsCount === 3 && currentStep === 2 ? (depositMutation.isPending ? "Processing..." : "Confirm & Deposit") : "Next"}
            <span className="text-sm">→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CryptoFunding;

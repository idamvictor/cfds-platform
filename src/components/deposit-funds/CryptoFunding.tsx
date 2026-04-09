import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Info,
  Copy,
  RotateCw,
  AlertCircle,
  ArrowRightLeft,
  Lock,
  Check,
  ExternalLink,
  Wallet
} from "lucide-react";

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
  onClose?: () => void;
  stepsCount?: 3 | 4;
}

const CryptoFunding: React.FC<CryptoFundingProps> = ({ 
  onChangeMethod,
  onClose,
  stepsCount = 4
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("0.00");
  const [isUsdMode, setIsUsdMode] = useState(false);
  const [copied, setCopied] = useState(false);

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
    if (currentStep === stepsCount - 1) {
      handleSubmitDeposit();
    } else if (currentStep < stepsCount) {
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
              <div
                className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full font-bold text-[11px] md:text-sm transition-all duration-300 flex-shrink-0 ${
                  step.number < currentStep
                    ? "bg-accent text-slate-900 shadow-sm"
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

              <span
                className={`hidden md:inline-block ml-2 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap ${
                  step.number <= currentStep ? "text-accent" : "text-foreground opacity-40"
                }`}
              >
                {step.label}
              </span>

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

        {/* Current Step Title - Mobile Only */}
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
          <div className="space-y-1">
            <h2 className="text-xl font-black text-foreground tracking-tight uppercase">Deposit Cryptocurrency</h2>
            <div className="flex items-center gap-1.5 px-0.5">
              <Lock className="w-3.5 h-3.5 text-accent" />
              <p className={`text-xs text-foreground font-bold`}>
                Select asset and network to generate a secure deposit address.
              </p>
            </div>
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
                <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">Select Asset</label>
                <Select value={selectedAssetId} onValueChange={(val) => setSelectedAssetId(val)}>
                  <SelectTrigger className="w-full bg-neutral-50 border-2 border-border rounded-xl uppercase px-3 h-12 text-sm font-black text-foreground focus:ring-4 focus:ring-accent/5 transition-all cursor-pointer">
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {availableAssets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id} className="text-xs md:text-sm font-black uppercase">
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
                <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">Network</label>
                <Select value={selectedNetwork} onValueChange={(val) => setSelectedNetwork(val)}>
                  <SelectTrigger className="w-full bg-muted/40 uppercase border-2 border-border rounded-xl px-3 h-12 text-sm font-black text-foreground focus:ring-4 focus:ring-accent/5 transition-all cursor-pointer">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-w-[90vw]">
                    {availableNetworks.map(network => (
                      <SelectItem key={network} value={network} className="text-xs md:text-sm font-black uppercase">
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
                  <label className="text-[11px] font-black text-foreground uppercase tracking-widest">
                    Amount ({isUsdMode ? "USD" : selectedCrypto})
                  </label>
                  <button 
                    onClick={handleToggleMode}
                    className="flex items-center gap-1 text-[10px] font-black text-accent hover:opacity-80 transition-opacity bg-accent/10 px-2 py-0.5 rounded cursor-pointer uppercase"
                  >
                    <ArrowRightLeft className="w-2.5 h-2.5" />
                    Switch to {isUsdMode ? selectedCrypto : "USD"}
                  </button>
                </div>
                <div className="relative group">
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-border rounded-xl pl-4 pr-16 py-4 text-2xl font-black text-left text-slate-900 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all tracking-tight h-16 shadow-sm placeholder:text-slate-400"
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-sm font-black text-slate-900 opacity-60 tracking-widest uppercase">{isUsdMode ? "USD" : selectedCrypto}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] md:text-xs px-1 opacity-80 font-black uppercase">
                 <div className="flex items-center gap-1">
                   <RotateCw className="w-2.5 h-2.5 animate-spin-slow" />
                   <span>
                     ≈ <span className="font-black text-foreground">
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
                    className="py-3 md:py-2.5 rounded-xl border-2 border-border bg-card hover:bg-accent hover:border-accent hover:text-slate-900 font-black text-xs md:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-xl p-3 flex gap-3">
             <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                <AlertCircle className="w-4 h-4 text-amber-600" />
             </div>
             <p className={`text-[11px] md:text-xs font-black text-amber-700 leading-tight self-center uppercase tracking-tight`}>
                Only send <span className="text-foreground">{selectedCrypto}</span> via <span className="text-foreground">{selectedNetwork}</span>. Min: 0.0001 {selectedCrypto}.
             </p>
          </div>
        </div>
      )}

      {/* Step 2: Pay Detail */}
      {currentStep === 2 && (
        !selectedWalletData ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
            <p className="text-sm font-black text-foreground uppercase tracking-tight">No wallet address available</p>
            <p className="text-xs text-foreground font-bold">
              No deposit wallet has been configured for the selected asset/network. Please go back and try a different selection, or contact support.
            </p>
          </div>
        ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Complete Your Deposit</h2>
            <p className={`text-xs text-foreground font-black uppercase tracking-tight`}>
              Transfer the exact amount to the unique address below.
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-md">
             <div className="p-4 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6 items-center">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-border flex flex-col items-center gap-2">
                   <QRCodeSVG
                      value={qrCodeValue}
                      size={120}
                      level="H"
                      className="w-32 h-32 md:w-32 md:h-32"
                      fgColor="black"
                      bgColor="white"
                    />
                    <span className="text-[10px] font-black text-black uppercase tracking-widest hidden md:block">Scan to Pay</span>
                </div>

                 <div className="flex-1 space-y-3 text-center md:text-left w-full">
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black uppercase tracking-widest">Amount to Deposit</p>
                       <h3 className="text-2xl md:text-3xl font-black text-foreground">{cryptoAmount} {selectedCrypto}</h3>
                       <p className="text-xs md:text-sm font-black opacity-80 uppercase tracking-tight">≈ ${ usdEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-border/30">
                      <div>
                         <p className="text-[9px] font-black tracking-wider uppercase">NETWORK</p>
                         <p className="text-xs font-black flex items-center justify-center md:justify-start gap-1.5 uppercase tracking-tighter">
                           <span className="w-2 h-2 rounded-full bg-orange-500" />
                           {selectedNetwork}
                         </p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black tracking-wider uppercase">TIME</p>
                         <p className="font-black text-xs uppercase tracking-tighter">
                             {selectedWalletData.type === 'link' ? 'Redirect' : '10-30 Min'}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-muted/30 border-t-2 border-border p-4">
                 <div className="flex items-center gap-3 bg-card border-2 border-border/50 p-3 rounded-xl min-w-0">
                    <Wallet className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">
                         {selectedWalletData.type === 'link' ? 'Payment Instruction' : 'Deposit Address'}
                       </p>
                       <p className="text-[11px] md:text-sm font-black text-foreground truncate select-all">
                         {selectedWalletData.type === 'link' ? selectedWalletData.crypto_network : selectedWalletData.address}
                       </p>
                    </div>
                    <button 
                      onClick={() => {
                        if (selectedWalletData.type === 'link') {
                          window.open(selectedWalletData.address, '_blank');
                        } else {
                          handleCopyAddress();
                        }
                      }}
                      className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-accent text-slate-900 rounded-lg hover:bg-accent/90 hover:scale-[1.05] transition-all active:scale-95 shadow-md cursor-pointer"
                      title={selectedWalletData.type === 'link' ? "Open Link" : "Copy Address"}
                    >
                      {selectedWalletData.type === 'link' ? (
                        <ExternalLink className="w-5 h-5" />
                      ) : (
                        copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />
                      )}
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex gap-2 md:gap-3 py-2 w-full">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 md:py-3 bg-card border-2 border-border text-foreground font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-muted transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              disabled={depositMutation.isPending}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={depositMutation.isPending}
              className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-emerald-600 text-white font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {stepsCount === 3 ? (depositMutation.isPending ? "Processing..." : "Confirm Deposit") : "Review Payment"}
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>
        )
      )}

      {/* Step 3: Payment Review */}
      {currentStep === 3 && !isSubmitted && (
        <div className="space-y-4 md:space-y-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 space-y-4">
              <h3 className="text-base md:text-lg font-black text-foreground flex items-center gap-2 uppercase tracking-tight">
                📋 Deposit Summary
              </h3>

              <div className="space-y-2 md:space-y-3">
                 <div className="flex justify-between items-center py-2.5 border-b-2 border-border/50">
                   <span className="text-xs md:text-sm font-black text-foreground opacity-60 uppercase tracking-tight">
                     Estimated Value
                   </span>
                   <span className="text-sm md:text-base font-black text-accent">
                     ${ usdEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                   </span>
                 </div>

                 <div className="flex justify-between items-center py-2.5 border-b-2 border-border/50">
                   <span className="text-xs md:text-sm font-black text-foreground opacity-60 uppercase tracking-tight">
                     Amount to Send
                   </span>
                   <span className="text-sm md:text-base font-black text-foreground">
                     {cryptoAmount} {selectedCrypto}
                   </span>
                 </div>

                <div className="flex justify-between items-start py-2.5 border-b-2 border-border/50">
                  <span className="text-xs md:text-sm font-black text-foreground opacity-60 uppercase tracking-tight mt-0.5">
                    Network
                  </span>
                  <span className="text-xs md:text-sm font-black bg-accent text-slate-900 px-2.5 py-1 rounded-lg uppercase tracking-tight">
                    {selectedNetwork}
                  </span>
                </div>

                <div className="flex flex-col gap-1 py-1">
                  <span className={`text-[10px] md:text-xs font-black uppercase opacity-40 tracking-widest`}>
                    Recipient Address
                  </span>
                  <span className="text-[10px] md:text-xs font-mono font-black break-all bg-muted/50 p-3 rounded-xl border-2 border-border text-foreground">
                    {selectedWalletData?.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 p-4 md:p-5 border-t-2 border-border/50">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-[11px] md:text-xs font-black leading-relaxed text-foreground italic opacity-70 uppercase tracking-tighter">
                  Ensure you have sent the exact amount to the
                  address above before confirming. The transaction will be
                  manually verified.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 py-2 w-full">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 md:py-3 bg-card border-2 border-border text-foreground font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-muted transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm"
              disabled={depositMutation.isPending}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={depositMutation.isPending}
              className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-emerald-600 text-white font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {depositMutation.isPending
                ? "Processing..."
                : "Confirm Deposit"}
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {currentStep === stepsCount && isSubmitted && (
        <div className="space-y-6 text-center py-6 md:py-8 w-full animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center">
            {depositMutation.isPending ? (
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-accent animate-bounce" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
              {depositMutation.isPending ? "Transaction Pending" : depositMutation.isSuccess ? "Request Submitted" : "Transaction Failed"}
            </h2>

            <div className={`space-y-3 text-foreground font-black uppercase tracking-tight`}>
              {depositMutation.isSuccess && (
                <>
                  <p className="text-sm leading-relaxed opacity-80 italic">Your deposit is awaiting network confirmation</p>
                  <p className="text-sm leading-relaxed">Funds will be credited to your balance instantly once verified by the network.</p>
                </>
              )}
              {depositMutation.isError && (
                <p className="text-sm leading-relaxed text-red-600">{depositMutation.error instanceof Error ? depositMutation.error.message : "Submission failed"}</p>
              )}
            </div>
          </div>

           <div className="flex flex-col items-center gap-3 pt-6">
             {!depositMutation.isPending && (
               <button
                 type="button"
                 onClick={() => {
                   setCurrentStep(1);
                   setDepositAmount("0.00");
                   setIsSubmitted(false);
                   depositMutation.reset();
                 }}
                 className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white font-black uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
               >
                 {depositMutation.isSuccess ? "Deposit Another" : "Try Again"}
               </button>
             )}
             
             <button
               type="button"
               onClick={() => {
                 navigate("/main/chat");
                 onClose?.();
               }}
               className="w-full md:w-auto px-10 py-4 bg-card border-2 border-border text-foreground font-black uppercase tracking-tighter rounded-xl hover:bg-muted transition-all cursor-pointer shadow-sm"
             >
               Contact Support
             </button>
           </div>
        </div>
      )}

      {/* Navigation Buttons - Step 1 Only */}
      {currentStep === 1 && (
        <div className="flex gap-2 md:gap-3 py-2 w-full">
          <button
            type="button"
            onClick={onChangeMethod}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 md:py-3 bg-card border-2 border-border text-foreground font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-muted transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNextStep}
            disabled={(!depositAmount || parseFloat(depositAmount) <= 0)}
            className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-emerald-600 text-white font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            Continue
            <span className="text-sm">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CryptoFunding;

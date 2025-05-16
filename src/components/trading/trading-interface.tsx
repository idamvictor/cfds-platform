import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, BarChart2, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAssetStore from "@/store/assetStore";
import useUserStore from "@/store/userStore";
import useTradeStore from "@/store/tradeStore";
import axiosInstance from "@/lib/axios";
import { ProfitCalculatorModal } from "./trading-interface-components/profit-calculator-modal";
import { TakeProfitStopLossModal } from "./trading-interface-components/take-profit-stop-loss-modal";
import { PendingOrderModal } from "./trading-interface-components/pending-order-modal";
import { useCurrency } from "@/hooks/useCurrency.ts";
import {cn} from "@/lib/utils.ts";
// import TechnicalAnalysisWidget from "@/components/trading/partials/TechnicalAnalysisWidget";

// AudioContext type for sound effects
type AudioContextType = typeof AudioContext;

const formSchema = z.object({
  type: z.enum(["buy", "sell"]),
  id: z.string(),
  amount: z.number(),
  volume: z.number(),
  takeProfit: z.number().optional(),
  stopLoss: z.number().optional(),
});

export function TradingInterface() {
  // Get asset and user data
  const { activeAsset } = useAssetStore();
  const user = useUserStore((state) => state.user);
  const { fetchOpenTrades, accountSummary } = useTradeStore();

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("lots");
  const [baseVolumeLots, setBaseVolumeLots] = useState(0.01);

  const [displayVolume, setDisplayVolume] = useState<number | string>(0.01);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Modal state
  const [isProfitCalculatorOpen, setIsProfitCalculatorOpen] = useState(false);
  const [isTpSlModalOpen, setIsTpSlModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  // Trading information state with initial values
  const [tradingInfo, setTradingInfo] = useState({
    contractSize: 100000,
    position: 1000,
    margin: 0,
    freeMargin: (user?.balance || 0),
    spread: 0.00006,
    leverage: 20,
    buyPrice: 0.51954,
    sellPrice: 0.51948,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "buy",
      id: uuidv4(),
      amount: 1,
      volume: 0.01,
      takeProfit: undefined,
      stopLoss: undefined,
    },
  });

  const { formatCurrencyValue } = useCurrency();

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initializeAudio = () => {
      if (audioContext) return;

      // Get AudioContext with cross-browser support
      const getAudioContextConstructor = (): AudioContextType | null => {
        if (window.AudioContext) {
          return window.AudioContext;
        } else if ("webkitAudioContext" in window) {
          return (window as { webkitAudioContext: AudioContextType })
            .webkitAudioContext;
        }
        return null;
      };

      const AudioContextClass = getAudioContextConstructor();
      if (AudioContextClass) {
        setAudioContext(new AudioContextClass());
      }
    };

    // Add event listeners for user interaction
    const events = ["mousedown", "keydown", "touchstart"];
    events.forEach((event) =>
      document.addEventListener(event, initializeAudio, { once: true })
    );

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, initializeAudio)
      );
    };
  }, [audioContext]);

  // Sound effect functions
  const playSuccessSound = useCallback(() => {
    if (!audioContext) return;

    try {
      // Create oscillator and gain nodes
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configure oscillator for success sound
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
      oscillator.frequency.exponentialRampToValueAtTime(
        440,
        audioContext.currentTime + 0.15
      ); // Down to A4

      // Configure gain (volume)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
      );

      // Connect the nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Play the sound
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (err) {
      console.error("Error playing success sound:", err);
    }
  }, [audioContext]);

  const playErrorSound = useCallback(() => {
    if (!audioContext) return;

    try {
      // Create oscillator and gain nodes
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configure oscillator for error sound
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note

      // Configure gain with quick pulses for error sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(
        0.05,
        audioContext.currentTime + 0.1
      );
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.2
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3
      );

      // Connect the nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Play the sound
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (err) {
      console.error("Error playing error sound:", err);
    }
  }, [audioContext]);

  useEffect(() => {
    if (activeAsset) {
      const assetRate = Number.parseFloat(activeAsset.rate || "0");
      const buySpread = Number.parseFloat(activeAsset.buy_spread || "0.0001");
      const sellSpread = Number.parseFloat(activeAsset.sell_spread || "0.0001");
      const leverage = user?.account_type?.leverage || 20;

      // Calculate buy and sell prices
      const buyPrice = activeAsset.buy_price || assetRate * (1 + buySpread);
      const sellPrice = activeAsset.sell_price || assetRate * (1 - sellSpread);

      // Calculate margin based on volume and leverage
      const calculatedMargin =
        (baseVolumeLots * tradingInfo.contractSize * assetRate) / leverage;
      const userBalance = user?.balance || 0;

      setTradingInfo({
        contractSize: activeAsset.contract_size,
        position: activeAsset.position,
        margin: calculatedMargin,
        freeMargin: accountSummary?.freeMargin || userBalance,
        spread: buySpread + sellSpread,
        leverage: leverage,
        buyPrice: buyPrice,
        sellPrice: sellPrice,
      });
    }
  }, [activeAsset, baseVolumeLots, user?.balance]);

  const convertVolume = (
    value: number,
    fromFormat: string,
    toFormat: string
  ): number => {
    // First convert to lots (base unit)
    let inLots = value;
    if (fromFormat === "units") {
      inLots = value / tradingInfo.contractSize;
    } else if (fromFormat === "currency") {
      // Convert from currency to lots
      const assetRate = activeAsset
        ? Number.parseFloat(activeAsset.rate || "0")
        : 1;
      inLots = value / (assetRate * tradingInfo.contractSize);
    }

    // Then convert from lots to target format
    if (toFormat === "lots") {
      return inLots;
    } else if (toFormat === "units") {
      return inLots * tradingInfo.contractSize;
    } else if (toFormat === "currency") {
      // Convert from lots to currency
      const assetRate = activeAsset
        ? Number.parseFloat(activeAsset.rate || "0")
        : 1;
      return inLots * assetRate * tradingInfo.contractSize;
    }

    return inLots; // Default fallback
  };

  const handleVolumeChange = (increment: boolean) => {
    // Calculate step size based on active tab
    let step = 0.01;
    if (activeTab === "units") {
      step = 1000;
    } else if (activeTab === "currency") {
      step = 10;
    }

    // Ensure displayVolume is treated as a number for calculations
    const currentValue =
      typeof displayVolume === "string"
        ? parseFloat(displayVolume) || 0
        : displayVolume;

    // Calculate new volume with proper numeric addition
    const newDisplayVolume = increment
      ? currentValue + step
      : Math.max(step, currentValue - step);

    // Update state with the numeric value
    setDisplayVolume(newDisplayVolume);

    // Always update the base volume in lots
    const newBaseLots = convertVolume(newDisplayVolume, activeTab, "lots");
    setBaseVolumeLots(newBaseLots);

    // Update form value
    form.setValue("volume", newDisplayVolume);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "" || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
      // Update display value
      setDisplayVolume(inputValue);

      if (
        inputValue !== "" &&
        inputValue !== "." &&
        !inputValue.endsWith(".")
      ) {
        const numValue = Number.parseFloat(inputValue);
        if (!isNaN(numValue)) {
          // Convert to base lots
          const newBaseLots = convertVolume(numValue, activeTab, "lots");
          setBaseVolumeLots(newBaseLots);
          form.setValue("volume", numValue);
        }
      } else {
        form.setValue("volume", 0);
      }
    }
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Get current numeric value (handle string case)
    const currentNumericValue =
      typeof displayVolume === "string"
        ? parseFloat(displayVolume) || 0
        : displayVolume;

    // Only convert when we have a valid numeric value
    if (currentNumericValue > 0) {
      // First convert current display value to lots
      const currentLots = convertVolume(currentNumericValue, activeTab, "lots");

      // Then convert from lots to the new format
      const newDisplayValue = convertVolume(currentLots, "lots", value);

      // Update the display with the new value in the selected format
      setDisplayVolume(newDisplayValue);
      setBaseVolumeLots(currentLots);
      form.setValue("volume", newDisplayValue);
    } else {
      // Use baseVolumeLots as fallback for partial inputs
      const newDisplayValue = convertVolume(baseVolumeLots, "lots", value);
      setDisplayVolume(newDisplayValue);
      form.setValue("volume", newDisplayValue);
    }
  };

  // Form submission - create trade
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!activeAsset) {
      toast.error("No asset selected for trading");
      return;
    }

    setIsSubmitting(true);

    const calculatedAmount = baseVolumeLots * tradingInfo.contractSize;
    const calculatedMargin = tradingInfo.margin;

    const price =
      values.type === "buy" ? tradingInfo.buyPrice : tradingInfo.sellPrice;

    const tradeData = {
      type: values.type,
      leverage: user?.account_type?.leverage || 20,
      amount: calculatedAmount,
      qty: calculatedAmount,
      volume: calculatedAmount,
      margin: calculatedMargin,
      opening_price: price,
      take_profit: values.takeProfit || 0,
      stop_loss: values.stopLoss || 0,
      id: activeAsset.id,
      asset_symbol: activeAsset.symbol_display || activeAsset.symbol,
      asset_name: activeAsset.name,
    };

    try {
      const response = await axiosInstance.post("/trades/store", tradeData);

      console.log("Trade executed successfully:", response.data);

      playSuccessSound();

      // Show success toast notification
      toast.success(`${values.type === "buy" ? "Buy" : "Sell"} order placed`, {
        description: `${
          values.type === "buy" ? "Bought" : "Sold"
        } ${baseVolumeLots} lots (${calculatedAmount.toLocaleString()} units) at ${price.toFixed(
          5
        )}`,
        position: "top-right",
        duration: 3000,
      });

      await fetchOpenTrades();
    } catch (error) {
      console.error("Error executing trade:", error);
      playErrorSound();
      toast.error("Failed to execute trade", {
        description:
          "There was an error processing your trade. Please try again.",
        position: "top-right",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
      form.setValue("id", uuidv4());
    }
  };

  // Get TP/SL display text
  const getTpSlText = () => {
    const tp = form.getValues().takeProfit;
    const sl = form.getValues().stopLoss;

    if (tp && sl) {
      return `TP: ${tp.toFixed(5)} SL: ${sl.toFixed(5)}`;
    } else if (tp) {
      return `TP: ${tp.toFixed(5)}`;
    } else if (sl) {
      return `SL: ${sl.toFixed(5)}`;
    } else {
      return "Not set";
    }
  };

  return (
    <div
      className="w-full bg-background rounded-lg text-foreground"
      style={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" md:space-y-2">
          {/* Mobile layout - side by side sections */}
          <div className="md:hidden grid grid-cols-3 gap-1 w-full">
            {/* Section 1: Volume and Tabs */}
            <div className="col-span-1 p-2 rounded-l">
              <div className="flex items-center mb-1">
                <div className="flex-1">
                  <label className="text-xs">Volume</label>
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            {...field}
                            value={displayVolume}
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                            className="h-6 bg-muted border-0 text-foreground text-sm font-medium p-1"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1 ml-1 mt-2.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground bg-secondary hover:text-foreground p-0"
                    onClick={() => handleVolumeChange(true)}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground bg-secondary hover:text-foreground p-0"
                    onClick={() => handleVolumeChange(false)}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Tabs
                defaultValue="lots"
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 h-6 bg-muted">
                  <TabsTrigger value="lots" className="text-[10px] h-5 px-1">
                    lots
                  </TabsTrigger>
                  <TabsTrigger value="units" className="text-[10px] h-5 px-1">
                    units
                  </TabsTrigger>
                  <TabsTrigger
                    value="currency"
                    className="text-[10px] h-5 px-1"
                  >
                    currency
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 gap-1 mt-1">
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white h-8 px-1"
                  onClick={() => {
                    form.setValue("type", "buy");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold">BUY</span>
                      <span className="text-[8px]">
                        {tradingInfo.buyPrice.toFixed(5)}
                      </span>
                    </div>
                  )}
                </Button>
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white h-8 px-1"
                  onClick={() => {
                    form.setValue("type", "sell");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold">SELL</span>
                      <span className="text-[8px]">
                        {tradingInfo.sellPrice.toFixed(5)}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Section 2: Trading Info */}
            <div className="col-span-1 p-2">
              <div className="grid gap-y-[2px] text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract:</span>
                  <span className="text-primary">
                    {tradingInfo.contractSize.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="text-primary">
                    {tradingInfo.position.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin:</span>
                  <span className={cn(
                      tradingInfo.margin > accountSummary.freeMargin ? "text-red-500" : "text-primary"
                  )}>
    {formatCurrencyValue(
        parseFloat(tradingInfo.margin.toFixed(2))
    )}
  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free Margin:</span>
                  <span className={accountSummary.freeMargin < 0 ? "text-red-500" : "text-primary"}>
    {formatCurrencyValue(
        parseFloat(accountSummary.freeMargin.toFixed(2))
    )}
  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spread:</span>
                  <span className="text-primary">
                    {tradingInfo.spread.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Leverage:</span>
                  <span className="text-primary">1:{tradingInfo.leverage}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Profit Calculator and Buttons */}
            <div className="col-span-1 p-2 rounded-r flex flex-col justify-between">
              <div className="space-y-1">
                <Button
                  type="button"
                  className="flex items-center justify-start py-1 w-full h-auto bg-secondary hover:bg-secondary/50"
                  onClick={() => setIsProfitCalculatorOpen(true)}
                >
                  <BarChart2 className="h-3 w-3 mr-1 " />
                  <div className="flex flex-col items-start justify-start">
                    <span className="text-[10px] font-medium text-foreground">
                      Profit{" "}
                    </span>
                    <span className="text-[10px] font-medium text-foreground">
                      Calculator
                    </span>
                  </div>
                </Button>

                <div>
                  <Button
                    type="button"
                    className="flex flex-col items-start justify-center w-full h-auto bg-secondary hover:bg-secondary/50"
                    onClick={() => setIsTpSlModalOpen(true)}
                  >
                    <div className="text-[8px] text-muted-foreground">
                      TP & SL
                    </div>
                    <div className="text-[10px] text-foreground">
                      {getTpSlText()}
                    </div>
                  </Button>
                </div>

                <div>
                  <Button
                    type="button"
                    className="flex flex-col items-start justify-center w-full h-auto bg-secondary hover:bg-secondary/50"
                    onClick={() => setIsPendingModalOpen(true)}
                  >
                    <div className="text-[8px] text-muted-foreground">
                      Pending
                    </div>
                    <div className="text-[10px] text-foreground">Market</div>
                  </Button>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-1 mt-1">
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white h-8 px-1"
                  onClick={() => {
                    form.setValue("type", "buy");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold">BUY</span>
                      <span className="text-[8px]">
                        {tradingInfo.buyPrice.toFixed(5)}
                      </span>
                    </div>
                  )}
                </Button>
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white h-8 px-1"
                  onClick={() => {
                    form.setValue("type", "sell");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold">SELL</span>
                      <span className="text-[8px]">
                        {tradingInfo.sellPrice.toFixed(5)}
                      </span>
                    </div>
                  )}
                </Button>
              </div> */}
            </div>
          </div>

          {/* Desktop layout - stacked sections */}
          <div className="hidden md:block">
            {/* Section 1: Volume and Tabs */}
            <div className="p-3">
              <div className="flex items-center">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">
                    Volume
                  </label>
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={displayVolume}
                            onChange={(e) => {
                              field.onChange(e);
                              handleInputChange(e);
                            }}
                            className="h-8 bg-muted border-0 text-foreground text-lg font-medium"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-0.5 ml-2 mt-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground bg-secondary hover:text-foreground"
                    onClick={() => handleVolumeChange(true)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground bg-secondary hover:text-foreground"
                    onClick={() => handleVolumeChange(false)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs
                defaultValue="lots"
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full mt-3"
              >
                <TabsList className="grid grid-cols-3 h-8 bg-muted">
                  <TabsTrigger value="lots" className="text-xs">
                    lots
                  </TabsTrigger>
                  <TabsTrigger value="units" className="text-xs">
                    units
                  </TabsTrigger>
                  <TabsTrigger value="currency" className="text-xs">
                    currency
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Separator className="bg-muted" />

            {/* Section 2: Trading Info */}
            <div className="p-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract size:</span>
                  <span className="text-primary">
                    {tradingInfo.contractSize.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="text-primary">
                    {tradingInfo.position.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin:</span>
                  <span className={cn(
                      tradingInfo.margin > accountSummary.freeMargin ? "text-red-500" : "text-primary"
                  )}>
    {formatCurrencyValue(
        parseFloat(tradingInfo.margin.toFixed(2))
    )}
  </span>

                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free Margin:</span>
                  <span className="text-primary">
                    {formatCurrencyValue(
                      parseFloat(accountSummary.freeMargin.toFixed(2))
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spread:</span>
                  <span className="text-primary">
                    {tradingInfo.spread.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Leverage:</span>
                  <span className="text-primary">1:{tradingInfo.leverage}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-muted" />

            {/* Section 3: Profit Calculator and Buttons */}
            <div className="p-3 space-y-2">
              <Button
                type="button"
                className="flex items-center justify-center py-1 w-full h-auto bg-secondary hover:bg-secondary/50"
                onClick={() => setIsProfitCalculatorOpen(true)}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium text-foreground">
                  Profit Calculator
                </span>
              </Button>

              <div className="flex gap-2">
                <div className="space-y-1 flex-1">
                  <Button
                    type="button"
                    className="flex flex-col items-start justify-center w-full h-auto bg-secondary hover:bg-secondary/50"
                    onClick={() => setIsTpSlModalOpen(true)}
                  >
                    <div className="text-xs text-muted-foreground items-center">
                      TP & SL
                    </div>
                    <div className="text-xs text-foreground">
                      {getTpSlText()}
                    </div>
                  </Button>
                </div>

                <div className="space-y-1 flex-1">
                  <Button
                    type="button"
                    className="flex flex-col items-start justify-center w-full h-auto bg-secondary hover:bg-secondary/50"
                    onClick={() => setIsPendingModalOpen(true)}
                  >
                    <div className="text-xs text-muted-foreground">Pending</div>
                    <div className="text-xs text-foreground">Market</div>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-1">
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white h-10 text-xs"
                  onClick={() => {
                    form.setValue("type", "buy");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="font-bold">BUY</span>
                      <span className="text-sm">
                        {tradingInfo.buyPrice.toFixed(5)}
                      </span>
                    </div>
                  )}
                </Button>
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white h-10 text-xs"
                  onClick={() => {
                    form.setValue("type", "sell");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="font-bold">SELL</span>
                      <span className="text-sm">
                        {tradingInfo.sellPrice.toFixed(5)}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <ProfitCalculatorModal
        open={isProfitCalculatorOpen}
        onOpenChange={setIsProfitCalculatorOpen}
        symbol={activeAsset?.symbol_display || ""}
        asset={activeAsset}
      />

      <TakeProfitStopLossModal
        open={isTpSlModalOpen}
        onOpenChange={setIsTpSlModalOpen}
      />
      <PendingOrderModal
        open={isPendingModalOpen}
        onOpenChange={setIsPendingModalOpen}
        currentPrice={
          activeAsset ? Number.parseFloat(activeAsset.rate || "0") : 0
        }
      />
    </div>
  );
}

export default TradingInterface;

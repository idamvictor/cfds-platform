import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import type { Asset } from "@/store/assetStore";

const formSchema = z.object({
  volume: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Volume must be a positive number",
  }),
  entryPrice: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Entry price must be a positive number",
  }),
  takeProfit: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Take profit must be a non-negative number",
  }),
  stopLoss: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stop loss must be a non-negative number",
  }),
});

interface ProfitCalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol?: string;
  asset?: Asset | null;
}

export function ProfitCalculatorModal({
                                        open,
                                        onOpenChange,
                                        symbol = "AUD/JPY",
                                        asset = null,
                                      }: ProfitCalculatorModalProps) {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [calculationResults, setCalculationResults] = useState({
    requiredMargin: 0,
    profitFromTp: 0,
    lossFromSl: 0,
    roe: 0,
    pip: 0,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volume: "100000",
      entryPrice: asset?.rate || "89.78",
      takeProfit: "0",
      stopLoss: "0",
    },
  });

  // Update form when asset changes or modal opens
  useEffect(() => {
    if (asset && open) {
      const currentPrice = parseFloat(asset.rate || "0");

      form.setValue("entryPrice", asset.rate);

      // Set default take profit (0.1% higher for buy, lower for sell)
      const takeProfitPrice = tradeType === "buy"
          ? (currentPrice * 1.001).toFixed(5)
          : (currentPrice * 0.999).toFixed(5);

      // Set default stop loss (0.1% lower for buy, higher for sell)
      const stopLossPrice = tradeType === "buy"
          ? (currentPrice * 0.999).toFixed(5)
          : (currentPrice * 1.001).toFixed(5);

      form.setValue("takeProfit", takeProfitPrice);
      form.setValue("stopLoss", stopLossPrice);

      // Calculate with new values
      calculateProfit(form.getValues());
    }
  }, [asset, open, tradeType, form]);

  const calculateProfit = (values: z.infer<typeof formSchema>) => {
    if (!asset) return;

    const volume = parseFloat(values.volume);
    const entryPrice = parseFloat(values.entryPrice);
    const takeProfit = parseFloat(values.takeProfit);
    const stopLoss = parseFloat(values.stopLoss);
    const leverage = asset.leverage || 20;

    // Skip calculation if any values are invalid
    if (isNaN(volume) || isNaN(entryPrice)) {
      return;
    }

    // Calculate required margin based on entry price and leverage
    const requiredMargin = (volume * entryPrice) / leverage;

    // Calculate profit from take profit
    let profitFromTp = 0;
    if (!isNaN(takeProfit) && takeProfit > 0) {
      const priceDifferenceTP = tradeType === "buy"
          ? takeProfit - entryPrice
          : entryPrice - takeProfit;
      profitFromTp = priceDifferenceTP * volume;
    }

    // Calculate potential loss from stop loss
    let lossFromSl = 0;
    if (!isNaN(stopLoss) && stopLoss > 0) {
      const priceDifferenceSL = tradeType === "buy"
          ? entryPrice - stopLoss
          : stopLoss - entryPrice;
      lossFromSl = priceDifferenceSL * volume;
    }

    // Calculate ROE (Return on Equity)
    const roe = requiredMargin > 0 ? (profitFromTp / requiredMargin) * 100 : 0;

    // Calculate pip value (standard 0.0001 pip size for forex)
    const pipSize = 0.0001;
    const pip = volume * pipSize;

    setCalculationResults({
      requiredMargin,
      profitFromTp,
      lossFromSl,
      roe,
      pip,
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    calculateProfit(values);
  };

  const switchTradeType = (type: "buy" | "sell") => {
    setTradeType(type);

    if (asset) {
      const currentPrice = parseFloat(asset.rate || "0");
      const entryPrice = parseFloat(form.getValues().entryPrice) || currentPrice;

      // Adjust TP/SL for the new trade type
      const takeProfitPrice = type === "buy"
          ? (entryPrice * 1.001).toFixed(5)
          : (entryPrice * 0.999).toFixed(5);

      const stopLossPrice = type === "buy"
          ? (entryPrice * 0.999).toFixed(5)
          : (entryPrice * 1.001).toFixed(5);

      form.setValue("takeProfit", takeProfitPrice);
      form.setValue("stopLoss", stopLossPrice);

      // Recalculate with new values
      calculateProfit(form.getValues());
    }
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] border-muted p-0 overflow-hidden text-sm">
          <DialogHeader className="p-2">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-base">
                Calculations for {symbol}
              </DialogTitle>
              <DialogClose />
            </div>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 px-2 pb-2">
            <div className="space-y-2">
              <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                  <div className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                          type="button"
                          size="sm"
                          className={`text-xs ${tradeType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-muted hover:bg-muted/80"}`}
                          onClick={() => switchTradeType("buy")}
                      >
                        BUY
                      </Button>
                      <Button
                          type="button"
                          size="sm"
                          className={`text-xs ${tradeType === "sell" ? "bg-red-500 hover:bg-red-600" : "bg-muted hover:bg-muted/80"}`}
                          onClick={() => switchTradeType("sell")}
                      >
                        SELL
                      </Button>
                    </div>

                    <div className="bg-secondary p-2 rounded flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {asset?.symbol_display || symbol} Calculator
                    </span>
                    </div>

                    <div className="bg-slate-700 p-2 rounded flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Volume</span>
                      <FormField
                          control={form.control}
                          name="volume"
                          render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input
                                      {...field}
                                      className="border-none text-right w-20 text-white focus-visible:ring-0 focus-visible:ring-offset-0 text-xs h-6 px-1"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        calculateProfit({
                                          ...form.getValues(),
                                          volume: e.target.value,
                                        });
                                      }}
                                  />
                                </FormControl>
                              </FormItem>
                          )}
                      />
                    </div>

                    <div className="bg-slate-700 p-2 rounded flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Entry Price</span>
                      <FormField
                          control={form.control}
                          name="entryPrice"
                          render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input
                                      {...field}
                                      className="bg-transparent border-none text-right w-20 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs h-6 px-1"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        calculateProfit({
                                          ...form.getValues(),
                                          entryPrice: e.target.value,
                                        });
                                      }}
                                  />
                                </FormControl>
                              </FormItem>
                          )}
                      />
                    </div>

                    <div className="bg-slate-700 p-2 rounded flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Take Profit</span>
                      <FormField
                          control={form.control}
                          name="takeProfit"
                          render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input
                                      {...field}
                                      className="bg-transparent border-none text-right w-20 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs h-6 px-1"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        calculateProfit({
                                          ...form.getValues(),
                                          takeProfit: e.target.value,
                                        });
                                      }}
                                  />
                                </FormControl>
                              </FormItem>
                          )}
                      />
                    </div>

                    <div className="bg-slate-700 p-2 rounded flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Stop Loss</span>
                      <FormField
                          control={form.control}
                          name="stopLoss"
                          render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input
                                      {...field}
                                      className="bg-transparent border-none text-right w-20 text-white focus-visible:ring-0 focus-visible:ring-offset-0 text-xs h-6 px-1"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        calculateProfit({
                                          ...form.getValues(),
                                          stopLoss: e.target.value,
                                        });
                                      }}
                                  />
                                </FormControl>
                              </FormItem>
                          )}
                      />
                    </div>

                    <div className="text-gray-400 text-xs">
                      Max Position: {asset ? `${Math.round((asset?.leverage || 20) * 1000)} ${symbol}` : '19000 ' + symbol}
                    </div>

                    <Button type="submit" size="sm" className="text-xs h-7">
                      Calculate
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            <div className="space-y-2 bg-slate-700 p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Leverage</span>
                <span className="text-white text-xs">1:{asset?.leverage || 20}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Required Margin</span>
                <span className="text-white text-xs">
                {calculationResults.requiredMargin.toFixed(2)} <span className="text-gray-400 text-xs">USD</span>
              </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Profit from TP</span>
                <span className="text-white text-xs">
                {calculationResults.profitFromTp.toFixed(2)} <span className="text-gray-400 text-xs">USD</span>
              </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Loss from SL</span>
                <span className="text-white text-xs">
                {calculationResults.lossFromSl.toFixed(2)} <span className="text-gray-400 text-xs">USD</span>
              </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">ROE</span>
                <span className="text-white text-xs">
                {calculationResults.roe.toFixed(2)} <span className="text-gray-400 text-xs">%</span>
              </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">PIP</span>
                <span className="text-white text-xs">
                {calculationResults.pip.toFixed(2)} <span className="text-gray-400 text-xs">USD</span>
              </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Price from profit</span>
                <span className="text-white text-xs">
                {tradeType === "buy" ? "↑" : "↓"}
              </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}

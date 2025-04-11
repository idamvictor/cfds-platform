import React from "react";
import { v4 as uuidv4 } from "uuid";
import { toast, Toaster } from "sonner";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  type: z.enum(["buy", "sell"]),
  id: z.string(),
  amount: z.number(),
  volume: z.number(),
});

export function TradingInterface() {
  const [activeTab, setActiveTab] = React.useState("lots");

  // Store the base volume in lots and the displayed volume
  const [baseVolumeLots, setBaseVolumeLots] = React.useState(0.01);
  const [displayVolume, setDisplayVolume] = React.useState(0.01);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "buy",
      id: uuidv4(),
      amount: 1,
      volume: 0.01,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Always calculate amount based on base volume in lots
    const calculatedAmount = baseVolumeLots * tradingInfo.contractSize;

    console.log("Form data to be sent:", {
      ...values,
      amount: calculatedAmount,
      baseVolumeLots,
      displayVolume,
    });

    // Show toast notification using sonner
    toast(`Trade ${values.type === "buy" ? "Purchase" : "Sale"} Confirmed`, {
      description: `${
        values.type === "buy" ? "Bought" : "Sold"
      } ${baseVolumeLots} lots (${calculatedAmount.toLocaleString()} units) at ${
        values.type === "buy"
          ? tradingInfo.buyPrice.toFixed(5)
          : tradingInfo.sellPrice.toFixed(5)
      }`,
      position: "top-right",
      duration: 3000,
    });
  };

  // Mock data for display purposes
  const tradingInfo = {
    contractSize: 100000,
    position: 1000,
    margin: 30.91,
    freeMargin: 709.75,
    spread: 0.00006,
    leverage: "1:20",
    buyPrice: 0.51954,
    sellPrice: 0.51948,
  };

  // Convert between different volume formats
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
      // Simplified conversion - in real trading this would be more complex
      inLots = value / (tradingInfo.margin * 100);
    }

    // Then convert from lots to target format
    if (toFormat === "lots") {
      return inLots;
    } else if (toFormat === "units") {
      return inLots * tradingInfo.contractSize;
    } else if (toFormat === "currency") {
      // Simplified conversion
      return inLots * tradingInfo.margin * 100;
    }

    return inLots; // Default fallback
  };

  const handleVolumeChange = (increment: boolean) => {
    // Calculate new volume based on current tab
    let step = 0.01;
    if (activeTab === "units") {
      step = 1000;
    } else if (activeTab === "currency") {
      step = 10;
    }

    const newDisplayVolume = increment
      ? displayVolume + step
      : Math.max(step, displayVolume - step);

    setDisplayVolume(newDisplayVolume);

    // Always update the base volume in lots
    const newBaseLots = convertVolume(newDisplayVolume, activeTab, "lots");
    setBaseVolumeLots(newBaseLots);

    // Update the form value
    form.setValue("volume", newDisplayVolume);
  };

  // Handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    setDisplayVolume(value);

    // Convert to base lots
    const newBaseLots = convertVolume(value, activeTab, "lots");
    setBaseVolumeLots(newBaseLots);
  };

  // Handle tab changes to update volume format
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Convert current display volume to the new format
    const newDisplayVolume = convertVolume(baseVolumeLots, "lots", value);
    setDisplayVolume(newDisplayVolume);
    form.setValue("volume", newDisplayVolume);
  };

  return (
    <div className="w-full bg-background rounded-lg text-foreground">
      <Toaster position="top-right" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-2">
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
                              field.onChange(e);
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
                  <span className="text-primary">
                    ${tradingInfo.margin.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free Margin:</span>
                  <span className="text-primary">
                    ${tradingInfo.freeMargin.toFixed(2)}
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
                  <span className="text-primary">{tradingInfo.leverage}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Profit Calculator and Buttons */}
            <div className="col-span-1 p-2 rounded-r flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-center py-1">
                  <BarChart2 className="h-3 w-3 mr-1 text-primary" />
                  <span className="text-[10px] font-medium text-foreground">
                    Profit Calculator
                  </span>
                </div>

                <div>
                  <div className="text-[8px] text-muted-foreground">
                    Take Profit & Stop Loss
                  </div>
                  <div className="text-[10px] text-foreground">Not set</div>
                </div>

                <div>
                  <div className="text-[8px] text-muted-foreground">
                    Pending
                  </div>
                  <div className="text-[10px] text-foreground">Market</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 mt-1">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-1"
                  onClick={() => {
                    form.setValue("type", "buy");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold">BUY</span>
                    <span className="text-[8px]">
                      {tradingInfo.buyPrice.toFixed(5)}
                    </span>
                  </div>
                </Button>
                <Button
                  type="submit"
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 px-1"
                  onClick={() => {
                    form.setValue("type", "sell");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold">SELL</span>
                    <span className="text-[8px]">
                      {tradingInfo.sellPrice.toFixed(5)}
                    </span>
                  </div>
                </Button>
              </div>
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
              <div className="space-y-1 text-sm">
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
                  <span className="text-primary">
                    ${tradingInfo.margin.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free Margin:</span>
                  <span className="text-primary">
                    ${tradingInfo.freeMargin.toFixed(2)}
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
                  <span className="text-primary">{tradingInfo.leverage}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-muted" />

            {/* Section 3: Profit Calculator and Buttons */}
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-center py-1">
                <BarChart2 className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Profit Calculator
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Take Profit & Stop Loss
                </div>
                <div className="text-sm text-foreground">Not set</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Pending</div>
                <div className="text-sm text-foreground">Market</div>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-2">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-14"
                  onClick={() => {
                    form.setValue("type", "buy");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold">BUY</span>
                    <span className="text-sm">
                      {tradingInfo.buyPrice.toFixed(5)}
                    </span>
                  </div>
                </Button>
                <Button
                  type="submit"
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-14"
                  onClick={() => {
                    form.setValue("type", "sell");
                    form.setValue("id", uuidv4());
                    form.setValue(
                      "amount",
                      baseVolumeLots * tradingInfo.contractSize
                    );
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold">SELL</span>
                    <span className="text-sm">
                      {tradingInfo.sellPrice.toFixed(5)}
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default TradingInterface;

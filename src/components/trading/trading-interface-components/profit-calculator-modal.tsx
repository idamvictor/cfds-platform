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

const formSchema = z.object({
  volume: z.string(),
  entryPrice: z.string(),
  takeProfit: z.string(),
  stopLoss: z.string(),
});

interface ProfitCalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol?: string;
}

export function ProfitCalculatorModal({
  open,
  onOpenChange,
  symbol = "AUD/JPY",
}: ProfitCalculatorModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volume: "100000",
      entryPrice: "89.78",
      takeProfit: "89.880",
      stopLoss: "89.680",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Calculate profit with values:", values);
    // Calculation logic would go here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] border-muted p-0 overflow-hidden text-sm">
        <DialogHeader className="p-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-base">
              Calculations for {symbol}
            </DialogTitle>
            <DialogClose>{/* <X className="h-3 w-3" /> */}</DialogClose>
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
                    <Button size="sm" className="bg-primary text-xs">
                      BUY
                    </Button>
                    <Button size="sm" className="bg-destructive text-xs">
                      SELL
                    </Button>
                  </div>

                  <div className="bg-secondary p-2 rounded flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Price from profit
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
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-gray-400 text-xs">
                    Max Position: 19000 AUD/JPY
                  </div>

                  <Button type="submit" size="sm" className=" text-xs h-7">
                    Calculate
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="space-y-2 bg-slate-700 p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Leverage</span>
              <span className="text-white text-xs">1:20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Required Margin</span>
              <span className="text-white text-xs">
                3122.48 <span className="text-gray-400 text-xs">USD</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Profit from TP</span>
              <span className="text-white text-xs">
                69.56 <span className="text-gray-400 text-xs">USD</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Loss from SL</span>
              <span className="text-white text-xs">
                69.56 <span className="text-gray-400 text-xs">USD</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">ROE</span>
              <span className="text-white text-xs">
                +2.23 <span className="text-gray-400 text-xs">%</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">PIP</span>
              <span className="text-white text-xs">
                0.7 <span className="text-gray-400 text-xs">USD</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Price from profit</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

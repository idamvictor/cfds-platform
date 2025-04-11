import { X } from "lucide-react";
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
      <DialogContent className="sm:max-w-[425px] border-muted p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle>Calculations for {symbol}</DialogTitle>
            <DialogClose>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-primary">BUY</Button>
                    <Button className="bg-destructive">SELL</Button>
                  </div>

                  <div className="bg-secondary p-3 rounded flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Price from profit
                    </span>
                  </div>

                  <div className="bg-[#131722] p-3 rounded flex justify-between items-center">
                    <span className="text-gray-400">Volume</span>
                    <FormField
                      control={form.control}
                      name="volume"
                      render={({ field }) => (
                        <FormItem className="m-0">
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-transparent border-none text-right w-24 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-[#131722] p-3 rounded flex justify-between items-center">
                    <span className="text-gray-400">Entry Price</span>
                    <FormField
                      control={form.control}
                      name="entryPrice"
                      render={({ field }) => (
                        <FormItem className="m-0">
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-transparent border-none text-right w-24 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-[#131722] p-3 rounded flex justify-between items-center">
                    <span className="text-gray-400">Take Profit</span>
                    <FormField
                      control={form.control}
                      name="takeProfit"
                      render={({ field }) => (
                        <FormItem className="m-0">
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-transparent border-none text-right w-24 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-[#131722] p-3 rounded flex justify-between items-center">
                    <span className="text-gray-400">Stop Loss</span>
                    <FormField
                      control={form.control}
                      name="stopLoss"
                      render={({ field }) => (
                        <FormItem className="m-0">
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-transparent border-none text-right w-24 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-gray-400">
                    Max Position: 19000 AUD/JPY
                  </div>

                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Calculate
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {" "}
              <span className="text-gray-400 text-sm">Leverage</span>
              <span className="text-white text-sm">1:20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Required Margin</span>
              <span className="text-white text-sm">
                3122.48 <span className="text-gray-400 text-sm">USD</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Profit from TP</span>
              <span className="text-white text-sm">
                69.56 <span className="text-gray-400 text-sm">USD</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Loss from SL</span>
              <span className="text-white text-sm">
                69.56 <span className="text-gray-400 text-sm">USD</span>
              </span>
            </div>{" "}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">ROE</span>
              <span className="text-white text-sm">
                +2.23 <span className="text-gray-400 text-sm">%</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">PIP</span>
              <span className="text-white text-sm">
                0.7 <span className="text-gray-400 text-sm">USD</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Price from profit</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

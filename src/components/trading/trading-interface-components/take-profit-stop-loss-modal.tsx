import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  preset: z.string(),
  takeProfit: z.string(),
  stopLoss: z.string(),
});

interface TakeProfitStopLossModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TakeProfitStopLossModal({
  open,
  onOpenChange,
}: TakeProfitStopLossModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preset: "default",
      takeProfit: "",
      stopLoss: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Applied TP/SL values:", values);
    onOpenChange(false);
  };

  const handleAdjustValue = (
    field: "takeProfit" | "stopLoss",
    increment: boolean
  ) => {
    const currentValue = Number.parseFloat(form.getValues(field) || "0");
    const step = 0.01;
    const newValue = increment ? currentValue + step : currentValue - step;
    form.setValue(field, newValue.toFixed(3));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px] bg-[#1E2130] text-white border-gray-700 p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-white text-lg">
              TAKE PROFIT & STOP LOSS
            </DialogTitle>
            <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 pt-0 space-y-4"
          >
            <FormField
              control={form.control}
              name="preset"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-[#131722] border-0 text-white">
                        <SelectValue placeholder="Select preset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1E2130] text-white border-gray-700">
                      <SelectItem value="default">default</SelectItem>
                      <SelectItem value="conservative">conservative</SelectItem>
                      <SelectItem value="aggressive">aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex items-center">
                          <div className="bg-[#131722] p-3 rounded-l flex-1">
                            <div className="text-gray-400 text-sm">
                              Take Profit
                            </div>
                            <Input
                              {...field}
                              className="bg-transparent border-none p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0 h-6"
                              placeholder="0.000"
                            />
                          </div>
                          <div className="flex flex-col bg-[#131722] rounded-r">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 rounded-none rounded-tr text-gray-400 hover:text-white hover:bg-[#232838]"
                              onClick={() =>
                                handleAdjustValue("takeProfit", true)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 rounded-none rounded-br text-gray-400 hover:text-white hover:bg-[#232838]"
                              onClick={() =>
                                handleAdjustValue("takeProfit", false)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="stopLoss"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex items-center">
                          <div className="bg-[#131722] p-3 rounded-l flex-1">
                            <div className="text-gray-400 text-sm">
                              Stop Loss
                            </div>
                            <Input
                              {...field}
                              className="bg-transparent border-none p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0 h-6"
                              placeholder="0.000"
                            />
                          </div>
                          <div className="flex flex-col bg-[#131722] rounded-r">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 rounded-none rounded-tr text-gray-400 hover:text-white hover:bg-[#232838]"
                              onClick={() =>
                                handleAdjustValue("stopLoss", true)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 rounded-none rounded-br text-gray-400 hover:text-white hover:bg-[#232838]"
                              onClick={() =>
                                handleAdjustValue("stopLoss", false)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Apply
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

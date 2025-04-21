import React from "react";
import { motion } from "framer-motion";
import { Check, Copy, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  isConfirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm the transfer",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface QRCodeDepositProps {
  address: string;
  barcode: string;
  title?: string;
  qrTitle?: string;
  addressTitle?: string;
  onSubmit?: (amount: string) => Promise<void> | void;
}

export default function QRCodeDeposit({
  address = "",
  barcode = "",
  title = "Deposit",
  qrTitle = "QR CODE",
  addressTitle = "DEPOSIT ADDRESS",
  onSubmit,
}: QRCodeDepositProps) {
  const [copied, setCopied] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      isConfirmed: false,
    },
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (values: FormData) => {
    if (!onSubmit) return;
    try {
      await onSubmit(values.amount);
      form.reset();
    } catch (error) {
      console.error("Error submitting transfer:", error);
    }
  };

  return (
    <div className="w-full mx-auto p-2 sm:p-4 rounded-lg">
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {qrTitle}
          </h3>
          {barcode ? (
            <div className="flex justify-center">
              <img src={barcode} className="w-auto h-[120px] sm:h-[150px]" />
            </div>
          ) : (
            <div className="flex justify-center">
              <motion.div
                className="bg-white p-2 sm:p-4 rounded-md"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <QRCodeSVG
                  value={address}
                  size={150}
                  className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]"
                />
              </motion.div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wide">
            {addressTitle}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <motion.div
              className={cn(
                "flex-1 bg-background/20 border border-primary/10 rounded-md p-2 sm:p-3 overflow-hidden",
                "min-w-0"
              )}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-muted-foreground font-mono text-xs sm:text-sm md:text-base truncate">
                {address}
              </p>
            </motion.div>
            <Button
              onClick={copyToClipboard}
              className="w-full sm:w-auto"
              size="sm"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="amount">Transfer Amount</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="amount"
                      type="text"
                      placeholder="Enter amount"
                      className="border-slate-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isConfirmed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    />
                  </FormControl>
                  <Label
                    htmlFor="confirm"
                    className="text-sm leading-relaxed cursor-pointer inline-block"
                  >
                    I confirm I have transferred{" "}
                    <span className="font-medium text-primary">
                      {form.watch("amount") || "[amount]"}
                    </span>{" "}
                    to the address{" "}
                    <span className="font-medium text-primary break-all">
                      {address
                        ? `${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`
                        : "wallet address"}
                    </span>
                  </Label>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Transfer"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

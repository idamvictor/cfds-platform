import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QRCodeDepositProps {
  address: string;
  title?: string;
  qrTitle?: string;
  addressTitle?: string;
  onSubmit?: (amount: string) => Promise<void> | void;
}

export default function QRCodeDeposit({
  address = "",
  title = "Deposit",
  qrTitle = "QR CODE",
  addressTitle = "DEPOSIT ADDRESS",
  onSubmit,
}: QRCodeDepositProps) {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleConfirmChange = (checked: boolean) => {
    setIsConfirmed(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !isConfirmed) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(amount);
      }
    } catch (error) {
      console.error("Error submitting transfer:", error);
    } finally {
      setIsLoading(false);
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
        </div>

        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wide">
            {addressTitle}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <motion.div
              className={cn(
                "flex-1 bg-background/20 border border-primary/10 rounded-md p-2 sm:p-3 overflow-hidden",
                "min-w-0" // Prevent flex child from expanding beyond container
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Transfer Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              required
              className="border-slate-700"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={isConfirmed}
              onCheckedChange={handleConfirmChange}
              className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
            />
            <Label
              htmlFor="confirm"
              className="text-sm leading-tight cursor-pointer"
            >
              I confirm I have transferred{" "}
              <span className="font-medium">
                {amount ? amount : "[amount]"}
              </span>{" "}
              to the{" "}
              <span className="font-medium break-all">
                {address && typeof address === "string"
                  ? `${address.substring(0, 6)}...${address.substring(
                      address.length - 4
                    )}`
                  : "wallet address"}
              </span>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!amount || !isConfirmed || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Transfer"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

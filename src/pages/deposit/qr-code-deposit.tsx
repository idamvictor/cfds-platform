import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QRCodeDepositProps {
  address: string;
  title?: string;
  qrTitle?: string;
  addressTitle?: string;
}

export default function QRCodeDeposit({
  address,
  title = "Deposit",
  qrTitle = "QR CODE",
  addressTitle = "DEPOSIT ADDRESS",
}: QRCodeDepositProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      </div>
    </div>
  );
}


import { motion } from "framer-motion";
import { CopyIcon } from "lucide-react";
import {QRCodeSVG} from "qrcode.react";
import { Button } from "@/components/ui/button";

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



  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-lg">
      {title && (
        <h2 className="text-2xl font-bold mb-6">
          {title}
        </h2>
      )}

      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {qrTitle}
          </h3>
          <motion.div
            className="bg-white p-4 inline-block rounded-md"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <QRCodeSVG
              value={address}
              size={180}
            />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wide">
            {addressTitle}
          </h3>
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex-1 bg-background/20 border border-primary/10 rounded-md p-3 overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-muted-foreground font-mono text-sm md:text-base truncate">
                {address}
              </p>
            </motion.div>
            <Button><CopyIcon/> Copy</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

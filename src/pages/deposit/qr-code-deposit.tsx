"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import {QRCodeSVG} from "qrcode.react";

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
  const [displayAddress, setDisplayAddress] = useState("");

  useEffect(() => {
    // Set the address when the component mounts or address changes
    setDisplayAddress(address);
  }, [address]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#121826] rounded-lg">
      {title && (
        <h2 className="text-2xl font-bold text-primary mb-6">
          {title}
        </h2>
      )}

      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
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
          <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
            {addressTitle}
          </h3>
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex-1 bg-background/20 border border-primary/10 rounded-md p-3 overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-primary font-mono text-sm md:text-base truncate">
                {displayAddress}
              </p>
            </motion.div>
            <motion.button
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                copied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              } text-white min-w-[100px]`}
              onClick={handleCopy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {copied ? (
                <span className="flex items-center justify-center">
                  <Check className="w-5 h-5 mr-1" /> Copied
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Copy className="w-5 h-5 mr-1" /> Copy
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export default function CardDeposit({
  onDepositSuccess,
}: {
  onDepositSuccess?: () => void;
}) {
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
    amount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  console.log("focusedField", focusedField);

  const handleInputChange = (field: string, value: string) => {
    setCardDetails({
      ...cardDetails,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/user/deposit/store", {
        amount: cardDetails.amount,
        method: "card",
        card_holder_name: cardDetails.name,
        card_number: cardDetails.number,
        exp_date: cardDetails.expiry,
        csv: cardDetails.cvv,
      });

      toast.success("Deposit request submitted successfully");
      onDepositSuccess?.(); // Call the success callback
      // Reset form
      setCardDetails({
        name: "",
        number: "",
        expiry: "",
        cvv: "",
        amount: "",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to submit deposit request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Credit Card Preview */}
        <div className="flex items-center justify-center">
          <motion.div
            className="w-full max-w-md aspect-[1.6/1] relative rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-muted to-gray-400 rounded-2xl">
              <div className="absolute bottom-0 w-full h-1/2 bg-gray-600 rounded-b-2xl" />
            </div>

            {/* Card Chip */}
            <div className="absolute top-[10%] left-[10%]">
              <svg
                width="50"
                height="40"
                viewBox="0 0 50 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="48"
                  height="38"
                  rx="4"
                  stroke="white"
                  strokeWidth="2"
                />
                <rect
                  x="10"
                  y="15"
                  width="30"
                  height="10"
                  rx="5"
                  stroke="white"
                  strokeWidth="2"
                />
                <line
                  x1="25"
                  y1="5"
                  x2="25"
                  y2="35"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Card Number */}
            <div className="absolute top-[40%] left-[10%] right-[10%]">
              <p className="text-xs text-muted-foreground mb-1">card number</p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono tracking-wider truncate">
                {cardDetails.number || "#### #### #### ####"}
              </p>
            </div>

            {/* Cardholder Name */}
            <div className="absolute bottom-[10%] left-[10%] max-w-[50%]">
              <p className="text-xs text-muted-foreground mb-1">
                cardholder name
              </p>
              <p className="text-xs sm:text-sm md:text-md font-mono truncate">
                {cardDetails.name || "YOUR NAME"}
              </p>
            </div>

            {/* Expiration */}
            <div className="absolute bottom-[10%] right-[10%] text-right">
              <p className="text-xs text-muted-foreground mb-1">expiration</p>
              <div className="flex items-center justify-end">
                <p className="text-[8px] sm:text-[10px] mr-1">VALID THRU</p>
                <p className="text-xs sm:text-sm md:text-md font-mono">
                  {cardDetails.expiry || "MM/YY"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Form */}
        <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Input
                id="name"
                className="bg-background/10 border-primary/20 text-muted-foreground focus:border-primary/50 transition-all"
                value={cardDetails.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Input
                id="cardNumber"
                className="bg-background/10 border-primary/20 text-muted-foreground focus:border-primary/50 transition-all"
                value={cardDetails.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                onFocus={() => setFocusedField("number")}
                onBlur={() => setFocusedField(null)}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiration (mm/yy)</Label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Input
                  id="expiry"
                  className="bg-background/10 border-primary/20 text-muted-foreground focus:border-primary/50 transition-all"
                  value={cardDetails.expiry}
                  onChange={(e) => handleInputChange("expiry", e.target.value)}
                  onFocus={() => setFocusedField("expiry")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="MM/YY"
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Input
                  id="cvv"
                  type="password"
                  maxLength={4}
                  className="bg-background/10 border-primary/20 text-muted-foreground focus:border-primary/50 transition-all"
                  value={cardDetails.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  onFocus={() => setFocusedField("cvv")}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="relative"
                >
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="amount"
                    type="number"
                    className="bg-background/10 border-primary/20 text-muted-foreground focus:border-primary/50 transition-all pl-10"
                    placeholder="0.00"
                    value={cardDetails.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    onFocus={() => setFocusedField("amount")}
                    onBlur={() => setFocusedField(null)}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="pt-4"
          >
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Sparkles } from "lucide-react";

interface DepositPromptModalProps {
  onDeposit: () => void;
}

const DepositPromptModal: React.FC<DepositPromptModalProps> = ({ onDeposit }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show after 2 seconds on every refresh
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeposit = () => {
    setIsOpen(false);
    onDeposit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-[400px] !border-none !bg-transparent !shadow-none p-0 overflow-visible transition-none [&>button]:hidden"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
               className="mt-12 bg-[#1c1c24]/90 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
              style={{
                boxShadow: "0 0 80px -20px var(--trading-accent), inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-trading-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-trading-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-trading-accent/10 transition-colors z-10"
              >
                <X className="h-5 w-5 text-trading-light/50 hover:text-trading-light" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <motion.div
                  initial={{ rotate: -10, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <img
                    src="/assets/deposit-prompt.png" 
                    alt="Deposit illustration" 
                    className="w-50 h-50 object-contain drop-shadow-2xl"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 -right-2 bg-trading-accent text-trading-dark p-2 rounded-2xl shadow-[0_0_10px_var(--trading-accent)]"
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-trading-light">
                    Ready to trade?
                  </h2>
                  <p className="text-trading-muted text-sm max-w-[200px]">
                    Deposit funds now so that you can start <span className="text-trading-accent font-bold">profiting</span>!
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <Button 
                    onClick={handleDeposit}
                    className="w-full h-12 rounded-2xl text-base font-semibold transition-all hover:scale-[1.02] active:scale-95 bg-trading-accent hover:bg-trading-accent/90 text-trading-dark shadow-[0_4px_14px_0_var(--trading-accent)]"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Deposit Now
                  </Button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-trading-muted text-xs font-medium hover:text-trading-light transition-colors py-2"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default DepositPromptModal;

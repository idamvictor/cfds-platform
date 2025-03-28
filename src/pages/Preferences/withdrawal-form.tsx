import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WithdrawalHistory } from "@/components/withdrawal/withdrawal-history";

export default function WithdrawalForm() {
  const [amount, setAmount] = React.useState("");
  const [currency, setCurrency] = React.useState("bitcoin");
  const [walletAddress, setWalletAddress] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle withdrawal request submission
    console.log({ amount, currency, walletAddress });

    // Reset form
    setAmount("");
    setWalletAddress("");
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">WITHDRAWAL</h1>

      <div>
        <h2 className="text-lg font-medium mb-6">Withdrawal requests</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-muted-foreground">
                Amount
              </label>
              <div className="relative">
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-card border-card-foreground/10 pr-8"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-muted-foreground">
                Withdrawal Details
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-card border-card-foreground/10">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-6">WITHDRAWAL DETAILS</h2>

            <div className="space-y-2">
              <label htmlFor="walletAddress" className="text-muted-foreground">
                Wallet Address
              </label>
              <Input
                id="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-card border-card-foreground/10"
                placeholder={
                  currency === "bank"
                    ? "Account details"
                    : "Enter wallet address"
                }
                required
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Request Withdrawal
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-6">Withdrawal requests</h2>
        <WithdrawalHistory />
      </div>
    </div>
  );
}

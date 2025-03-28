"use client";

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

interface Account {
  id: string;
  number: string;
  currency: string;
  balance: number;
  credit: number;
  status: "active" | "inactive" | "suspended";
}

interface TransferFormProps {
  accounts: Account[];
}

export function TransferForm({ accounts }: TransferFormProps) {
  const [fromAccount, setFromAccount] = React.useState<string>(
    accounts[0]?.id || ""
  );
  const [toAccount, setToAccount] = React.useState<string>(
    accounts[0]?.id || ""
  );
  const [amount, setAmount] = React.useState<string>("");

  const handleTransfer = () => {
    // In a real app, this would call an API to process the transfer
    console.log("Transfer", { fromAccount, toAccount, amount });

    // Reset form
    setAmount("");
  };

  const getAccountLabel = (account: Account) => {
    return `${account.number} ($${account.balance.toFixed(2)})`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">
        TRANSFER FUNDS BETWEEN YOUR ACCOUNTS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="fromAccount" className="text-muted-foreground">
            From account
          </label>
          <Select value={fromAccount} onValueChange={setFromAccount}>
            <SelectTrigger className="bg-card border-card-foreground/10">
              <SelectValue>
                {accounts.find((acc) => acc.id === fromAccount)
                  ? getAccountLabel(
                      accounts.find((acc) => acc.id === fromAccount)!
                    )
                  : "Select account"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {getAccountLabel(account)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="toAccount" className="text-muted-foreground">
            To account
          </label>
          <Select value={toAccount} onValueChange={setToAccount}>
            <SelectTrigger className="bg-card border-card-foreground/10">
              <SelectValue>
                {accounts.find((acc) => acc.id === toAccount)
                  ? getAccountLabel(
                      accounts.find((acc) => acc.id === toAccount)!
                    )
                  : "Select account"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {getAccountLabel(account)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="amount" className="text-muted-foreground">
            Amount
          </label>
          <Input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-card border-card-foreground/10"
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <Button
            onClick={handleTransfer}
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
            disabled={
              !amount ||
              fromAccount === toAccount ||
              Number.parseFloat(amount) <= 0
            }
          >
            Make Transfer
          </Button>
        </div>
      </div>
    </div>
  );
}

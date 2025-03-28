
import { AccountsTable } from "@/components/account/accounts-table";
import { TransferForm } from "@/components/account/transfer-form";
import * as React from "react";

// Account interface
interface Account {
  id: string;
  number: string;
  currency: string;
  balance: number;
  credit: number;
  status: "active" | "inactive" | "suspended";
}

export default function AccountsPage() {
  // Accounts state
  const [accounts, setAccounts] = React.useState<Account[]>([
    {
      id: "acc-1",
      number: "CFD 1651738",
      currency: "USD",
      balance: 610.05,
      credit: 0.0,
      status: "active",
    },
  ]);

  console.log(setAccounts);

  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">ACCOUNTS</h1>

      <TransferForm accounts={accounts} />

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Your Accounts</h2>
        <AccountsTable accounts={accounts} />
      </div>
    </div>
  );
}

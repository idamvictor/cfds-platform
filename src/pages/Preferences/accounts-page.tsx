import { AccountsTable } from "@/components/account/accounts-table";
import { TransferForm } from "@/components/account/transfer-form";
import useUserStore from "@/store/userStore";

export default function AccountsPage() {
  const user = useUserStore((state) => state.user);
  const accounts = user?.accounts || [];

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

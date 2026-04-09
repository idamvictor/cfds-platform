import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WithdrawalHistory } from "@/components/withdrawal/withdrawal-history";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useState, useEffect } from "react";
import useDataStore from "@/store/dataStore";
import useUserStore from "@/store/userStore";
import {WireTransferConfirmationModal} from "@/components/withdrawal/WireTransferConfirmationModal.tsx";
import { ArrowDownToLine, ArrowUpFromLine, TriangleAlert } from "lucide-react";
import { BalanceStrip } from "@/components/withdrawal/BalanceStrip";
import { ModeSwitch } from "@/components/withdrawal/ModeSwitch";
import { WithdrawalModeBar } from "@/components/withdrawal/WithdrawalModeBar";
import { CoinGrid } from "@/components/withdrawal/CoinGrid";
import { WithdrawalSummary } from "@/components/withdrawal/WithdrawalSummary";
import { ProcessingTimeline } from "@/components/withdrawal/ProcessingTimeline";
import { PenaltySchedule } from "@/components/withdrawal/PenaltySchedule";
import { StakedWithdrawalPanel } from "@/components/withdrawal/StakedWithdrawalPanel";
import { WithdrawalFAQ } from "@/components/withdrawal/WithdrawalFAQ";
import { ContributePanel } from "@/components/deposit/ContributePanel";
import DepositHistory from "@/components/deposit-history";

// ── Schemas (unchanged) ──────────────────────────────────────────────

const baseWithdrawalSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  method: z.string().min(1, "Payment method is required"),
});

const cryptoWithdrawalSchema = baseWithdrawalSchema.extend({
  network: z.string().min(1, "Network is required"),
  wallet_address: z.string().min(1, "Wallet address is required"),
  // These fields should not be included in crypto validation
  bank_name: z.string().optional(),
  bank_address: z.string().optional(),
  iban_number: z.string().optional(),
  account_number: z.string().optional(),
  account_name: z.string().optional(),
  swiftcode: z.string().optional(),
});

const wireTransferWithdrawalSchema = baseWithdrawalSchema.extend({
  bank_name: z.string().min(1, "Bank name is required"),
  bank_address: z.string().min(1, "Bank address is required"),
  account_number: z.string().min(1, "Account number is required"),
  account_name: z.string().min(1, "Account name is required"),
  iban_number: z.string().optional(),
  swiftcode: z.string().optional(),
  // These fields should not be included in wire transfer validation
  network: z.string().optional(),
  wallet_address: z.string().optional(),
});

const combinedSchema = z.discriminatedUnion("method", [
  cryptoWithdrawalSchema.extend({ method: z.literal("crypto") }),
  wireTransferWithdrawalSchema.extend({ method: z.literal("wire_transfer") }),
]);

type WithdrawalFormData = z.infer<typeof combinedSchema>;

// ── Component ────────────────────────────────────────────────────────

export default function WithdrawalForm() {
  const { data, fetchData } = useDataStore();
  const user = useUserStore((state) => state.user);
  const availableBalance = user?.balance || 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formValues, setFormValues] = useState<WithdrawalFormData | null>(null);

  // UI-only state (does NOT overlap with any submitted form field)
  const [activeMode, setActiveMode] = useState<"deposit" | "withdraw">("withdraw");
  const [clientMode, setClientMode] = useState<"fresh" | "staked">("fresh");
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [selectedCoinName, setSelectedCoinName] = useState("Bitcoin");

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      amount: "",
      method: "crypto",
      network: "",
      wallet_address: "",
      bank_name: "",
      bank_address: "",
      account_number: "",
      account_name: "",
      swiftcode: "",
      iban_number: "",
    },
  });

  const method = form.watch("method");
  const watchedAmount = form.watch("amount");
  const watchedNetwork = form.watch("network");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set default network if available
  useEffect(() => {
    if (data?.crypto_networks?.length) {
      const currentNetwork = form.getValues("network");
      if (!currentNetwork) {
        form.setValue("network", data.crypto_networks[0], {
          shouldValidate: true,
        });
      }
    }
  }, [data?.crypto_networks, form]);

  // This function prepares the form submission and shows modal for wire transfers
  async function onSubmit(values: WithdrawalFormData) {
    if (values.method === "wire_transfer") {
      setFormValues(values);
      setShowConfirmationModal(true);
      return;
    }

    // For crypto withdrawals, proceed directly
    await submitWithdrawal(values);
  }

  // This function actually submits the form data
  async function submitWithdrawal(values: WithdrawalFormData) {
    try {
      setIsSubmitting(true);
      await axiosInstance.post("/user/withdrawal/store", values);
      toast.success("Withdrawal request submitted successfully");
      form.reset();
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage = "Failed to submit withdrawal request";

      if (error?.response?.data) {
        // Handle the error format: { status: "failed", error: "Insufficient balance", message: "Insufficient balance", error_type: "error" }
        const responseData = error.response.data;
        errorMessage = responseData.message || responseData.error || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowConfirmationModal(false);
    }
  }

  // Handle confirmation from the modal
  const handleConfirm = () => {
    if (formValues) {
      submitWithdrawal(formValues);
    }
  };

  const handleModeChange = (mode: "deposit" | "withdraw") => {
    setActiveMode(mode);
  };

  const handleCoinSelect = (symbol: string, name: string, network: string) => {
    setSelectedCoin(symbol);
    setSelectedCoinName(name);
    // Sync to react-hook-form so the submitted payload always matches the UI
    form.setValue("network", network, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-6 withdrawal-page-bg text-[#eef2f7] min-h-screen p-4 sm:p-7">
      {/* ── Page Header ── */}
      <div>
        <h1 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          {activeMode === "deposit" ? (
            <>
              <ArrowDownToLine className="h-5 w-5 text-[#00dfa2]" />
              Deposit
            </>
          ) : (
            <>
              <ArrowUpFromLine className="h-5 w-5 text-[#00dfa2]" />
              Withdrawal
            </>
          )}
        </h1>
        <p className="mt-1 text-xs text-[#4a5468] sm:text-sm">
          {activeMode === "deposit"
            ? "Add funds to your portfolio. All deposits are actively managed."
            : "Select your withdrawal type below. New clients may withdraw freely. Clients with staked funds are subject to the 10% early exit fee."}
        </p>
      </div>

      {/* ── Balance Strip ── */}
      <BalanceStrip />

      {/* ── Mode Switch ── */}
      <ModeSwitch activeMode={activeMode} onModeChange={handleModeChange} />

      {/* ── Withdrawal Mode Bar (only shown in withdraw mode) ── */}
      {activeMode === "withdraw" && (
        <WithdrawalModeBar clientMode={clientMode} onModeChange={setClientMode} />
      )}

      {/* ── Main Content: 2-column layout ── */}
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_360px]">

        {/* ═══ LEFT COLUMN ═══ */}
        <div className="flex flex-col gap-4">

          {activeMode === "deposit" ? (
            <>
              {/* ── Contribute Tab ── */}
              <ContributePanel onDepositSuccess={() => setRefreshTrigger((p) => p + 1)} />
            </>
          ) : (
            <>
              {clientMode === "fresh" ? (
                <>
                  {/* ── Fresh Withdrawal Form ── */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f1220] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent" />

                    <div className="relative">
                      <div className="mb-5 flex items-center gap-2 text-sm font-extrabold text-white">
                        <ArrowUpFromLine className="h-4 w-4 text-[#00dfa2]" />
                        Withdraw Crypto Assets
                      </div>

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                          {/* Coin selection grid */}
                          <CoinGrid
                            selectedCoin={selectedCoin}
                            formNetwork={watchedNetwork || ""}
                            onCoinSelect={handleCoinSelect}
                          />

                          {/* Amount + Method row */}
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                                      Withdrawal Amount
                                    </FormLabel>
                                    <FormControl>
                                      <div className="flex overflow-hidden rounded-xl border-[1.5px] border-white/[0.08] bg-[#0a0d15] transition-all duration-200 focus-within:border-[#00dfa2] focus-within:shadow-[0_0_0_3px_rgba(0,223,162,0.1)]">
                                        <div className="flex items-center px-3.5 text-sm font-bold text-[#00dfa2] bg-[#131a28] border-r border-white/[0.04]">
                                          $
                                        </div>
                                        <Input
                                          placeholder="0.00"
                                          {...field}
                                          type="number"
                                          className="border-0 bg-transparent font-mono text-[#eef2f7] shadow-none focus-visible:ring-0"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                    {/* Quick amount buttons */}
                                    <div className="mt-1.5 flex gap-1.5">
                                      {["1000", "5000", "10000"].map((v) => (
                                        <button
                                          key={v}
                                          type="button"
                                          onClick={() => form.setValue("amount", v, { shouldValidate: true })}
                                          className="flex-1 rounded-md border border-white/[0.06] bg-[#131a28] py-1 text-[11px] font-bold text-[#4a5468] transition-colors hover:border-white/[0.1] hover:text-[#a8b5c8]"
                                        >
                                          ${Number(v).toLocaleString()}
                                        </button>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => form.setValue("amount", String(availableBalance), { shouldValidate: true })}
                                        className="flex-1 rounded-md border border-[#c8e64e]/30 bg-[#c8e64e]/[0.06] py-1 text-[11px] font-bold text-[#c8e64e] transition-colors hover:bg-[#c8e64e]/10"
                                      >
                                        Max
                                      </button>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                                      Payment Method
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="input-focus-glow">
                                          <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="border-white/[0.08] bg-[#0f1220]">
                                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                                        <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Crypto fields */}
                          {method === "crypto" && (
                            <div className="space-y-4 rounded-xl border border-white/[0.04] bg-[#0a0d15] p-4">
                              <FormField
                                control={form.control}
                                name="network"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">Network</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="input-focus-glow">
                                          <SelectValue placeholder="Select network" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="border-white/[0.08] bg-[#0f1220]">
                                        {data?.crypto_networks?.map((network) => (
                                          <SelectItem key={network} value={network}>
                                            {network}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="wallet_address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                                      Destination Wallet Address
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter your external wallet address (e.g. bc1q...)"
                                        {...field}
                                        className="input-focus-glow font-mono text-xs"
                                      />
                                    </FormControl>
                                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#5f6b7f]">
                                      <TriangleAlert className="h-3 w-3 text-[#FF9800]" />
                                      Double-check the address and network. Transactions cannot be reversed.
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          {/* Wire transfer fields */}
                          {method === "wire_transfer" && (
                            <div className="space-y-4 rounded-xl border border-white/[0.04] bg-[#0a0d15] p-4">
                              <FormField
                                control={form.control}
                                name="bank_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">Bank Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter bank name" {...field} className="input-focus-glow" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="bank_address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">Bank Address</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter bank address" {...field} className="input-focus-glow" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name="account_number"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">Account Number</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter account number" {...field} className="input-focus-glow font-mono" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="account_name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">Account Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter account name" {...field} className="input-focus-glow" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name="iban_number"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">IBAN Number</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter IBAN Number" {...field} className="input-focus-glow font-mono" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="swiftcode"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">Swift Code</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter SWIFT code" {...field} className="input-focus-glow font-mono" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}

                          {/* Withdrawal Summary */}
                          <WithdrawalSummary
                            coinSymbol={selectedCoin}
                            coinName={selectedCoinName}
                            amount={watchedAmount || "0"}
                            network={watchedNetwork || ""}
                          />

                          {/* Submit / Reset */}
                          <div className="flex gap-3 pt-1">
                            <Button
                              type="submit"
                              className="gradient-btn-green flex-1 gap-2 px-8 py-3 text-sm sm:flex-none"
                              disabled={isSubmitting}
                            >
                              <ArrowUpFromLine className="h-4 w-4" />
                              {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-xl border-white/[0.08] bg-[#131a28] text-[#8b97a8] transition-all duration-200 hover:border-white/[0.14] hover:bg-[#1a2438] hover:text-white"
                              onClick={() => form.reset()}
                            >
                              Reset
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </div>

                  {/* Processing Timeline */}
                  <ProcessingTimeline />
                </>
              ) : (
                <>
                  {/* ── Staked Withdrawal Panel ── */}
                  <StakedWithdrawalPanel />
                </>
              )}
            </>
          )}

          {/* ── FAQ (shown for both modes) ── */}
          <WithdrawalFAQ />
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div className="flex flex-col gap-4">
          {/* Penalty Schedule + Milestones (withdraw only) */}
          {activeMode === "withdraw" && <PenaltySchedule />}

          {/* Transaction History */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0f1220] p-5">
            <div className="mb-4 text-sm font-extrabold text-white">
              Transaction History
            </div>
            {activeMode === "deposit" ? (
              <DepositHistory key={refreshTrigger} />
            ) : (
              <WithdrawalHistory refreshTrigger={refreshTrigger} />
            )}
          </div>
        </div>
      </div>

      {/* Wire Transfer Confirmation Modal */}
      <WireTransferConfirmationModal
        open={showConfirmationModal}
        isCard={false}
        onOpenChange={setShowConfirmationModal}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

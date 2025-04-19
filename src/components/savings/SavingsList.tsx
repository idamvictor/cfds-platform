import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useSavingsStore from "@/store/savingsStore";

interface Saving {
  id: string;
  currency: string;
  roi: string;
  days: number;
  is_flexible: number;
  amount: string;
  earned: string;
  start_date: string;
  end_date: string | null;
  usd_amount: string;
  days_elapsed: number;
  created_at: string;
}

interface SavingsListProps {
  savings: Saving[];
}

export function SavingsList({ savings }: SavingsListProps) {
  const { claimSaving, isLoading } = useSavingsStore();
  const [claimingId, setClaimingId] = React.useState<string | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateProgress = (elapsed: number, total: number) => {
    return Math.min((elapsed / total) * 100, 100);
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const handleClaim = async (savingId: string) => {
    try {
      setClaimingId(savingId);
      await claimSaving(savingId);
      toast.success("Earnings claimed successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to claim earnings");
      }
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {savings.map((saving) => (
        <Card
          key={saving.id}
          className="p-6 bg-secondary text-white rounded-lg border border-gray-800"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <span
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                  saving.currency === "BTC" ? "bg-[#f7931a]" : "bg-[#1652f0]"
                }`}
              >
                {saving.currency === "BTC" ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="text-black"
                  >
                    <path
                      fill="currentColor"
                      d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.18-.24.45-.614.35.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.236-.54 2.19 1.32.33.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"
                    />
                  </svg>
                ) : (
                  <span className="text-white text-xl font-bold">$</span>
                )}
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">{saving.currency}</span>
                <span className="text-primary text-3xl font-bold mt-1">
                  {saving.roi}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Investment:</span>
              <span className="font-medium">
                {saving.currency === "BTC" ? "Ƀ" : "$"}
                {saving.amount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Period:</span>
              <span>
                {saving.days === 0 ? "Flexible" : `Locked ${saving.days} days`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Created:</span>
              <span>{formatDate(saving.created_at)}</span>
            </div>

            {saving.days === 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Release Time:</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Days Elapsed:</span>
                  <span>{saving.days_elapsed} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Earnings:</span>
                  <span className="text-primary">
                    {saving.currency === "BTC" ? "Ƀ" : "$"}
                    {saving.earned}
                  </span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-[#5ac975] text-black font-semibold py-3 mt-2 rounded"
                  onClick={() => handleClaim(saving.id)}
                  disabled={claimingId === saving.id || isLoading}
                >
                  {claimingId === saving.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    "Claim"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Release Time:</span>
                  <span>{formatDate(saving.end_date || "")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Days Elapsed:</span>
                  <span>{saving.days_elapsed} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Final earnings:</span>
                  <span className="text-primary">
                    {saving.currency === "BTC" ? "Ƀ" : "$"}
                    {saving.earned}
                  </span>
                </div>
                {calculateDaysRemaining(saving.end_date || "") === 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-primary">Ready to claim</span>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-[#5ac975] text-black font-semibold py-3 mt-2 rounded"
                      onClick={() => handleClaim(saving.id)}
                      disabled={claimingId === saving.id || isLoading}
                    >
                      {claimingId === saving.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        "Claim"
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Funds Released In:</span>
                      <span>
                        {calculateDaysRemaining(saving.end_date || "")} days
                      </span>
                    </div>
                    <div className="mt-4 relative">
                      <Progress
                        value={calculateProgress(
                          saving.days_elapsed,
                          saving.days
                        )}
                        className="h-1.5 bg-gray-700"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, parseISO } from "date-fns";

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
  const getCurrencySymbol = (currency: string): string => {
    return currency === "BTC" ? "₿" : "$";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Your Active Savings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savings.map((saving) => (
          <Card key={saving.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    saving.currency === "BTC"
                      ? "bg-amber-500 text-black"
                      : "bg-blue-500 text-white"
                  } text-xs font-bold`}
                >
                  {saving.currency === "BTC" ? "₿" : "$"}
                </span>
                <span className="font-semibold">{saving.currency}</span>
              </div>
              <Badge variant={saving.is_flexible ? "outline" : "default"}>
                {saving.is_flexible ? "Flexible" : `${saving.days} Days`}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  {getCurrencySymbol(saving.currency)}
                  {saving.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ROI:</span>
                <span className="text-success">{saving.roi}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Earned:</span>
                <span className="font-medium text-success">
                  {getCurrencySymbol(saving.currency)}
                  {saving.earned}
                </span>
              </div>
              {!saving.is_flexible && saving.end_date && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Release:</span>
                  <span className="text-xs">
                    {formatDistanceToNow(parseISO(saving.end_date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-xs">
                  {formatDistanceToNow(parseISO(saving.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

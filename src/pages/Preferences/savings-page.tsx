import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSavingsStore from "@/store/savingsStore";
import { toast } from "sonner";
import { SavingsList } from "@/components/savings/SavingsList";

// Form schema
const savingsFormSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  period: z.string(),
  roi: z.number(),
  plan_id: z.string(),
});

type FormData = z.infer<typeof savingsFormSchema>;

export default function SavingsPage() {
  const {
    plans,
    userSavings,
    isLoading,
    error,
    fetchPlans,
    fetchUserSavings,
    createSaving,
  } = useSavingsStore();
  const [expandedCurrency, setExpandedCurrency] = React.useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(savingsFormSchema),
    defaultValues: {
      amount: 0,
      period: "",
      roi: 0,
      plan_id: "",
    },
  });

  React.useEffect(() => {
    fetchPlans();
    fetchUserSavings();
  }, [fetchPlans, fetchUserSavings]);

  // Calculate release date (current date + lock period)
  const calculateReleaseDate = (period: string): string => {
    if (period === "flexible") return "";

    const now = new Date();
    const releaseDate = new Date(now);

    switch (period) {
      case "1_month":
        releaseDate.setMonth(now.getMonth() + 1);
        break;
      case "3_months":
        releaseDate.setMonth(now.getMonth() + 3);
        break;
      case "6_months":
        releaseDate.setMonth(now.getMonth() + 6);
        break;
      case "12_months":
        releaseDate.setFullYear(now.getFullYear() + 1);
        break;
    }

    return (
      releaseDate.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      releaseDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
  };

  // Calculate earnings based on ROI
  const calculateEarnings = (
    amount: number,
    roi: number,
    period: string
  ): string => {
    if (!amount || isNaN(amount)) return "0.00";

    let timeInYears = 0;
    switch (period) {
      case "flexible":
        timeInYears = 1 / 12;
        break;
      case "1_month":
        timeInYears = 1 / 12;
        break;
      case "3_months":
        timeInYears = 3 / 12;
        break;
      case "6_months":
        timeInYears = 6 / 12;
        break;
      case "12_months":
        timeInYears = 1;
        break;
    }

    const earnings = amount * (roi / 100) * timeInYears;
    return earnings.toFixed(2);
  };

  // Toggle currency expansion
  const toggleCurrencyExpansion = (currency: string) => {
    setExpandedCurrency(expandedCurrency === currency ? "" : currency);
  };

  // Format currency symbol
  const getCurrencySymbol = (currency: string): string => {
    return currency === "BTC" ? "₿" : "$";
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      await createSaving(data);
      toast.success("Savings plan created successfully");
      form.reset();
    } catch (error) {
      console.error("Error creating savings plan:", error);
      toast.error("Failed to create savings plan");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">SAVINGS</h1>

      {userSavings.length > 0 && <SavingsList savings={userSavings} />}

      <div className="space-y-4">
        <h2 className="text-lg font-medium">CREATE NEW SAVINGS PLAN</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Currency and period selection */}
          <div className="space-y-2">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-md overflow-hidden">
                <button
                  className="w-full flex items-center justify-between bg-card p-3 text-left"
                  onClick={() => toggleCurrencyExpansion(plan.currency)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        plan.currency === "BTC"
                          ? "bg-amber-500 text-black"
                          : "bg-blue-500 text-white"
                      } text-xs`}
                    >
                      {plan.currency === "BTC" ? "₿" : "🇺🇸"}
                    </span>
                    <span>{plan.currency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{plan.period}</span>
                    {expandedCurrency === plan.currency ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {expandedCurrency === plan.currency && (
                  <div className="bg-card/50">
                    <RadioGroup
                      value={
                        form.watch("plan_id") === plan.id
                          ? form.watch("period")
                          : ""
                      }
                      onValueChange={(value) => {
                        const period = plan.periods.find(
                          (p) => p.period === value
                        );
                        if (period) {
                          form.setValue("plan_id", plan.id);
                          form.setValue("period", value);
                          form.setValue("roi", period.roi);
                        }
                      }}
                    >
                      {plan.periods.map((period) => (
                        <div
                          key={period.period}
                          className="flex items-center justify-between p-3 border-t border-border/10"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value={period.period}
                              id={`${plan.currency}-${period.period}`}
                              className="text-success border-success/30"
                            />
                            <Label
                              htmlFor={`${plan.currency}-${period.period}`}
                            >
                              {period.title}
                            </Label>
                          </div>
                          <span className="text-success">{period.roi}%</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side - Savings details */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-card/50 p-6 rounded-md space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Time:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>

            {form.watch("period") !== "flexible" && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Release Time:</span>
                <span>{calculateReleaseDate(form.watch("period"))}</span>
              </div>
            )}

            {form.watch("plan_id") && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Currency Chosen:
                  </span>
                  <span>
                    {
                      plans.find((p) => p.id === form.watch("plan_id"))
                        ?.currency
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Period Chosen:</span>
                  <span>
                    {
                      plans
                        .find((p) => p.id === form.watch("plan_id"))
                        ?.periods.find((p) => p.period === form.watch("period"))
                        ?.title
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Rate:</span>
                  <span className="text-success">{form.watch("roi")}%</span>
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Enter Amount:</span>
              </div>
              <Input
                {...form.register("amount", { valueAsNumber: true })}
                className="bg-card border-card-foreground/10"
                type="number"
                min="0"
                step="0.01"
              />
              {form.formState.errors.amount && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            {form.watch("amount") > 0 && form.watch("roi") > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Your earnings:</span>
                <span>
                  {getCurrencySymbol(
                    plans.find((p) => p.id === form.watch("plan_id"))
                      ?.currency || ""
                  )}
                  {calculateEarnings(
                    form.watch("amount"),
                    form.watch("roi"),
                    form.watch("period")
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                className="bg-primary hover:bg-success/90 text-success-foreground"
                disabled={
                  !form.watch("amount") ||
                  !form.watch("plan_id") ||
                  !form.watch("period")
                }
              >
                Open Savings Account and invest{" "}
                {getCurrencySymbol(
                  plans.find((p) => p.id === form.watch("plan_id"))?.currency ||
                    ""
                )}
                {form.watch("amount") || "0.00"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

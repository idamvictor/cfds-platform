import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useStepNumberColor } from "@/hooks/useStepNumberColor";
import { useDepositMutation } from "@/services/deposit/deposit-queries";
import useSiteSettingsStore from "@/store/siteSettingStore";

// Validation Schema
const cardFundingSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), "Amount must be a number")
    .refine((val) => Number(val) >= 5, "Minimum amount is $5")
    .refine((val) => Number(val) <= 100000, "Maximum amount is $100,000"),
  nameOnCard: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  cardNumber: z
    .string()
    .regex(/^\d{13,19}$/, "Card number must be 13-19 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type CardFundingFormData = z.infer<typeof cardFundingSchema>;

interface CardFundingProps {
  onChangeMethod: () => void;
  onClose?: () => void;
  stepsCount?: 3 | 4;
}

const CardFunding: React.FC<CardFundingProps> = ({ 
  onChangeMethod, 
  onClose,
  stepsCount = 4
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const stepNumberColor = useStepNumberColor();
  const { settings } = useSiteSettingsStore();
  const { mutate, isPending } = useDepositMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<CardFundingFormData>({
    resolver: zodResolver(cardFundingSchema),
    mode: "onChange",
  });

  const amount = watch("amount");

  // Auto-format expiry date as MM/YY
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 4) value = value.slice(0, 4); // Max 4 digits

    if (value.length <= 2) {
      setValue("expiryDate", value, { shouldValidate: true });
    } else {
      const formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
      setValue("expiryDate", formatted, { shouldValidate: true });
    }
  };

  const handleFinalSubmit = (data: CardFundingFormData) => {
    mutate(
      {
        amount: Number(data.amount),
        method: "card",
        card_holder_name: data.nameOnCard,
        card_number: data.cardNumber,
        exp_date: data.expiryDate,
        csv: data.cvv,
      },
      {
        onSuccess: () => {
          toast.success("Payment submitted successfully!", {
            description: "Your deposit is awaiting admin approval.",
          });
          setIsSubmitted(true);
          reset();
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Payment submission failed";
          toast.error("Submission Failed", {
            description: errorMessage,
          });
        },
      },
    );
  };

  const steps = useMemo(() => {
    return stepsCount === 3 
      ? [
          { number: 1, label: "Fund Account" },
          { number: 2, label: "Payment Details" },
          { number: 3, label: "Completed" },
        ]
      : [
          { number: 1, label: "Fund Account" },
          { number: 2, label: "Payment Details" },
          { number: 3, label: "Payment Review" },
          { number: 4, label: "Completed" },
        ];
  }, [stepsCount]);

  const currentLabel = useMemo(() => {
    return steps.find((s) => s.number === currentStep)?.label || "";
  }, [steps, currentStep]);

  return (
    <div className="space-y-4 md:space-y-6 text-foreground min-h-[450px] w-full overflow-x-hidden">
      {/* Header and Progress Tracker */}
      <div className="space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-2xl px-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full font-bold text-[11px] md:text-sm transition-all duration-300 flex-shrink-0 ${
                  step.number < currentStep
                    ? "bg-accent text-slate-900 shadow-sm"
                    : step.number === currentStep
                      ? "bg-primary text-primary-foreground border-2 border-accent ring-2 ring-primary/20"
                      : `bg-muted ${stepNumberColor}`
                }`}
              >
                {step.number < currentStep ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>

              <span
                className={`hidden md:inline-block ml-2 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap ${
                  step.number <= currentStep ? "text-accent" : "text-foreground opacity-40"
                }`}
              >
                {step.label}
              </span>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 md:mx-4 ${
                    step.number < currentStep ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Title - Mobile Only */}
        <div className="md:hidden pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded tracking-tighter uppercase">Step 0{currentStep}</span>
            <h2 className="text-sm font-black text-foreground uppercase tracking-tight">{currentLabel}</h2>
          </div>
        </div>
      </div>

      {/* Step 1: Amount Selection */}
      {currentStep === 1 && (
        <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="flex items-start gap-2 bg-accent/5 p-3 rounded-xl border border-accent/10">
             <Lock className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
              <p className={`text-[10px] md:text-xs text-foreground font-bold leading-tight`}>
                We use secure, encrypted technology to protect your card info. All data is handled in compliance with international security standards.
              </p>
           </div>

          <div className="w-full space-y-5">
            <div className="space-y-3">
              <p className={`text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5`}>
                Quick Select Amount
              </p>
              <div className="flex gap-2 flex-wrap">
                {["250", "1000", "5000"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setValue("amount", value, { shouldValidate: true });
                    }}
                    className={`px-5 py-3 md:py-2.5 rounded-xl border-2 text-sm md:text-base font-black transition-all active:scale-95 cursor-pointer ${
                      amount === value
                        ? "border-accent bg-accent text-slate-900 shadow-md scale-[1.02]"
                        : `border-border bg-card text-foreground hover:border-accent hover:bg-accent/5`
                    }`}
                  >
                    ${Number(value).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">
                Amount (USD)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  {...register("amount")}
                  placeholder="0.00"
                   className={`w-full bg-neutral-50 border-2 rounded-xl pl-9 pr-4 py-4 text-2xl font-black text-left text-slate-900 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all tracking-tight shadow-sm placeholder:text-slate-400 ${
                    errors.amount ? "border-red-500" : "border-border"
                  }`}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-xl text-slate-900 opacity-40">$</span>
                </div>
              </div>
              {errors.amount && (
                <div className="flex items-center gap-1.5 mt-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-2 rounded-lg text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">
                    {errors.amount.message}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">
                Payment Method
              </label>
              <div className="flex items-center justify-between px-3 md:px-4 py-3 rounded-xl border-2 border-border bg-card">
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl">💳</span>
                  <span className="text-sm font-black text-foreground uppercase tracking-tight">
                    Card Payment
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onChangeMethod}
                  className="text-accent hover:text-accent/80 font-black text-xs md:text-sm uppercase tracking-tighter cursor-pointer"
                >
                  CHANGE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment Details */}
      {currentStep === 2 && (
        <form
          onSubmit={handleSubmit((data) => {
            if (stepsCount === 3) {
              handleFinalSubmit(data);
              setCurrentStep(3);
            } else {
              setCurrentStep(3);
            }
          })}
          className="space-y-4 md:space-y-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
           <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
             <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className={`text-[10px] md:text-xs text-foreground font-bold leading-tight`}>
                {settings?.name || "The platform"} uses secure, encrypted technology. Data entered here is safe.
              </p>
           </div>

          <div className="w-full space-y-4 md:space-y-5">
            <h3 className="text-base md:text-lg font-black text-foreground uppercase tracking-tight">
              Card Details
            </h3>

            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="EX: JOHN DOE"
                  {...register("nameOnCard")}
                   className={`w-full px-4 py-4 rounded-xl border-2 ${
                    errors.nameOnCard ? "border-red-500 focus:border-red-500" : "border-border focus:border-accent"
                  } bg-neutral-50 text-slate-900 font-black uppercase focus:outline-none transition-all shadow-sm placeholder:text-slate-400`}
                />
                {errors.nameOnCard && (
                  <div className="flex items-center gap-1.5 mt-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {errors.nameOnCard.message}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  {...register("cardNumber")}
                   className={`w-full px-4 py-4 rounded-xl border-2 ${
                    errors.cardNumber ? "border-red-500 focus:border-red-500" : "border-border focus:border-accent"
                  } bg-neutral-50 text-slate-900 font-black focus:outline-none transition-all shadow-sm placeholder:text-slate-400`}
                />
                {errors.cardNumber && (
                  <div className="flex items-center gap-1.5 mt-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {errors.cardNumber.message}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    {...register("expiryDate")}
                    onChange={handleExpiryDateChange}
                     className={`w-full px-4 py-4 rounded-xl border-2 ${
                      errors.expiryDate ? "border-red-500 focus:border-red-500" : "border-border focus:border-accent"
                    } bg-neutral-50 text-slate-900 font-black focus:outline-none transition-all shadow-sm placeholder:text-slate-400`}
                    inputMode="numeric"
                  />
                  {errors.expiryDate && (
                    <div className="flex items-center gap-1.5 mt-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {errors.expiryDate.message}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-80 ml-0.5">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    {...register("cvv")}
                     className={`w-full px-4 py-4 rounded-xl border-2 ${
                      errors.cvv ? "border-red-500 focus:border-red-500" : "border-border focus:border-accent"
                    } bg-neutral-50 text-slate-900 font-black focus:outline-none transition-all shadow-sm placeholder:text-slate-400`}
                  />
                  {errors.cvv && (
                    <div className="flex items-center gap-1.5 mt-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {errors.cvv.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 py-2 w-full">
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 md:py-3 bg-card border-2 border-border text-foreground font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-muted transition-all cursor-pointer shadow-sm"
              disabled={isPending}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-emerald-600 text-white font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {stepsCount === 3 ? (isPending ? "Processing..." : "Continue") : "Review Payment"}
              <span className="text-sm">→</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment Review & Success */}
      {currentStep === 3 && (
        <div className="space-y-4 md:space-y-6 w-full">
          {!isSubmitted ? (
            <>
              <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-5 md:p-6 space-y-5">
                  <h3 className="text-base md:text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                    📋 Payment Review
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                      <span className="text-xs md:text-sm font-black text-foreground opacity-60 uppercase tracking-tight">
                        Deposit Amount
                      </span>
                      <span className="text-sm md:text-base font-black text-accent">
                        ${Number(watch("amount")).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                      <span className="text-xs md:text-sm font-black text-foreground opacity-60 uppercase tracking-tight">
                        Cardholder
                      </span>
                      <span className="text-xs md:text-sm font-black text-foreground truncate max-w-[150px] uppercase">
                        {watch("nameOnCard")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                      <span className="text-xs md:text-sm font-black text-foreground opacity-60 uppercase tracking-tight">
                        Card Number
                      </span>
                      <span className="text-xs md:text-sm font-mono font-black text-foreground uppercase tracking-widest">
                        **** {watch("cardNumber")?.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-6 border-t border-border/50 flex justify-between items-center bg-accent/5">
                  <span className="text-sm md:text-base font-black text-foreground">Total Charge</span>
                  <span className="text-xl md:text-2xl font-black text-foreground">${Number(watch("amount")).toLocaleString()}</span>
                </div>
              </div>

               <div className="px-4 py-3 bg-accent/5 border-2 border-accent/10 rounded-xl">
                <p className={`text-[10px] md:text-xs text-foreground italic text-center font-black uppercase tracking-tighter opacity-70`}>
                  By clicking "Confirm & Pay", you authorize the transaction stated above.
                </p>
              </div>

              <div className="flex gap-2 md:gap-3 py-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    if (stepsCount === 3) {
                      setCurrentStep(2);
                      setIsSubmitted(false);
                    } else {
                      setCurrentStep(2);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 md:py-3 bg-card border-2 border-border text-foreground font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-muted transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm"
                  disabled={isPending}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(watch())}
                  disabled={isPending}
                  className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-emerald-600 text-white font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  {isPending ? "Processing..." : "Confirm & Pay"}
                  <span className="text-sm">→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6 text-center py-6 md:py-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-center">
                {isPending ? (
                  <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-accent animate-bounce" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Payment Processing</h2>
                <div className={`space-y-3 text-foreground font-bold`}>
                  <p className="text-sm leading-relaxed opacity-80 italic">Your payment is under review</p>
                  <p className="text-sm leading-relaxed">As part of compliance, our Accounts team may contact you to complete verification.</p>
                  <p className="text-sm leading-relaxed">Once verified, funds will be credited to your account instantly.</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/main/dashboard");
                    onClose?.();
                  }}
                  className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white font-black uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/main/chat");
                    onClose?.();
                  }}
                  className="w-full md:w-auto px-10 py-4 bg-card border-2 border-border text-foreground font-black uppercase tracking-tighter rounded-xl hover:bg-muted transition-all cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons - Step 1 Only */}
      {currentStep === 1 && (
        <div className="flex gap-2 md:gap-3 py-2 w-full">
          <button
            type="button"
            onClick={onChangeMethod}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 md:py-3 bg-card border-2 border-border text-foreground font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-muted transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!amount || !!errors.amount}
            className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-emerald-600 text-white font-black text-sm uppercase tracking-tighter rounded-xl hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            Continue
            <span className="text-sm">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CardFunding;

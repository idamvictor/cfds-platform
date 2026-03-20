import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutedTextClass } from "@/hooks/useMutedTextClass";
import { useMutedPlaceholderClass } from "@/hooks/useMutedPlaceholderClass";
import { useStepNumberColor } from "@/hooks/useStepNumberColor";
import { useDepositMutation } from "@/services/deposit/deposit-queries";

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
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutedClass = useMutedTextClass();
  const mutedPlaceholderClass = useMutedPlaceholderClass();
  const stepNumberColor = useStepNumberColor();
  const { mutate, isPending, error } = useDepositMutation();

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
      setValue("expiryDate", value);
    } else {
      const formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
      setValue("expiryDate", formatted);
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

  return (
    <div className="space-y-2 md:space-y-4 text-foreground min-h-[450px] w-full overflow-x-hidden">
      {/* Header and Progress Tracker */}
      <div className="space-y-2 md:space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between gap-1 md:gap-3 w-full">
          {(stepsCount === 3 
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
              ]
          ).map((step, index, allSteps) => (
            <div key={step.number} className="flex items-center flex-1 min-w-0">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full font-semibold text-[10px] md:text-xs transition-colors flex-shrink-0 ${
                  step.number < currentStep
                    ? "bg-accent text-primary-foreground"
                    : step.number === currentStep
                      ? "bg-primary text-primary-foreground border-2 border-accent"
                      : `bg-muted ${stepNumberColor}`
                }`}
              >
                {step.number < currentStep ? (
                  <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step Label - Hidden on mobile */}
              <span
                className={`hidden md:inline ml-1.5 text-[10px] md:text-xs font-medium whitespace-nowrap ${
                  step.number <= currentStep ? "text-foreground" : mutedClass
                }`}
              >
                {step.label}
              </span>

              {/* Divider */}
              {index < allSteps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1 md:mx-2 min-w-[4px] ${
                    step.number < currentStep ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Title - Mobile Only */}
        <div className="md:hidden text-center">
          <p className="text-xs font-semibold text-foreground">
            {
              (stepsCount === 3 
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
                  ]
              ).find((s) => s.number === currentStep)?.label
            }
          </p>
        </div>
      </div>

      {/* Step 1: Amount Selection */}
      {currentStep === 1 && (
        <div className="space-y-4 md:space-y-6">
          <p className={`text-[10px] md:text-xs ${mutedClass} leading-tight`}>
            We use secure, encrypted technology to process and store your card information. All data entered here is protected and handled in compliance with PCI DSS requirements and international security standards.
          </p>

          <div className="w-full space-y-4">
            {/* Quick Amount Selection */}
            <div className="space-y-2">
              <p className={`text-xs font-semibold ${mutedClass} uppercase`}>
                Quick Select
              </p>
              <div className="flex gap-2 md:gap-3 flex-wrap">
                {["250", "1000", "5000"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setValue("amount", value, { shouldValidate: true });
                    }}
                    className={`px-3 md:px-4 py-2 rounded-lg border-2 text-xs md:text-sm font-semibold transition-colors ${
                      amount === value
                        ? "border-accent bg-accent text-primary-foreground"
                        : `border-input text-foreground hover:border-accent hover:bg-accent/10`
                    }`}
                  >
                    ${Number(value).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-foreground">
                Amount to Add
              </label>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold text-xs md:text-sm">
                  $
                </span>
                <input
                  type="text"
                  {...register("amount")}
                  placeholder="Enter Amount"
                  className={`flex-1 px-3 py-1.5 rounded-lg border-2 text-[10px] md:text-xs ${
                    errors.amount ? "border-red-500" : "border-input"
                  } bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-xs md:text-sm">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Payment Method Display */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-foreground">
                Payment Method
              </label>
              <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-lg md:text-xl">💳</span>
                  <span className="text-xs md:text-sm text-foreground">
                    Card Payment
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onChangeMethod}
                  className="text-accent hover:text-accent/80 font-semibold text-xs md:text-sm"
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
          className="space-y-4 md:space-y-6 w-full"
        >
          {/* Security Notice */}
          <p
            className={`text-[10px] md:text-xs ${mutedClass} leading-tight bg-blue-50 dark:bg-blue-950/20 p-2.5 md:p-3 rounded-lg border border-blue-200 dark:border-blue-800`}
          >
            Citation invest uses secure, encrypted technology to store and
            handle your credit card information. Data entered here is safe.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="p-3 md:p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <p className="text-red-600 dark:text-red-400 text-xs md:text-sm">
                {error instanceof Error
                  ? error.message
                  : "An error occurred during payment processing"}
              </p>
            </div>
          )}

          {/* Card Details Section */}
          <div className="w-full space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-foreground">
              Card Details
            </h3>

            <div>
              <input
                type="text"
                placeholder="Name on Card"
                {...register("nameOnCard")}
                className={`w-full px-3 md:px-4 py-2 rounded-lg border-2 text-xs md:text-sm ${
                  errors.nameOnCard ? "border-red-500" : "border-input"
                } bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
              />
              {errors.nameOnCard && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.nameOnCard.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Card Number"
                  {...register("cardNumber")}
                  className={`w-full px-3 md:px-4 py-2 rounded-lg border-2 text-xs md:text-sm ${
                    errors.cardNumber ? "border-red-500" : "border-input"
                  } bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    {...register("expiryDate")}
                    onChange={handleExpiryDateChange}
                    className={`w-full px-3 md:px-4 py-2 rounded-lg border-2 text-xs md:text-sm ${
                      errors.expiryDate ? "border-red-500" : "border-input"
                    } bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
                    inputMode="numeric"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="CVV"
                    {...register("cvv")}
                    className={`w-full px-3 md:px-4 py-2 rounded-lg border-2 text-xs md:text-sm ${
                      errors.cvv ? "border-red-500" : "border-input"
                    } bg-white dark:bg-slate-950 text-foreground ${mutedPlaceholderClass} focus:outline-none focus:ring-2 focus:ring-accent`}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">
                      {errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 md:gap-3 pt-2 md:pt-4 w-full">
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-muted text-foreground font-semibold text-sm md:text-base rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-accent text-background font-semibold text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stepsCount === 3 ? (isPending ? "Processing..." : "Continue") : "Review Payment"}
              <span>→</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment Review & Success */}
      {currentStep === 3 && (
        <div className="space-y-4 md:space-y-6 w-full">
          {!isSubmitted ? (
            <>
              {/* Review Summary Card */}
              <div className="bg-card border-2 border-border/50 rounded-xl overflow-hidden">
                <div className="p-4 md:p-6 space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
                    <span>📋</span> Payment Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className={`text-xs md:text-sm ${mutedClass}`}>
                        Deposit Amount
                      </span>
                      <span className="text-sm md:text-base font-bold text-accent">
                        ${Number(watch("amount")).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className={`text-xs md:text-sm ${mutedClass}`}>
                        Payment Method
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm">💳</span>
                        <span className="text-xs md:text-sm font-medium">
                          Card Payment
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className={`text-xs md:text-sm ${mutedClass}`}>
                        Card Holder
                      </span>
                      <span className="text-xs md:text-sm font-medium">
                        {watch("nameOnCard")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className={`text-xs md:text-sm ${mutedClass}`}>
                        Card Number
                      </span>
                      <span className="text-xs md:text-sm font-medium">
                        **** **** **** {watch("cardNumber").slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Section */}
                <div className="bg-muted/30 p-4 md:p-6 border-t border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base font-bold text-foreground">
                      Total Charge
                    </span>
                    <span className="text-lg md:text-xl font-black text-foreground">
                      ${Number(watch("amount")).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Box */}
              <p
                className={`text-[10px] md:text-xs ${mutedClass} italic text-center px-4`}
              >
                By clicking "Confirm & Pay", you authorize the transaction of
                the amount stated above.
              </p>

              {/* Form Actions */}
              <div className="flex gap-2 md:gap-3 pt-2 md:pt-4 w-full">
                <button
                  type="button"
                  onClick={() => {
                    if (stepsCount === 3) {
                      setCurrentStep(2);
                      setIsSubmitted(false);
                      // In 3-step mode, moving back means resetting submitted state
                    } else {
                      setCurrentStep(2);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-muted text-foreground font-semibold text-sm md:text-base rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(watch())}
                  disabled={isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-accent text-background font-semibold text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Processing..." : "Confirm & Pay"}
                  <span>→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 md:space-y-6 text-center py-6 md:py-8">
              {/* Status Content */}
              <div className="flex justify-center">
                {isPending ? (
                  <div className="animate-spin">
                    <svg
                      className="w-8 h-8 md:w-12 md:h-12 text-accent"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-accent animate-bounce" />
                  </div>
                )}
              </div>

              <div className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Payment Processing
                </h2>
                <div className={`space-y-2 md:space-y-3 ${mutedClass}`}>
                  <p className="text-xs md:text-sm leading-relaxed">
                    Your payment is under review
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed">
                    As part of compliance with financial regulations, our Accounts Department may contact you to complete verification.
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed">
                    Once your payment is approved and verified, the funds will be credited to your account. You will also receive an email with instructions on the next steps.
                  </p>
                </div>
              </div>

              <div className="pt-2 md:pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (location.pathname === "/main/dashboard") {
                      onClose?.();
                    } else {
                      navigate("/main/dashboard");
                      onClose?.();
                    }
                  }}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-2 bg-accent text-background font-semibold text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons - Step 1 Only */}
      {currentStep === 1 && (
        <div className="flex gap-2 md:gap-3 pt-2 md:pt-4 w-full">
          <button
            type="button"
            onClick={onChangeMethod}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-muted text-foreground font-semibold text-sm md:text-base rounded-lg hover:bg-muted/80 transition-colors"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!amount || !!errors.amount}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-accent text-background font-semibold text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CardFunding;

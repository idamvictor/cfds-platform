import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// ── Validation (UNCHANGED) ─────────────────────────────────────────
const otpFormSchema = z.object({
  code: z
    .string()
    .min(1, "Security code is required")
    .refine((val) => val.match(/^\d+$/), "Code must contain only numbers"),
});

type OTPFormValues = z.infer<typeof otpFormSchema>;

interface OTPVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
}

export function OTPVerification({ email, onVerify }: OTPVerificationProps) {
  // ── State (UNCHANGED) ──
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Form (UNCHANGED) ──
  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  // ── Handler (UNCHANGED) ──
  const onSubmit = async (values: OTPFormValues) => {
    setIsSubmitting(true);
    try {
      await onVerify(values.code);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      {/* Glassmorphic card */}
      <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-[#00dfa2]/[0.02] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.4),0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-9">
        {/* Glass highlight overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/[0.03] to-transparent" />

        {/* Header */}
        <div className="relative z-[2] mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00dfa2]/25 bg-gradient-to-br from-[#00dfa2]/20 to-[#00dfa2]/5 text-[#00dfa2] shadow-[0_6px_16px_rgba(0,223,162,0.15)]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="font-[Outfit,sans-serif] text-xl font-bold tracking-tight text-[#eef2f7]">
            Verify Login
          </h1>
          <p className="mt-2 text-sm text-[#8b97a8]">
            Your security code has been sent to{" "}
            <span className="font-semibold text-[#eef2f7]">{email}</span>
          </p>
        </div>

        {/* Spam warning */}
        <div className="relative z-[2] mb-6 flex gap-3 rounded-xl border border-[#FF9800]/20 bg-[#FF9800]/[0.06] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF9800]" />
          <p className="text-[0.8rem] leading-relaxed text-[#a0aec0]">
            If you didn&apos;t get an email in your inbox, check your spam or
            junk folder. If the email is there, select &ldquo;Report as not
            spam&rdquo; to improve filtering.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative z-[2] space-y-5"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                    Security code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter your code"
                      className="h-12 rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-[18px] text-center font-mono text-lg tracking-[0.3em] text-[#eef2f7] placeholder:text-[#4a5468] placeholder:tracking-normal placeholder:font-sans transition-all hover:border-white/[0.18] focus-visible:border-[#00dfa2] focus-visible:shadow-[0_0_0_3px_rgba(0,223,162,0.1)] focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-br from-[#00ffc3] via-[#00dfa2] to-[#00b881] font-bold text-[0.95rem] text-black shadow-[0_4px_14px_rgba(0,223,162,0.3),inset_0_2px_0_rgba(255,255,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,223,162,0.4)] active:translate-y-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Verifying...
                  </span>
                ) : (
                  "Verify & Login"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-12 w-full rounded-xl border border-white/[0.1] bg-transparent text-[#8b97a8] transition-all hover:bg-white/[0.04] hover:text-[#eef2f7]"
                onClick={() => window.location.reload()}
              >
                Exit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

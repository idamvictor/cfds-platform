import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { KeyRound } from "lucide-react";
import useUserStore from "@/store/userStore";
import Logo from "@/components/Logo";
import { toast } from "@/components/ui/sonner";
import axiosInstance from "@/lib/axios";

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

// ── Validation (UNCHANGED) ─────────────────────────────────────────
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  // ── Auth redirect (UNCHANGED) ──
  useEffect(() => {
    if (user && token) {
      navigate("/main");
    }
  }, [user, token, navigate]);

  // ── Form (UNCHANGED) ──
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // ── Submit handler (UNCHANGED) ──
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/forgot-password",
        values,
      );
      console.log("Forgot password response:", response.data);

      toast.success(
        response.data.message ||
          "Password reset instructions sent to your email",
      );
      navigate("/");
    } catch (error) {
      console.error("Forgot password request failed:", error);

      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            "Failed to process password reset request",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#07080c] text-[#eef2f7]">
      {/* ── Main content ── */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 md:py-16">
        <div className="grid w-full max-w-[880px] grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* ══════ LEFT: Logo + Form Card ══════ */}
          <div className="order-2 flex flex-col md:order-1">
            {/* Logo above card */}
            <div className="mb-5">
              <Logo />
            </div>

            {/* Glassmorphic form card */}
            <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-[#00dfa2]/[0.02] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.4),0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-9">
              {/* Glass highlight overlay */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/[0.03] to-transparent" />

              {/* Header with icon */}
              <div className="relative z-[2] mb-7 border-b border-white/[0.06] pb-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00dfa2]/25 bg-gradient-to-br from-[#00dfa2]/20 to-[#00dfa2]/5 text-[#00dfa2] shadow-[0_6px_16px_rgba(0,223,162,0.12)]">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h2 className="font-[Outfit,sans-serif] text-2xl font-bold text-[#eef2f7]">
                  Reset password
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#8b97a8]">
                  Enter the email you signed up with and we&apos;ll send you a
                  reset link.
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            {...field}
                            className="h-12 rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-[18px] text-[0.95rem] text-[#eef2f7] placeholder:text-[#4a5468] transition-all hover:border-white/[0.18] focus-visible:border-[#00dfa2] focus-visible:shadow-[0_0_0_3px_rgba(0,223,162,0.1)] focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Button
                      type="button"
                      onClick={() => navigate("/")}
                      className="h-12 min-w-[100px] rounded-xl border border-white/[0.1] bg-transparent px-5 font-semibold text-[#8b97a8] transition-all hover:bg-white/[0.04] hover:text-[#eef2f7]"
                    >
                      Back
                    </Button>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-12 min-w-[140px] rounded-xl bg-gradient-to-br from-[#00ffc3] via-[#00dfa2] to-[#00b881] px-5 font-bold text-black shadow-[0_4px_14px_rgba(0,223,162,0.3),inset_0_2px_0_rgba(255,255,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,223,162,0.4)] active:translate-y-0"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Sending...
                        </span>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Info section */}
              <div className="relative z-[2] my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-sm font-medium text-[#4a5468]">info</span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <div className="relative z-[2] rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-[#8b97a8]">
                If you registered through SSO (Google, Apple, or LinkedIn), we
                are unable to modify your password. Please use the reset
                password feature on your chosen platform.
              </div>

              {/* Back to login link */}
              <p className="relative z-[2] mt-5 text-center text-[0.85rem] text-[#8b97a8]">
                Remember your password?{" "}
                <Link
                  to="/"
                  className="font-semibold text-[#00dfa2] transition-colors hover:text-[#00ffc3]"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* ══════ RIGHT: Trust Panel ══════ */}
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c1629] to-[#080e1c] p-7 sm:p-8">
              {/* Subtle radial glow */}
              <div className="pointer-events-none absolute -right-1/2 -top-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,223,162,0.08),transparent_70%)]" />

              <div className="relative z-[1] flex flex-col gap-6">
                <TrustItem
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  }
                  title="Your account is safe"
                  description="Password reset links are encrypted and expire after a short time."
                />
                <TrustItem
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                  title="Secure reset process"
                  description="We verify your identity before allowing any password changes."
                />
                <TrustItem
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  }
                  title="Check your inbox"
                  description="The reset link will arrive within a few minutes. Check spam if needed."
                />
              </div>

              {/* Separator */}
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

              {/* Security tips */}
              <div className="relative z-[1]">
                <h3 className="mb-3 font-[Outfit,sans-serif] text-[0.88rem] font-bold text-[#eef2f7]">
                  Security tips
                </h3>
                <ul className="space-y-2.5 text-[0.8rem] leading-relaxed text-[#a0aec0]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00dfa2]" />
                    Use a unique password you don&apos;t use anywhere else
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00dfa2]" />
                    Include uppercase, lowercase, numbers and symbols
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00dfa2]" />
                    Enable two-factor authentication for extra protection
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-5 py-5">
        <div className="mx-auto flex max-w-[880px] items-center justify-center gap-7 text-sm text-[#4a5468]">
          <span>English</span>
          <span>Cookies</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </footer>
    </div>
  );
}

/* ── Trust Item helper ── */
function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3.5">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#00dfa2]/25 bg-gradient-to-br from-[#00dfa2]/20 to-[#00dfa2]/5 text-[#00dfa2] shadow-[0_6px_16px_rgba(0,223,162,0.12)]">
        {icon}
      </div>
      <div>
        <h3 className="font-[Outfit,sans-serif] text-[0.95rem] font-bold text-white">
          {title}
        </h3>
        <p className="text-[0.8rem] leading-relaxed text-[#a0aec0]">
          {description}
        </p>
      </div>
    </div>
  );
}

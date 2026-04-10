import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { replaceAuthenticatedUser } from "@/lib/session";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/sonner";
import { OTPVerification } from "@/components/auth/OTPVerification";
import Logo from "@/components/Logo.tsx";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";

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
  password: z.string().min(1, { message: "Password is required" }),
});

export default function ICMarketLoginLight() {
  // ── State & hooks (UNCHANGED) ──
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requireOTP, setRequireOTP] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{ email: string; password: string } | null>(null);
  const navigate = useNavigate();
  const settings = useSiteSettingsStore((state) => state.settings);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  // ── OTP handler (UNCHANGED) ──
  const handleOTPVerification = async (code: string) => {
    if (!loginCredentials) return;
    try {
      const response = await axiosInstance.post("/auth/login", { ...loginCredentials, otp: code });
      toast.success("Login successful! Redirecting...");
      const { user, token } = response.data.data;
      if (user.notification_msg) {
        toast.error(user.notification_msg, { duration: 10000, position: "top-right", className: "bg-red-500 text-white border-red-600", style: { backgroundColor: "rgb(239, 68, 68)", color: "white", border: "1px solid rgb(220, 38, 38)" } });
      }
      replaceAuthenticatedUser(user, token);
      setTimeout(() => navigate("/main"), 1000);
    } catch (error) {
      console.error("OTP verification failed:", error);
      if (error instanceof AxiosError) toast.error(error.response?.data?.message || "Invalid security code");
      else toast.error("An unexpected error occurred. Please try again.");
      throw error;
    }
  };

  // ── Submit handler (UNCHANGED) ──
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      if (response.data.data.require_otp) { setRequireOTP(true); setLoginCredentials(values); toast.success("Security code sent to your email"); return; }
      toast.success("Login successful! Redirecting...");
      const { user, token } = response.data.data;
      replaceAuthenticatedUser(user, token);
      setTimeout(() => navigate("/main"), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof AxiosError) { if (error.response?.data?.message) toast.error(error.response.data.message); else if (error.message === "Network Error") toast.error("Unable to connect to the server. Please check your internet connection."); else toast.error(error.message); }
      else if (error instanceof Error) toast.error(error.message);
      else toast.error("An unexpected error occurred. Please try again.");
    } finally { setIsLoading(false); }
  }

  if (requireOTP && loginCredentials) {
    return (<div className="relative flex min-h-screen items-center justify-center bg-[#07080c] p-4"><OTPVerification email={loginCredentials.email} onVerify={handleOTPVerification} /></div>);
  }

  const inputCls = "h-12 rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-[18px] text-[0.95rem] text-[#eef2f7] placeholder:text-[#4a5468] transition-all hover:border-white/[0.18] focus-visible:border-[#00dfa2] focus-visible:shadow-[0_0_0_3px_rgba(0,223,162,0.1)] focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="flex min-h-screen flex-col bg-[#07080c] text-[#eef2f7]">
      <div className="w-full border-b border-white/[0.06] bg-[#0a0d15] px-4 py-3 text-center text-sm text-[#8b97a8]">
        Trading CFDs carries a high level of risk to your capital, and you should only trade with money you can afford to lose.
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10 md:py-16">
        <div className="grid w-full max-w-[880px] grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="order-2 flex flex-col md:order-1">
            <div className="mb-5"><Logo /></div>
            <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-[#00dfa2]/[0.02] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.4),0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-9">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/[0.03] to-transparent" />
              <div className="relative z-[2] mb-7 flex items-center justify-between border-b border-white/[0.06] pb-5">
                <h2 className="font-[Outfit,sans-serif] text-2xl font-bold text-[#eef2f7]">Log in</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00dfa2]/25 bg-gradient-to-br from-[#00dfa2]/[0.12] to-[#00b881]/[0.08] px-4 py-1.5 text-[0.78rem] font-semibold text-[#00dfa2]">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
                  Support 24/7
                </span>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-[2] flex flex-col gap-5">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">Email</FormLabel>
                      <FormControl><Input type="email" placeholder="name@example.com" {...field} className={inputCls} /></FormControl>
                      <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">Password</FormLabel>
                      <div className="relative">
                        <FormControl><Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className={inputCls + " pr-12"} /></FormControl>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4a5468] transition-colors hover:text-[#00dfa2]" aria-label={showPassword ? "Hide password" : "Show password"}>
                          {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                        </button>
                      </div>
                      <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                    </FormItem>
                  )} />
                  <div className="-mt-2 text-right">
                    <Link to="/forgot-password" className="text-[0.85rem] font-semibold text-[#00dfa2] transition-colors hover:text-[#00ffc3]">Forgot password?</Link>
                  </div>
                  <Button type="submit" className="h-12 w-full rounded-xl bg-gradient-to-br from-[#00ffc3] via-[#00dfa2] to-[#00b881] font-bold text-[0.95rem] text-black shadow-[0_4px_14px_rgba(0,223,162,0.3),inset_0_2px_0_rgba(255,255,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,223,162,0.4)] active:translate-y-0" disabled={isLoading}>
                    {isLoading ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Signing in...</span> : "Log in"}
                  </Button>
                </form>
              </Form>

              <p className="relative z-[2] mt-5 text-center text-[0.85rem] text-[#8b97a8]">
                Don&apos;t have an account? <Link to="/signup" className="font-semibold text-[#00dfa2] transition-colors hover:text-[#00ffc3]">Create Account</Link>
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c1629] to-[#080e1c] p-7 sm:p-8">
              <div className="pointer-events-none absolute -right-1/2 -top-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,223,162,0.08),transparent_70%)]" />
              <div className="relative z-[1] flex flex-col gap-6">
                <TrustItem icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} title="Fast account access" description="A smoother path back into trading with secure, quick sign-in." />
                <TrustItem icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>} title="Secure OTP flow" description="Sign in with the same OTP flow and account navigation you already trust." />
                <TrustItem icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>} title="Always by your side" description="24/7 live support with a 30-second average response time." />
              </div>
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <div className="relative z-[1]">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="text-lg drop-shadow-[0_2px_6px_rgba(200,230,78,0.3)]">🎁</span>
                  <span className="font-[Outfit,sans-serif] text-[0.88rem] font-bold leading-snug text-[#eef2f7]">Join and claim your <span className="font-extrabold text-[#c8e64e]">$5,000</span> welcome gift</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <BonusCard amount="200 USDT" description="First spot trading ≥ 20 USDT" />
                  <BonusCard amount="200 USDT" description="First deposit ≥ 20 USDT" />
                  <BonusCard amount="200 USDT" description="First futures trading ≥ 100 USDT" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {settings?.login_page_footer && (
        <div className="border-t border-white/[0.06] bg-[#0a0d15] px-5 py-4">
          <div className="mx-auto max-w-[880px] text-center text-xs leading-relaxed text-[#4a5468]">
            <p>{settings.login_page_footer}</p>
          </div>
        </div>
      )}

      <footer className="border-t border-white/[0.06] px-5 py-5">
        <div className="mx-auto flex max-w-[880px] items-center justify-center gap-7 text-sm text-[#4a5468]">
          <span>English</span><span>Cookies</span><span>Terms</span><span>Privacy</span>
        </div>
      </footer>
    </div>
  );
}

function TrustItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (<div className="flex gap-3.5"><div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#00dfa2]/25 bg-gradient-to-br from-[#00dfa2]/20 to-[#00dfa2]/5 text-[#00dfa2] shadow-[0_6px_16px_rgba(0,223,162,0.12)]">{icon}</div><div><h3 className="font-[Outfit,sans-serif] text-[0.95rem] font-bold text-white">{title}</h3><p className="text-[0.8rem] leading-relaxed text-[#a0aec0]">{description}</p></div></div>);
}

function BonusCard({ amount, description }: { amount: string; description: string }) {
  return (<div className="relative overflow-hidden rounded-xl border-[1.5px] border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-2 pb-3 pt-3.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#c8e64e]/25"><div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 rounded-t-xl bg-gradient-to-b from-white/[0.04] to-transparent" /><div className="font-[Outfit,sans-serif] text-[0.95rem] font-extrabold tracking-tight text-white">{amount}</div><div className="mt-1 text-[0.65rem] font-medium leading-snug text-[#8b97a8]">{description}</div></div>);
}

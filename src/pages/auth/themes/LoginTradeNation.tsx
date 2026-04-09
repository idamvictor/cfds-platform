import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { replaceAuthenticatedUser } from "@/lib/session";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/sonner";
import { OTPVerification } from "@/components/auth/OTPVerification";
import Logo from "@/components/Logo";
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
import { Link } from "react-router-dom";

// ── Validation (UNCHANGED) ─────────────────────────────────────────
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginTradeNation() {
  // ── State & hooks (UNCHANGED) ──
  const settings = useSiteSettingsStore((state) => state.settings);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requireOTP, setRequireOTP] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  // ── OTP handler (UNCHANGED) ──
  const handleOTPVerification = async (code: string) => {
    if (!loginCredentials) return;
    try {
      const response = await axiosInstance.post("/auth/login", {
        ...loginCredentials,
        otp: code,
      });
      toast.success("Login successful! Redirecting...");
      const { user, token } = response.data.data;
      if (user.notification_msg) {
        toast.error(user.notification_msg, {
          duration: 10000,
          position: "top-right",
          className: "bg-red-500 text-white border-red-600",
          style: { backgroundColor: "rgb(239, 68, 68)", color: "white", border: "1px solid rgb(220, 38, 38)" },
        });
      }
      replaceAuthenticatedUser(user, token);
      setTimeout(() => navigate("/main"), 1000);
    } catch (error) {
      console.error("OTP verification failed:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Invalid security code");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      throw error;
    }
  };

  // ── Submit handler (UNCHANGED) ──
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      if (response.data.data.require_otp) {
        setRequireOTP(true);
        setLoginCredentials(values);
        toast.success("Security code sent to your email");
        return;
      }
      toast.success("Login successful! Redirecting...");
      const { user, token } = response.data.data;
      replaceAuthenticatedUser(user, token);
      setTimeout(() => navigate("/main"), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) toast.error(error.response.data.message);
        else if (error.message === "Network Error") toast.error("Unable to connect to the server. Please check your internet connection.");
        else toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // ── OTP screen ──
  if (requireOTP && loginCredentials) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#07080c] p-4">
        <OTPVerification email={loginCredentials.email} onVerify={handleOTPVerification} />
      </div>
    );
  }

  const inputCls =
    "h-12 rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-[18px] text-[0.95rem] text-[#eef2f7] placeholder:text-[#4a5468] transition-all hover:border-white/[0.18] focus-visible:border-[#00dfa2] focus-visible:shadow-[0_0_0_3px_rgba(0,223,162,0.1)] focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="flex min-h-screen flex-col bg-[#07080c] text-[#eef2f7]">
      {/* Settings-driven header banner (UNCHANGED condition) */}
      {settings?.login_page_header ? (
        <div className="w-full border-b border-white/[0.06] bg-[#0a0d15] px-4 py-3 text-center text-sm text-[#8b97a8]">
          {settings.login_page_header}
        </div>
      ) : (
        <div className="w-full border-b border-white/[0.06] bg-[#0a0d15] px-4 py-3 text-center text-sm text-[#8b97a8]">
          Trading CFDs carries a high level of risk to your capital, and you should only trade with money you can afford to lose.
        </div>
      )}

      <div className="flex flex-1 items-center justify-center px-5 py-10 md:py-16">
        <div className="grid w-full max-w-[880px] grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* ══════ LEFT: Logo + Form Card ══════ */}
          <div className="order-2 flex flex-col md:order-1">
            <div className="mb-5"><Logo /></div>

            <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-[#00dfa2]/[0.02] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.4),0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-9">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/[0.03] to-transparent" />

              <div className="relative z-[2] mb-7 flex items-center justify-between border-b border-white/[0.06] pb-5">
                <h2 className="font-[Outfit,sans-serif] text-2xl font-bold text-[#eef2f7]">Welcome back</h2>
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
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-semibold text-[#00dfa2] transition-colors hover:text-[#00ffc3]">Sign up</Link>
              </p>

              <div className="relative z-[2] my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-xs font-medium uppercase tracking-wide text-[#4a5468]">or</span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <div className="relative z-[2] grid grid-cols-3 gap-2.5">
                <button type="button" disabled className="flex h-11 cursor-not-allowed items-center justify-center rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] text-[#eef2f7] opacity-60" title="Apple"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg></button>
                <button type="button" disabled className="flex h-11 cursor-not-allowed items-center justify-center rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] opacity-60" title="Google"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></button>
                <button type="button" disabled className="flex h-11 cursor-not-allowed items-center justify-center rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] opacity-60" title="Facebook"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
              </div>
            </div>
          </div>

          {/* ══════ RIGHT: Trust Panel ══════ */}
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c1629] to-[#080e1c] p-7 sm:p-8">
              <div className="pointer-events-none absolute -right-1/2 -top-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,223,162,0.08),transparent_70%)]" />
              <div className="relative z-[1] flex flex-col gap-6">
                <TrustItem icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} title="Licensed and regulated" description="An authorized financial services provider with global coverage." />
                <TrustItem icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>} title="Trusted by millions of users" description="Join our global community of traders in 150+ countries." />
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

      <footer className="border-t border-white/[0.06] px-5 py-5">
        <div className="mx-auto flex max-w-[880px] items-center justify-center gap-7 text-sm text-[#4a5468]">
          <span>English</span><span>Cookies</span><span>Terms</span><span>Privacy</span>
        </div>
      </footer>
    </div>
  );
}

function TrustItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3.5">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#00dfa2]/25 bg-gradient-to-br from-[#00dfa2]/20 to-[#00dfa2]/5 text-[#00dfa2] shadow-[0_6px_16px_rgba(0,223,162,0.12)]">{icon}</div>
      <div>
        <h3 className="font-[Outfit,sans-serif] text-[0.95rem] font-bold text-white">{title}</h3>
        <p className="text-[0.8rem] leading-relaxed text-[#a0aec0]">{description}</p>
      </div>
    </div>
  );
}

function BonusCard({ amount, description }: { amount: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border-[1.5px] border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-2 pb-3 pt-3.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#c8e64e]/25">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 rounded-t-xl bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="font-[Outfit,sans-serif] text-[0.95rem] font-extrabold tracking-tight text-white">{amount}</div>
      <div className="mt-1 text-[0.65rem] font-medium leading-snug text-[#8b97a8]">{description}</div>
    </div>
  );
}

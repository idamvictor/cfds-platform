import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { replaceAuthenticatedUser } from "@/lib/session";
import { toast } from "@/components/ui/sonner";
import { AxiosError } from "axios";
import Logo from "@/components/Logo";
import { countries } from "@/constants/countries";

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

// ── Validation (UNCHANGED) ─────────────────────────────────────────
const formSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  country: z.string().min(1, { message: "Please select a country" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// ── Password strength (purely visual) ──────────────────────────────
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", color: "#ef4444", percent: 20 };
  if (score <= 2) return { label: "Fair", color: "#FF9800", percent: 40 };
  if (score <= 3) return { label: "Good", color: "#f0b90b", percent: 60 };
  if (score <= 4) return { label: "Strong", color: "#00dfa2", percent: 80 };
  return { label: "Very Strong", color: "#00dfa2", percent: 100 };
}

export default function RegisterBasic() {
  // ── State (UNCHANGED) ──
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ── localStorage check (UNCHANGED) ──
  useEffect(() => {
    const data = localStorage.getItem("registration_data");
    if (!data) {
      toast.error("Please complete the registration process first");
      navigate("/signup");
    }
  }, [navigate]);

  // ── Parse stored data (UNCHANGED) ──
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("registration_data") ?? "{}");
    } catch {
      return {};
    }
  })();

  // ── Form (UNCHANGED) ──
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      phone: "",
      country: stored.country ?? "",
      password: stored.password ?? "",
    },
  });

  const watchedPassword = form.watch("password");

  // ── Submit handler (UNCHANGED) ──
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const raw = localStorage.getItem("registration_data");
    if (!raw) {
      toast.error("Missing registration data. Please start over.");
      navigate("/signup");
      return;
    }

    const savedData = JSON.parse(raw);

    if (!savedData.email) {
      toast.error("Missing registration data. Please start over.");
      navigate("/signup");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/register", {
        ...values,
        email: savedData.email.trim(),
        confirm_password: values.password,
        nationality: savedData.nationality ?? values.country,
        country_code: "+1",
      });

      localStorage.removeItem("registration_data");

      const { user: newUser, token: newToken } = response.data.data;
      replaceAuthenticatedUser(newUser, newToken);
      toast.success("Account created successfully! Welcome aboard.");
      navigate("/main");
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(msg);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // ── Input class constant ──
  const inputCls =
    "h-12 rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-[18px] text-[0.95rem] text-[#eef2f7] placeholder:text-[#4a5468] transition-all hover:border-white/[0.18] focus-visible:border-[#00dfa2] focus-visible:shadow-[0_0_0_3px_rgba(0,223,162,0.1)] focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="flex min-h-screen flex-col bg-[#07080c] text-[#eef2f7]">
      {/* ── Main content ── */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 md:py-16">
        <div className="grid w-full max-w-[880px] grid-cols-1 items-start gap-10 md:grid-cols-2">
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

              {/* Header */}
              <div className="relative z-[2] mb-7 border-b border-white/[0.06] pb-5">
                <h2 className="font-[Outfit,sans-serif] text-2xl font-bold text-[#eef2f7]">
                  Complete your profile
                </h2>
                {stored.email ? (
                  <p className="mt-2 text-sm text-[#8b97a8]">
                    Completing registration for{" "}
                    <span className="font-semibold text-[#eef2f7]">
                      {stored.email}
                    </span>
                  </p>
                ) : null}
              </div>

              {/* Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="relative z-[2] space-y-4"
                >
                  {/* Name row */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                            First name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="First name"
                              {...field}
                              className={inputCls}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                            Last name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last name"
                              {...field}
                              className={inputCls}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Choose a username"
                            {...field}
                            className={inputCls}
                          />
                        </FormControl>
                        <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                          Phone number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone number"
                            {...field}
                            className={inputCls}
                          />
                        </FormControl>
                        <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                          Country
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-[14px] border-[1.5px] border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-[18px] text-[#eef2f7] transition-all hover:border-white/[0.18] focus:border-[#00dfa2] focus:shadow-[0_0_0_3px_rgba(0,223,162,0.1)] focus:ring-0 focus:ring-offset-0">
                              <SelectValue placeholder="Select your country">
                                {field.value &&
                                  (() => {
                                    const country = countries.find(
                                      (item) => item.value === field.value,
                                    );
                                    return country ? (
                                      <span className="flex items-center gap-2">
                                        <span>{country.flag}</span>
                                        <span>{country.label}</span>
                                      </span>
                                    ) : null;
                                  })()}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 border-white/[0.1] bg-[#0f1220] text-[#eef2f7]">
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                <span className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[0.8rem] font-semibold uppercase tracking-wide text-[#8b97a8]">
                          Password
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Min. 8 characters"
                              {...field}
                              className={inputCls + " pr-12"}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4a5468] transition-colors hover:text-[#00dfa2]"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-[18px] w-[18px]" />
                            ) : (
                              <Eye className="h-[18px] w-[18px]" />
                            )}
                          </button>
                        </div>
                        {/* Password strength indicator (purely visual) */}
                        {watchedPassword && (
                          <div className="mt-1.5 space-y-1">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${getPasswordStrength(watchedPassword).percent}%`,
                                  backgroundColor: getPasswordStrength(watchedPassword).color,
                                }}
                              />
                            </div>
                            <p
                              className="text-[10px] font-semibold"
                              style={{ color: getPasswordStrength(watchedPassword).color }}
                            >
                              {getPasswordStrength(watchedPassword).label}
                            </p>
                          </div>
                        )}
                        <FormMessage className="text-[11px] font-semibold text-[#ef4444]" />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="mt-2 h-12 w-full rounded-xl bg-gradient-to-br from-[#00ffc3] via-[#00dfa2] to-[#00b881] font-bold text-[0.95rem] text-black shadow-[0_4px_14px_rgba(0,223,162,0.3),inset_0_2px_0_rgba(255,255,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,223,162,0.4)] active:translate-y-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>

              {/* Login link */}
              <p className="relative z-[2] mt-5 text-center text-[0.85rem] text-[#8b97a8]">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="font-semibold text-[#00dfa2] transition-colors hover:text-[#00ffc3]"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* ══════ RIGHT: Trust Panel ══════ */}
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c1629] to-[#080e1c] p-7 sm:p-8">
              <div className="pointer-events-none absolute -right-1/2 -top-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,223,162,0.08),transparent_70%)]" />

              <div className="relative z-[1] flex flex-col gap-6">
                <TrustItem
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M8 21h8M12 17v4M7 4h10l1 4-2 2v3a4 4 0 0 1-8 0v-3L6 8l1-4Z" />
                    </svg>
                  }
                  title="Trade in minutes"
                  description="Finish your profile and get full trading access right away."
                />
                <TrustItem
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  }
                  title="Your data is carried over"
                  description="Email and signup details are already saved from the previous step."
                />
                <TrustItem
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  }
                  title="Licensed and regulated"
                  description="An authorized financial services provider with global coverage."
                />
              </div>

              {/* Separator */}
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

              {/* Welcome bonus */}
              <div className="relative z-[1]">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="text-lg drop-shadow-[0_2px_6px_rgba(200,230,78,0.3)]">🎁</span>
                  <span className="font-[Outfit,sans-serif] text-[0.88rem] font-bold leading-snug text-[#eef2f7]">
                    Join and claim your{" "}
                    <span className="font-extrabold text-[#c8e64e]">$5,000</span>{" "}
                    welcome gift
                  </span>
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

/* ── Presentational helpers ── */

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

function BonusCard({
  amount,
  description,
}: {
  amount: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border-[1.5px] border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-2 pb-3 pt-3.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#c8e64e]/25 hover:bg-gradient-to-br hover:from-[#c8e64e]/[0.08] hover:to-[#c8e64e]/[0.02]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 rounded-t-xl bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="font-[Outfit,sans-serif] text-[0.95rem] font-extrabold tracking-tight text-white">
        {amount}
      </div>
      <div className="mt-1 text-[0.65rem] font-medium leading-snug text-[#8b97a8]">
        {description}
      </div>
    </div>
  );
}

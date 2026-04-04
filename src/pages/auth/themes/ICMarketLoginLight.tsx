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
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function ICMarketLoginLight() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requireOTP, setRequireOTP] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const navigate = useNavigate();

  const settings = useSiteSettingsStore((state) => state.settings);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
          style: {
            backgroundColor: "rgb(239, 68, 68)",
            color: "white",
            border: "1px solid rgb(220, 38, 38)",
          },
        });
      }

      replaceAuthenticatedUser(user, token);

      setTimeout(() => {
        navigate("/main");
      }, 1000);
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

      setTimeout(() => {
        navigate("/main");
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);

      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message === "Network Error") {
          toast.error(
            "Unable to connect to the server. Please check your internet connection.",
          );
        } else {
          toast.error(error.message);
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (requireOTP && loginCredentials) {
    return (
      <div className="min-h-screen bg-[#181A20] flex items-center justify-center p-4">
        <OTPVerification
          email={loginCredentials.email}
          onVerify={handleOTPVerification}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181A20] flex flex-col text-white">
      <div className="w-full border-b border-white/10 bg-[#1E2329] px-4 py-3 text-center text-sm text-white/70">
        Trading CFDs carries a high level of risk to your capital, and you
        should only trade with money you can afford to lose.
      </div>

      <div className="w-full px-4 py-5 md:px-8 md:py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="hidden md:block">
            <Logo />
          </div>
          <div className="ml-auto">
            <Button
              variant="ghost"
              className="h-auto rounded-full border border-white/10 bg-transparent px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white"
            >
              <svg className="w-5 h-5 mr-2 md:hidden" viewBox="0 0 36 36">
                <rect fill="#00247D" width="36" height="27" />
                <path
                  d="M0,0 L36,27 M36,0 L0,27"
                  stroke="#fff"
                  strokeWidth="5.4"
                />
                <path
                  d="M0,0 L36,27 M36,0 L0,27"
                  stroke="#cf142b"
                  strokeWidth="3.6"
                />
                <path d="M18,0 V27 M0,13.5 H36" stroke="#fff" strokeWidth="9" />
                <path
                  d="M18,0 V27 M0,13.5 H36"
                  stroke="#cf142b"
                  strokeWidth="5.4"
                />
              </svg>
              <svg
                className="w-5 h-5 mr-2 hidden md:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              EN
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 md:px-8 md:pb-12">
        <div className="mx-auto gap-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
          <div className="order-2 md:order-1 w-full max-w-md mx-auto md:flex-1">
            <div className="mb-6 flex justify-center items-center gap-3 md:mb-8">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F0B90B] text-[#181A20] shadow-[0_0_24px_rgba(240,185,11,0.25)]">
                <Logo />
              </div>
              <div className="text-sm text-white/65">
                <span className="font-semibold text-white">Trade Nation</span>
                <span className="ml-1 hidden sm:inline">secure login</span>
              </div>
            </div>

            <h1 className="max-w-md text-center text-2xl sm:text-3xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-4xl">
              <span className="text-[#F0B90B]">Log In</span> to your account
              here
            </h1>

            <p className="text-center mt-4 max-w-md text-base leading-7 text-white/65 md:text-lg">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-[#F0B90B] transition hover:text-[#ffd24d]"
              >
                Sign Up
              </Link>
            </p>

            <div className="flex justify-center">
              <div className="relative mx-auto my-10 flex h-[240px] w-[240px] items-center justify-center md:mx-0 md:my-14 md:h-[280px] md:w-[280px]">
                <div className="absolute inset-x-10 bottom-8 h-24 rounded-sm border-2 border-[#F0B90B]/80 bg-transparent" />
                <div className="absolute bottom-20 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(240,185,11,0.95)_0%,_rgba(240,185,11,0.55)_45%,_rgba(240,185,11,0.05)_72%,_transparent_100%)] blur-[1px]" />
                <div className="absolute bottom-[6.15rem] left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#F0B90B] text-5xl font-black text-[#181A20] shadow-[0_0_30px_rgba(240,185,11,0.28)]">
                  $
                </div>
                <div className="absolute left-[3.65rem] top-[3.5rem] h-14 w-14 rotate-[-30deg] rounded-full border-2 border-[#F0B90B]" />
                <div className="absolute right-[3.65rem] top-[4.75rem] h-5 w-5 rounded-full border-2 border-[#F0B90B] border-l-transparent border-b-transparent rotate-[32deg]" />
                <div className="absolute right-[2.9rem] top-[7.55rem] h-5 w-5 rounded-full border-2 border-[#F0B90B] border-l-transparent border-b-transparent rotate-[32deg]" />
                <div className="absolute top-[4.7rem] h-12 w-[110px] rotate-[-32deg] border-2 border-[#F0B90B] bg-transparent" />
                <div className="absolute top-[4.25rem] h-14 w-8 rotate-[-32deg] bg-[linear-gradient(180deg,rgba(240,185,11,0.92),rgba(168,112,0,0.88))] shadow-[0_0_18px_rgba(240,185,11,0.25)]" />
              </div>
            </div>

            <div className="space-y-7 text-sm text-white/80">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <svg
                    className="h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M8 21h8M12 17v4M7 4h10l1 4-2 2v3a4 4 0 0 1-8 0v-3L6 8l1-4Z" />
                  </svg>
                </div>
                <div className="pt-1">
                  Fast account access and a smoother path back into trading.
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <svg
                    className="h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div className="pt-1">
                  Secure sign-in with the same OTP flow and account navigation
                  you already have.
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 w-full md:max-w-[400px] lg:pt-10 max-w-[400px] mx-auto md:flex-shrink-0">
            <div className="rounded-[28px] border border-white/10 bg-[#181A20] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:px-8 sm:py-9">
              <div className="mb-4">
                <div className="mb-3 inline-flex items-center gap-2 text-[#F0B90B]">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="h-2 w-2 rotate-45 bg-current" />
                    <span className="h-2 w-2 rotate-45 bg-current opacity-80" />
                    <span className="h-2 w-2 rotate-45 bg-current opacity-80" />
                    <span className="h-2 w-2 rotate-45 bg-current" />
                  </div>
                  <span className="text-sm font-semibold tracking-[0.12em]">
                    TRADE NATION
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-[-0.03em] text-white">
                  Welcome back
                </h2>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Email address*"
                            {...field}
                            className="h-10 rounded-lg border-white/15 bg-[#1E2329] px-4 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password*"
                              {...field}
                              className="h-10 rounded-lg border-white/15 bg-[#1E2329] px-4 pr-11 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-0.5 text-left">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-white/65 transition hover:text-[#F0B90B]"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="mt-2 h-11 w-full rounded-xl bg-[#F0B90B] font-semibold text-[#181A20] transition hover:bg-[#f5c842] flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        LOGGING IN...
                      </div>
                    ) : (
                      <>
                        LOGIN
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-7 text-center text-sm text-white/60">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#F0B90B] transition hover:text-[#ffd24d]"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 hidden w-full max-w-6xl items-center justify-center gap-7 px-4 text-sm text-white/40 md:flex">
        <span>English</span>
        <span>Cookies</span>
        <span>Terms</span>
        <span>Privacy</span>
      </div>

      {settings?.login_page_footer ? (
        <div className="mt-4 px-4 pb-4 text-white/40 text-xs max-w-5xl text-center self-center">
          <p>{settings?.login_page_footer}</p>
        </div>
      ) : (
        <div className="mt-4 px-4 pb-4 text-white/40 text-xs max-w-5xl text-center self-center">
          <p>
            Risk warning: Trading Derivatives carries a high level of risk to
            your capital and you should only trade with money you can afford to
            lose. Trading Derivatives may not be suitable for all investors, so
            please ensure that you fully understand the risks involved and seek
            independent advice if necessary. Raw Spread accounts offer spreads
            from 0.0 pips with a commission charge of USD $3.50 per 100k
            traded. Standard account offers spreads from 0.8 pips with no
            additional commission charges. Spreads on CFD indices start at 0.4
            points.
          </p>
        </div>
      )}
    </div>
  );
}

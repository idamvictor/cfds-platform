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
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginTradeNation() {
  const settings = useSiteSettingsStore((state) => state.settings);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requireOTP, setRequireOTP] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const navigate = useNavigate();

  // Initialize form
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

  // Form submission handler
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

      // Show success message
      toast.success("Login successful! Redirecting...");

      // Store the user object and token in Zustand store
      const { user, token } = response.data.data;
      replaceAuthenticatedUser(user, token);

      // Short delay before redirect to show the success message
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
    <div className="min-h-screen bg-[#181A20] text-white flex flex-col">
      {settings?.login_page_header ? (
        <div className="w-full border-b border-white/10 bg-[#1E2329] px-4 py-3 text-center text-sm text-white/70">
          {settings?.login_page_header}
        </div>
      ) : (
        <div className="w-full border-b border-white/10 bg-[#1E2329] px-4 py-3 text-center text-sm text-white/70">
          Trading CFDs carries a high level of risk to your capital, and you
          should only trade with money you can afford to lose.
        </div>
      )}

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
          {/* Left side - Form */}

          <div className="order-2 md:order-1 w-full max-w-md mx-auto md:flex-1">
            <div className="mb-6 flex justify-center items-center gap-3 md:mb-8">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F0B90B] text-[#181A20] shadow-[0_0_24px_rgba(240,185,11,0.35)]">
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
                <div className="absolute inset-x-10 bottom-8 h-24 rounded-sm border-2 border-[#F0B90B]/90 bg-transparent" />
                <div className="absolute bottom-20 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(240,185,11,0.95)_0%,_rgba(240,185,11,0.72)_45%,_rgba(240,185,11,0.05)_72%,_transparent_100%)] blur-[1px]" />
                <div className="absolute bottom-[6.15rem] left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#F0B90B] text-5xl font-black text-[#181A20] shadow-[0_0_36px_rgba(240,185,11,0.35)]">
                  $
                </div>
                <div className="absolute left-[3.65rem] top-[3.5rem] h-14 w-14 rotate-[-30deg] rounded-full border-2 border-[#F0B90B]" />
                <div className="absolute right-[3.65rem] top-[4.75rem] h-5 w-5 rounded-full border-2 border-[#F0B90B] border-l-transparent border-b-transparent rotate-[32deg]" />
                <div className="absolute right-[2.9rem] top-[7.55rem] h-5 w-5 rounded-full border-2 border-[#F0B90B] border-l-transparent border-b-transparent rotate-[32deg]" />
                <div className="absolute top-[4.7rem] h-12 w-[110px] rotate-[-32deg] border-2 border-[#F0B90B] bg-transparent" />
                <div className="absolute top-[4.25rem] h-14 w-8 rotate-[-32deg] bg-[linear-gradient(180deg,rgba(240,185,11,0.95),rgba(168,112,0,0.92))] shadow-[0_0_18px_rgba(240,185,11,0.4)]" />
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
                <div className="pt-1">Ready to trade with the G.O.A.T?</div>
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
                  <span>Excellent </span>
                  <span className="inline-flex items-center rounded bg-[#00B67A] px-2 py-1 text-xs font-semibold text-white">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-3.5 w-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                      </svg>
                    ))}
                  </span>
                  <span className="ml-2">1,196 reviews on </span>
                  <span className="font-medium text-[#00B67A]">Trustpilot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}

          <div className="order-1 md:order-2 w-full md:max-w-[400px] max-w-[400px] mx-auto md:flex-shrink-0">
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
                  className="space-y-3"
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
                            className="h-8 rounded-lg border-white/15 bg-[#1E2329] px-4 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-0"
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
                              className="h-8 rounded-lg border-white/15 bg-[#1E2329] px-4 pr-11 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-0"
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
                      to="/forgot/password"
                      className="text-sm text-white/65 transition hover:text-[#F0B90B] md:hidden"
                    >
                      Forgot Password
                    </Link>
                    <Link
                      to="/"
                      className="hidden text-sm text-white/65 transition hover:text-[#F0B90B] md:inline"
                    >
                      Forgot Password
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="mt-2 h-9 w-full rounded-xl bg-[#F0B90B] font-semibold text-[#181A20] transition hover:bg-[#f5c842] flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        Log In
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

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-sm font-medium text-white/45">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="space-y-2.5">
                <Button
                  variant="outline"
                  className="h-8 w-full justify-start rounded-lg border-white/15 bg-transparent px-4 text-white hover:bg-white/[0.03] hover:text-white"
                  onClick={() => {
                    /* Add Google login logic */
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
                    />
                  </svg>
                  <span className="ml-3">Sign up with Google</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-8 w-full justify-start rounded-lg border-white/15 bg-transparent px-4 text-white hover:bg-white/[0.03] hover:text-white"
                  onClick={() => {
                    /* Add Apple login logic */
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M17.569 12.787c-.043-3.401 2.777-5.036 2.903-5.114-1.583-2.314-4.042-2.629-4.914-2.665-2.079-.216-4.079 1.242-5.139 1.242-1.077 0-2.714-1.215-4.468-1.181-2.277.034-4.389 1.345-5.562 3.398-2.396 4.158-.612 10.293 1.69 13.661 1.145 1.652 2.492 3.5 4.26 3.433 1.724-.069 2.371-1.103 4.452-1.103 2.063 0 2.662 1.103 4.452 1.066 1.845-.03 3.014-1.664 4.129-3.327 1.319-1.907 1.854-3.765 1.875-3.861-.041-.016-3.576-1.374-3.62-5.438v-.111l-.009.003Zm-3.334-9.983c.932-1.162 1.565-2.745 1.393-4.355-1.344.055-3.011.916-3.981 2.056-.859 1.002-1.623 2.645-1.423 4.193 1.51.115 3.061-.764 4.011-1.894Z" />
                  </svg>
                  <span className="ml-3">Sign up with Apple</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-8 w-full justify-start rounded-lg border-white/15 bg-transparent px-4 text-white hover:bg-white/[0.03] hover:text-white"
                  onClick={() => {
                    /* Add LinkedIn login logic */
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="#0A66C2"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="ml-3">Sign up with LinkedIn</span>
                </Button>
              </div>

              <div className="mt-7 text-center text-sm text-white/60">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#F0B90B] transition hover:text-[#ffd24d]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 hidden w-full max-w-6xl items-center justify-center gap-7 text-sm text-white/40 md:flex">
          <span>English</span>
          <span>Cookies</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </div>
  );
}

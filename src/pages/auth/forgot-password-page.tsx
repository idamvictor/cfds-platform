import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
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
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";

// Define the form schema with validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing auth and redirect if found
  useEffect(() => {
    if (user && token) {
      navigate("/main");
    }
  }, [user, token, navigate]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
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
    <div className="min-h-screen bg-[#181A20] text-white flex flex-col">
      <div className="w-full border-b border-white/10 bg-[#1E2329] px-4 py-3 text-center text-sm text-white/70">
        Trading CFDs carries a high level of risk to your capital, and you
        should only trade with money you can afford to lose.
      </div>

      <div className="w-full px-4 py-5 md:px-8 md:py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="hidden md:block">
            <Logo />
          </div>
          <Link
            to="/"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 md:px-8 md:pb-12">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          <div className="order-2 w-full max-w-md mx-auto md:order-1 md:flex-1">
            <div className="mb-6 flex items-center justify-center gap-3 md:mb-8">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F0B90B] text-[#181A20] shadow-[0_0_24px_rgba(240,185,11,0.35)]">
                <Logo />
              </div>
              <div className="text-sm text-white/65">
                <span className="font-semibold text-white">Trade Nation</span>
              </div>
            </div>

            <h1 className="max-w-md text-center text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
              Lost your <span className="text-[#F0B90B]">password?</span>
            </h1>

            <p className="mt-4 max-w-md text-center text-base leading-7 text-white/65 md:text-lg">
              No stress, it happens to the best of us! Just drop in the email
              you signed up with, and we'll shoot you a reset link to get you
              back in action.
            </p>

            <div className="flex justify-center">
              <div className="relative mx-auto my-10 flex h-[240px] w-[240px] items-center justify-center md:mx-0 md:my-14 md:h-[280px] md:w-[280px]">
                <div className="absolute inset-x-10 bottom-8 h-24 rounded-sm border-2 border-[#F0B90B]/90 bg-transparent" />
                <div className="absolute bottom-20 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(240,185,11,0.95)_0%,_rgba(240,185,11,0.72)_45%,_rgba(240,185,11,0.05)_72%,_transparent_100%)] blur-[1px]" />
                <div className="absolute bottom-[6.15rem] left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#F0B90B] shadow-[0_0_36px_rgba(240,185,11,0.35)]">
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#181A20"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="absolute left-[3.65rem] top-[3.5rem] h-14 w-14 rotate-[-30deg] rounded-full border-2 border-[#F0B90B]" />
                <div className="absolute right-[3.65rem] top-[4.75rem] h-5 w-5 rounded-full border-2 border-[#F0B90B] border-l-transparent border-b-transparent rotate-[32deg]" />
                <div className="absolute right-[2.9rem] top-[7.55rem] h-5 w-5 rounded-full border-2 border-[#F0B90B] border-l-transparent border-b-transparent rotate-[32deg]" />
                <div className="absolute top-[4.7rem] h-12 w-[110px] rotate-[-32deg] border-2 border-[#F0B90B] bg-transparent" />
                <div className="absolute top-[4.25rem] h-14 w-8 rotate-[-32deg] bg-[linear-gradient(180deg,rgba(240,185,11,0.95),rgba(168,112,0,0.92))] shadow-[0_0_18px_rgba(240,185,11,0.4)]" />
              </div>
            </div>

          </div>

          <div className="order-1 w-full max-w-[400px] mx-auto md:order-2 md:max-w-[400px] md:flex-shrink-0">
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
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-white md:text-2xl">
                  Reset password
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
                            type="email"
                            placeholder="name@example.com"
                            {...field}
                            className="h-8 rounded-lg border-white/15 bg-[#1E2329] px-4 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => navigate("/")}
                      className="h-9 min-w-[96px] rounded-xl border border-white/10 bg-transparent px-4 text-white/70 transition hover:bg-white/[0.03] hover:text-white"
                    >
                      Back
                    </Button>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-9 min-w-[128px] rounded-xl bg-[#F0B90B] px-4 font-semibold text-[#181A20] transition hover:bg-[#f5c842] flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Sending...
                        </div>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-sm font-medium text-white/45">info</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="space-y-2.5">
                <div className="rounded-lg border border-white/10 bg-[#1E2329] px-4 py-3 text-sm leading-6 text-white/65">
                  If you registered through SSO (Google, Apple, or LinkedIn),
                  we are unable to modify your password. Please utilise the
                  reset password feature on your chosen platform.
                </div>
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

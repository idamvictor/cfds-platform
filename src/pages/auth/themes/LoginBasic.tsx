import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { replaceAuthenticatedUser } from "@/lib/session";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/sonner";
import { OTPVerification } from "@/components/auth/OTPVerification";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AnimatedBackground from "@/pages/auth/animated-background";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginBasic() {
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
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <AnimatedBackground />
        <OTPVerification
          email={loginCredentials.email}
          onVerify={handleOTPVerification}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      <Card className="relative z-10 w-full max-w-[400px] rounded-[28px] border border-white/10 bg-[#181A20]/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-md">
        <CardHeader className="space-y-0 px-6 pb-4 pt-7 sm:px-8 sm:pt-8">
          <div className="mb-3 inline-flex items-center gap-2 text-[#F0B90B]">
            <div className="grid grid-cols-2 gap-1">
              <span className="h-2 w-2 rotate-45 bg-current" />
              <span className="h-2 w-2 rotate-45 bg-current opacity-80" />
              <span className="h-2 w-2 rotate-45 bg-current opacity-80" />
              <span className="h-2 w-2 rotate-45 bg-current" />
            </div>
            <span className="text-sm font-semibold tracking-[0.12em]">
              TRADE ROOM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0B90B] text-[#181A20] shadow-[0_0_24px_rgba(240,185,11,0.35)]">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-[-0.03em] text-white md:text-2xl">
                Welcome back
              </h1>
              <p className="text-sm text-white/60">
                Sign in to continue to your traderoom
              </p>
            </div>
          </div>

          <div className="pt-5 text-left">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              Account Snapshot
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#F0B90B]">
              $ 402.54
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-0 pt-2 sm:px-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white/80">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
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
                    <FormLabel className="text-sm font-medium text-white/80">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
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

              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-xl bg-[#F0B90B] font-semibold text-[#181A20] transition hover:bg-[#f5c842]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 px-6 pb-7 pt-6 sm:px-8 sm:pb-8">
          <div className="flex items-center justify-center space-x-2 border-t border-white/10 pt-5 text-sm text-white/60">
            <span>Forgot Password?</span>
            <Link
              to="/forgot-password"
              className="font-medium text-[#F0B90B] transition hover:text-[#ffd24d]"
            >
              Restore
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
            <span>Don&apos;t have an account?</span>
            <Link
              to="/register"
              className="font-medium text-[#F0B90B] transition hover:text-[#ffd24d]"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

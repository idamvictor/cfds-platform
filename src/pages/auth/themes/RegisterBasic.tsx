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
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function RegisterBasic() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("registration_data");
    if (!data) {
      toast.error("Please complete the registration process first");
      navigate("/signup");
    }
  }, [navigate]);

  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("registration_data") ?? "{}");
    } catch {
      return {};
    }
  })();

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
          <div className="ml-auto">
            <Button
              variant="ghost"
              className="h-auto rounded-full border border-white/10 bg-transparent px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white"
            >
              <svg className="mr-2 h-5 w-5 md:hidden" viewBox="0 0 36 36">
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
                className="mr-2 hidden h-5 w-5 md:block"
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
                className="ml-1 h-4 w-4"
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
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          <div className="order-2 mx-auto w-full max-w-md md:order-1 md:flex-1">
            <div className="mb-6 flex items-center justify-center gap-3 md:mb-8">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F0B90B] text-[#181A20] shadow-[0_0_24px_rgba(240,185,11,0.35)]">
                <Logo />
              </div>
              <div className="text-sm text-white/65">
                <span className="font-semibold text-white">Trade Nation</span>
                <span className="ml-1 hidden sm:inline">
                  complete registration
                </span>
              </div>
            </div>

            <h1 className="max-w-md text-center text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
              <span className="text-[#F0B90B]">Create</span> your account here
            </h1>

            <p className="mt-4 max-w-md text-center text-base leading-7 text-white/65 md:text-lg">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium text-[#F0B90B] transition hover:text-[#ffd24d]"
              >
                Log In
              </Link>
            </p>

            <div className="flex justify-center">
              <div className="relative mx-auto my-10 flex h-[240px] w-[240px] items-center justify-center md:mx-0 md:mb-14 md:h-[280px] md:w-[280px]">
                <div className="absolute inset-x-10 bottom-8 h-24 rounded-sm border-2 border-[#F0B90B]/90 bg-transparent" />
                <div className="absolute bottom-20 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(240,185,11,0.95)_0%,_rgba(240,185,11,0.72)_45%,_rgba(240,185,11,0.05)_72%,_transparent_100%)] blur-[1px]" />
                <div className="absolute bottom-[6.15rem] left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#F0B90B] text-5xl font-black text-[#181A20] shadow-[0_0_36px_rgba(240,185,11,0.35)]">
                  $
                </div>
                <div className="absolute left-[3.65rem] top-[3.5rem] h-14 w-14 rotate-[-30deg] rounded-full border-2 border-[#F0B90B]" />
                <div className="absolute right-[3.65rem] top-[4.75rem] h-5 w-5 rotate-[32deg] rounded-full border-2 border-[#F0B90B] border-b-transparent border-l-transparent" />
                <div className="absolute right-[2.9rem] top-[7.55rem] h-5 w-5 rotate-[32deg] rounded-full border-2 border-[#F0B90B] border-b-transparent border-l-transparent" />
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
                <div className="pt-1">
                  Finish your profile and get trading access in minutes.
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
                  Your email and saved signup details are already carried into
                  this final step.
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[400px] md:order-2 md:max-w-[400px] md:flex-shrink-0">
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
                  Complete your profile
                </h2>
                {stored.email ? (
                  <p className="mt-2 text-sm text-white/60">
                    Completing registration for{" "}
                    <span className="font-medium text-white">
                      {stored.email}
                    </span>
                  </p>
                ) : null}
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="First name*"
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
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Last name*"
                              {...field}
                              className="h-8 rounded-lg border-white/15 bg-[#1E2329] px-4 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-[#F0B90B] focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Username*"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Phone number*"
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
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 rounded-lg border-white/15 bg-[#1E2329] px-4 text-white focus:ring-1 focus:ring-[#F0B90B] focus:ring-offset-0">
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
                          <SelectContent className="max-h-60 border-white/15 bg-[#1E2329] text-white">
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

                  <Button
                    type="submit"
                    className="mt-2 flex h-9 w-full items-center justify-center rounded-xl bg-[#F0B90B] font-semibold text-[#181A20] transition hover:bg-[#f5c842]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                      </div>
                    ) : (
                      <>
                        Create Account
                        <svg
                          className="ml-2 h-5 w-5"
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
                Already have an account?{" "}
                <Link
                  to="/"
                  className="font-medium text-[#F0B90B] transition hover:text-[#ffd24d]"
                >
                  Login
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

import { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { replaceAuthenticatedUser } from "@/lib/session";
import { toast } from "@/components/ui/sonner";
import { AxiosError } from "axios";
import Logo from "@/components/Logo";
import { countries } from "@/constants/countries";
import countriesData from "@/config/countries.json";

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

const formSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    last_name: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    country_code: z.string().min(1, { message: "Country code is required" }),
    phone: z
      .string()
      .min(6, { message: "Phone number must be at least 6 digits" })
      .max(15, { message: "Phone number must not exceed 15 digits" })
      .regex(/^[0-9\s\-\\(\\)]+$/, {
        message:
          "Phone number can only contain digits, spaces, dashes, and parentheses",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const inputClass =
  "!bg-white !text-gray-900 border-gray-200 placeholder:text-gray-400 rounded-lg py-6 px-4 focus-visible:ring-gray-300 focus-visible:border-gray-400";
const readonlyClass =
  "!bg-gray-50 !text-gray-500 border-gray-200 rounded-lg py-6 px-4 cursor-default focus-visible:ring-0 focus-visible:border-gray-200";

export default function RegisterTDPage() {
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

  const countryEntry = countries.find((c) => c.value === stored.country);
  const countryData = countriesData.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === stored.country,
  );
  const dialCode = countryData?.dial_code ?? "+1";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      country_code: dialCode,
      phone: "",
      password: stored.password ?? "",
      confirm_password: stored.password ?? "",
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
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username,
        phone: values.country_code + values.phone.replace(/\s/g, ""),
        password: values.password,
        email: savedData.email.trim(),
        confirm_password: values.password,
        country: savedData.country ?? "",
        nationality: savedData.nationality ?? savedData.country ?? "",
        country_code: values.country_code,
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

  const nationalityEntry = countries.find(
    (c) => c.value === stored.nationality,
  );
  const showNationality =
    nationalityEntry && nationalityEntry.value !== countryEntry?.value;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Risk warning */}
      <div className="w-full bg-[#0C1E32] text-white/80 py-4 px-4 text-center text-sm">
        Trading CFDs carries a high level of risk to your capital, and you
        should only trade with money you can afford to lose.
      </div>

      {/* Header */}
      <div className="w-full border-t border-t-gray-700 bg-[#0C1E32] px-4 md:px-8 py-3 flex justify-between items-center">
        <Logo />
        <Button variant="ghost" className="text-white hover:bg-white/10">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 36 36">
            <rect fill="#00247D" width="36" height="27" />
            <path d="M0,0 L36,27 M36,0 L0,27" stroke="#fff" strokeWidth="5.4" />
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
          EN
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white flex flex-col items-center px-4 py-8">
        {/* Progress indicator */}
        <div className="w-full max-w-xl mb-12">
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="h-2 w-40 bg-[#FF5B22] rounded-full"></div>
              <span className="text-gray-800 text-sm">Set Up</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-2 w-40 bg-[#FF5B22] rounded-full"></div>
              <span className="text-gray-800 text-sm">Personal Details</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-2 w-40 bg-gray-200 rounded-full"></div>
              <span className="text-gray-400 text-sm">ID Check</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Almost there!
          </h1>
          <p className="text-gray-600 mb-8">
            Complete your profile to finish creating your account.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Editable fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          {...field}
                          className={inputClass}
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
                      <FormLabel className="text-gray-700 text-sm">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Readonly: Email */}
              <div>
                <label className="text-gray-700 text-sm mb-2 block">
                  Email
                </label>
                <Input
                  value={stored.email ?? ""}
                  readOnly
                  tabIndex={-1}
                  className={readonlyClass}
                />
              </div>

              {/* Readonly: Country */}
              {countryEntry && (
                <div>
                  <label className="text-gray-700 text-sm mb-2 block">
                    Country of Residence
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg py-6 px-4 cursor-default">
                    <ReactCountryFlag
                      countryCode={countryEntry.code}
                      svg
                      style={{ fontSize: "1.5em" }}
                    />
                    <span>{countryEntry.label}</span>
                  </div>
                </div>
              )}

              {/* Readonly: Nationality (only if different from country) */}
              {showNationality && (
                <div>
                  <label className="text-gray-700 text-sm mb-2 block">
                    Nationality
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg py-6 px-4 cursor-default">
                    <ReactCountryFlag
                      countryCode={nationalityEntry!.code}
                      svg
                      style={{ fontSize: "1.5em" }}
                    />
                    <span>{nationalityEntry!.label}</span>
                  </div>
                </div>
              )}

              <hr className="border-gray-100 my-2" />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choose a username"
                        {...field}
                        className={inputClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="text-gray-700 text-sm">
                  Phone Number
                </FormLabel>
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="country_code"
                    render={({ field }) => {
                      const selectedCountry = countriesData.find(
                        (c) => c.dial_code === field.value,
                      );
                      return (
                        <FormItem className="flex-shrink-0">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-32 !bg-white !text-gray-900 border-gray-200 rounded-lg py-6 px-4 focus:ring-gray-300 focus:border-gray-400">
                                <SelectValue>
                                  {selectedCountry ? (
                                    <div className="flex items-center gap-1">
                                      <ReactCountryFlag
                                        countryCode={selectedCountry.code}
                                        svg
                                        style={{ fontSize: "1.5em" }}
                                      />
                                      <span>{selectedCountry.dial_code}</span>
                                    </div>
                                  ) : (
                                    "Select code"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countriesData.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.dial_code}
                                >
                                  <div className="flex items-center gap-2">
                                    <ReactCountryFlag
                                      countryCode={country.code}
                                      svg
                                      style={{ fontSize: "1.5em" }}
                                    />
                                    <span>
                                      {country.name} {country.dial_code}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Phone number"
                            type="tel"
                            {...field}
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          className={`${inputClass} pr-10`}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm">
                      Confirm Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...field}
                          className={`${inputClass} pr-10`}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                disabled={isLoading}
                className="w-full bg-[#0A1A2A] hover:bg-[#0A1A2A]/90 text-white rounded-full py-6 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating account...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

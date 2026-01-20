import { useState } from "react";
import { Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import Logo from "@/components/Logo";
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
import {countries, countryCodeMap} from "@/constants/countries.ts";
import {AxiosError} from "axios";
import {OTPVerification} from "@/components/auth/OTPVerification.tsx";
import useUserStore from "@/store/userStore.ts";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

interface EmailCheckResponse {
    success: boolean;
    message: string;
    data?: {
        available: boolean;
        country?: string;
    };
}

export default function LoginRegisterTradeNation() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginLoading, setLoginLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(true);
    const [requireOTP, setRequireOTP] = useState(false);
    const navigate = useNavigate();

    const setUser = useUserStore((state) => state.setUser);

    const [loginCredentials, setLoginCredentials] = useState<{
        email: string;
        password: string;
    } | null>(null);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    const checkEmail = async (email: string): Promise<EmailCheckResponse> => {
        try {
            const response = await axiosInstance.post('/auth/check-email', { email });
            return response.data;
        } catch (error: any) {
            console.error("Email check failed:", error);

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error("Failed to check email availability");
        }
    };

    const findCountryByCode = (code: string) => {
        const countryValue = countryCodeMap[code.toUpperCase()];
        return countries.find(c => c.value === countryValue);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // First, check if email is available
            const emailCheckResult = await checkEmail(values.email);

            if (!emailCheckResult.success || !emailCheckResult.data?.available) {
                toast.error(emailCheckResult.message || "Email is already registered");
                return;
            }

            const detectedCountry = emailCheckResult.data.country || 'US';

            const countryObj = findCountryByCode(detectedCountry);

            const country = countryObj?.value ?? 'united_states'

            // Save registration data to localStorage
            const registrationData = {
                email: values.email,
                password: values.password,
                country,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('registration_data', JSON.stringify(registrationData));

            toast.success("Email verified successfully! Please continue with registration.");

            navigate('/register/country-residence');

        } catch (error) {
            console.error("Registration validation failed:", error);
            toast.error(error instanceof Error ? error.message : "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }


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
                        border: "1px solid rgb(220, 38, 38)"
                    }
                });
            }

            setUser(user, token);

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
    async function onSignIn(values: z.infer<typeof formSchema>) {
        setLoginLoading(true);
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
            setUser(user, token);

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
                        "Unable to connect to the server. Please check your internet connection."
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
            setLoginLoading(false);
        }
    }

    if (requireOTP && loginCredentials) {
        return (
            <div className="min-h-screen bg-[#0A1A2A] flex items-center justify-center p-4">
                <OTPVerification
                    email={loginCredentials.email}
                    onVerify={handleOTPVerification}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A1A2A] flex flex-col overflow-x-hidden pb-16">
            {/* Warning banner - Mobile version */}
            <div className="md:hidden">
                {showWarning ? (
                    <div className="w-full bg-[#0C1E32] text-white/80 py-2 px-4 text-center text-xs flex items-center justify-between">
                        <span>Financial Spread Trades and CFDs are complex instruments and come with a high risk
                            of losing money rapidly due to leverage.
                            82.4% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how
                            CFDs work and whether you can afford to take the high risk of losing your money.
                        </span>
                        <button onClick={() => setShowWarning(false)} className="ml-2">
                            <ChevronUp className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowWarning(true)}
                        className="w-full bg-[#0C1E32] text-white/80 py-2 px-4 flex items-center justify-center"
                    >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        <span className="text-sm">Show risk warning</span>
                    </button>
                )}
            </div>

            {/* Warning banner - Desktop version */}
            <div className="hidden md:block w-full bg-[#0C1E32] text-white/80 py-2 px-4 text-center text-sm">
                Trading CFDs carries a high level of risk to your capital, and you should only trade with money you can afford to lose.
            </div>

            {/* Header */}
            <div className="w-full px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
                <div className="hidden-md: block">
                    <Logo />
                </div>
                <div className="ml-auto">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                        <svg className="w-5 h-5 mr-2 md:hidden" viewBox="0 0 36 36">
                            <rect fill="#00247D" width="36" height="27"/>
                            <path d="M0,0 L36,27 M36,0 L0,27" stroke="#fff" strokeWidth="5.4"/>
                            <path d="M0,0 L36,27 M36,0 L0,27" stroke="#cf142b" strokeWidth="3.6"/>
                            <path d="M18,0 V27 M0,13.5 H36" stroke="#fff" strokeWidth="9"/>
                            <path d="M18,0 V27 M0,13.5 H36" stroke="#cf142b" strokeWidth="5.4"/>
                        </svg>
                        <svg className="w-5 h-5 mr-2 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        EN
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 md:px-8">
                <div className="w-full max-w-5xl">
                    {/* Mobile Layout */}
                    <div className="md:hidden border border-white/10 rounded-3xl bg-[#0C1E32]/40 backdrop-blur-sm p-6">


                        <h1 className="text-3xl font-bold text-white mb-2 leading-relaxed">
                            <span className="text-[#FF5B22]">Log In</span> to  your account here
                        </h1>


                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onSignIn)} className="space-y-6">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Email address*"
                                                    {...field}
                                                    className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg py-6"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Password*"
                                                        {...field}
                                                        className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg pr-10 py-6"
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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

                                <div className="mt-2">
                                    <Link to="/forgot-password" className="text-white underline hover:text-white/80">Forgot Password</Link>
                                </div>


                                <Button
                                    type="submit"
                                    className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-black font-semibold rounded-full py-6 transition-all flex items-center justify-center"
                                    disabled={isLoginLoading}
                                >
                                    {isLoginLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Processing ...
                                        </div>
                                    ) : (
                                        <>
                                            Log In
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>


                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="text-[#FF5B22] font-bold">OR</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>



                        <h1 className="text-3xl font-bold text-white mb-6 leading-relaxed">
                            <span className="text-[#FF5B22]">Sign up</span> to power up your trading
                        </h1>


                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Email address*"
                                                    {...field}
                                                    className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg py-6"
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
                                                        className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg pr-10 py-6"
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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
                                    className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-black font-semibold rounded-full py-6 transition-all flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Checking email availability...
                                        </div>
                                    ) : (
                                        <>
                                            Sign up now
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 text-white">
                            <p className="mb-3">Ready to trade with the G.O.A.T?</p>
                            <div className="flex items-center gap-2">
                                <span>Excellent</span>
                                <div className="flex items-center bg-[#00B67A] px-3 py-1 rounded">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="mt-2">
                                1,196 reviews on <span className="text-[#00B67A]">Trustpilot</span>
                            </p>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex border border-white/10 rounded-3xl bg-[#0C1E32]/40 backdrop-blur-sm">
                        {/* Left side - Text */}
                        <div className="w-1/2 p-12 flex flex-col justify-between py-32">

                            <h1 className="text-3xl font-bold text-white mb-2 leading-relaxed">
                                <span className="text-[#FF5B22]">Log In</span> to  your account <br />here
                            </h1>


                            <div className="flex items-center gap-4 my-8">
                                <div className="flex-1 h-px bg-white/20"></div>
                                <span className="text-[#FF5B22] font-bold">OR</span>
                                <div className="flex-1 h-px bg-white/20"></div>
                            </div>

                            <div>
                                <h1 className="text-4xl font-bold text-white mb-4 leading-relaxed">
                                    <span className="text-[#FF5B22]">Sign up</span> to power up<br />
                                    your trading
                                </h1>

                                <div className="mt-8 text-white">

                                    <p className="mb-3">Ready to trade with the G.O.A.T?</p>

                                    <div className="flex items-center gap-2">
                                        <span>Excellent</span>
                                        <div className="flex items-center bg-[#00B67A] px-3 py-1 rounded">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ml-1">1,196 reviews on</span>
                                        <svg className="w-4 h-4 text-[#00B67A]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                                        </svg>
                                        <span className="text-[#00B67A]">Trustpilot</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right side - Form */}
                        <div className="w-1/2 p-12 border-l border-white/10">
                            <div className="space-y-3">

                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(onSignIn)} className="space-y-6">
                                        <FormField
                                            control={loginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Email address*"
                                                            {...field}
                                                            className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg py-6"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="relative">
                                                        <FormControl>
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Password*"
                                                                {...field}
                                                                className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg pr-10 py-6"
                                                            />
                                                        </FormControl>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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

                                        <div className="mt-2">
                                            <Link to="/forgot-password" className="text-white underline hover:text-white/80">Forgot Password</Link>
                                        </div>


                                        <Button
                                            type="submit"
                                            className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-black font-semibold rounded-full py-6 transition-all flex items-center justify-center"
                                            disabled={isLoginLoading}
                                        >
                                            {isLoginLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Processing ...
                                                </div>
                                            ) : (
                                                <>
                                                    Log In
                                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Form>


                            </div>

                            <div className="flex items-center gap-4 my-8">
                                <div className="flex-1 h-px bg-white/20"></div>
                                <span className="text-[#FF5B22] font-bold">OR</span>
                                <div className="flex-1 h-px bg-white/20"></div>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Email address*"
                                                        {...field}
                                                        className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg py-6"
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
                                                            className="bg-transparent border-white/20 text-white placeholder:text-white/50 rounded-lg pr-10 py-6"
                                                        />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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
                                        className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-black font-semibold rounded-full py-6 mt-8 transition-all flex items-center justify-center"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Checking email availability...
                                            </div>
                                        ) : (
                                            <>
                                                Sign up now
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

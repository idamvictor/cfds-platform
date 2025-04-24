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

export default function RegisterTradeNation() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(true);
    const navigate = useNavigate();

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
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

    return (
        <div className="min-h-screen bg-[#0A1A2A] flex flex-col">
            {/* Warning banner - Mobile version */}
            <div className="md:hidden">
                {showWarning ? (
                    <div className="w-full bg-[#0C1E32] text-white/80 py-2 px-4 text-center text-sm flex items-center justify-between">
                        <span>Trading CFDs carries a high level of risk to your capital, and you should only trade with money you can afford to lose.</span>
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
                <div className="hidden md:block">
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
                        <h1 className="text-3xl font-bold text-white mb-2">
                            <span className="text-[#FF5B22]">Sign up</span> to power up your trading
                        </h1>
                        <p className="text-white mb-8">
                            Already have an account? <Link to="/?type=basic" className="text-white underline hover:text-white/80">Log in here</Link>
                        </p>

                        <div className="space-y-3 mb-8">
                            <Button
                                variant="outline"
                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                onClick={() => {/* Add Google registration logic */}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"/>
                                    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62Z"/>
                                    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"/>
                                    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"/>
                                </svg>
                                <span className="ml-3">Sign up with Google</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                onClick={() => {/* Add Apple registration logic */}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M17.569 12.787c-.043-3.401 2.777-5.036 2.903-5.114-1.583-2.314-4.042-2.629-4.914-2.665-2.079-.216-4.079 1.242-5.139 1.242-1.077 0-2.714-1.215-4.468-1.181-2.277.034-4.389 1.345-5.562 3.398-2.396 4.158-.612 10.293 1.69 13.661 1.145 1.652 2.492 3.5 4.26 3.433 1.724-.069 2.371-1.103 4.452-1.103 2.063 0 2.662 1.103 4.452 1.066 1.845-.03 3.014-1.664 4.129-3.327 1.319-1.907 1.854-3.765 1.875-3.861-.041-.016-3.576-1.374-3.62-5.438v-.111l-.009.003Zm-3.334-9.983c.932-1.162 1.565-2.745 1.393-4.355-1.344.055-3.011.916-3.981 2.056-.859 1.002-1.623 2.645-1.423 4.193 1.51.115 3.061-.764 4.011-1.894Z"/>
                                </svg>
                                <span className="ml-3">Sign up with Apple</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                onClick={() => {/* Add LinkedIn registration logic */}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span className="ml-3">Sign up with LinkedIn</span>
                            </Button>
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
                        <div className="w-1/2 p-12 flex flex-col justify-center">
                            <h1 className="text-4xl font-bold text-white mb-4">
                                <span className="text-[#FF5B22]">Sign up</span> to power<br />
                                up your trading
                            </h1>
                            <p className="text-white/60 text-lg">
                                Or, <Link to="/" className="text-white underline hover:text-white/80">log in here</Link>
                            </p>

                            <div className="mt-16 text-white">
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

                        {/* Right side - Form */}
                        <div className="w-1/2 p-12 border-l border-white/10">
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                    onClick={() => {/* Add Google registration logic */}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"/>
                                        <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62Z"/>
                                        <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"/>
                                        <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"/>
                                    </svg>
                                    <span className="ml-3">Sign up with Google</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                    onClick={() => {/* Add Apple registration logic */}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                                        <path d="M17.569 12.787c-.043-3.401 2.777-5.036 2.903-5.114-1.583-2.314-4.042-2.629-4.914-2.665-2.079-.216-4.079 1.242-5.139 1.242-1.077 0-2.714-1.215-4.468-1.181-2.277.034-4.389 1.345-5.562 3.398-2.396 4.158-.612 10.293 1.69 13.661 1.145 1.652 2.492 3.5 4.26 3.433 1.724-.069 2.371-1.103 4.452-1.103 2.063 0 2.662 1.103 4.452 1.066 1.845-.03 3.014-1.664 4.129-3.327 1.319-1.907 1.854-3.765 1.875-3.861-.041-.016-3.576-1.374-3.62-5.438v-.111l-.009.003Zm-3.334-9.983c.932-1.162 1.565-2.745 1.393-4.355-1.344.055-3.011.916-3.981 2.056-.859 1.002-1.623 2.645-1.423 4.193 1.51.115 3.061-.764 4.011-1.894Z"/>
                                    </svg>
                                    <span className="ml-3">Sign up with Apple</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                    onClick={() => {/* Add LinkedIn registration logic */}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    <span className="ml-3">Sign up with LinkedIn</span>
                                </Button>
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

                            <div className="mt-8 text-center">
                                <span className="text-white/80">Already have an account? </span>
                                <Link to="/" className="text-white underline hover:text-white/80">Log in here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

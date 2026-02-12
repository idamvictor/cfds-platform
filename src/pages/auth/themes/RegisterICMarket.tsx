import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
import { countries, countryCodeMap } from "@/constants/countries.ts";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";

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

export default function RegisterICMarket() {
    const settings = useSiteSettingsStore((state) => state.settings);


    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            navigate('/register');

        } catch (error) {
            console.error("Registration validation failed:", error);
            toast.error(error instanceof Error ? error.message : "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0F1D] flex flex-col">

            {/* Warning banner - Desktop version */}
            { settings?.register_page_header ? (
                <div className="hidden md:block w-full bg-[#0C1E32] text-white/80 py-2 px-4 text-center text-sm">
                    { settings?.register_page_header}
                </div>
            ) :null }


            {/* Header */}
            <div className="w-full px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
                <div className="">
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

            <div className="flex-1 flex items-center justify-center px-4 md:px-8 mt-8 md:mt-0">
                <div className="w-full max-w-6xl flex flex-col md:flex-row">
                    {/* Left side - Hero content */}
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <div className="text-center md:text-left pr-0 md:pr-8">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                Live Trading Account Application
                            </h1>
                            <div className="space-y-2 text-gray-300 text-sm md:text-base mb-6">
                                <p className="md:text-lg">- Fast account opening & instant funding</p>
                                <p className="md:text-lg">- Forex CFD Provider covering 6 asset classes and 2000+ products</p>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-green-500 font-semibold text-lg mt-8">Start your trading journey today</p>
                                <p className="text-gray-400 mt-2">Join thousands of traders who trust us worldwide</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="md:w-1/2">
                        <div className="bg-[#0C1E32]/80 p-8 rounded-lg backdrop-blur-sm border border-gray-800">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Your Account</h2>

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
                                        className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold rounded-md py-6 transition-all flex items-center justify-center"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Checking email availability...
                                            </div>
                                        ) : (
                                            <>
                                                Create Your Account
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-400">Already have an account?</p>
                                <Link to="/" className="text-green-500 font-medium hover:text-green-400 mt-1 inline-block">
                                    Sign in to your account
                                </Link>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <ul className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
                                    <li>
                                        <a target='_blank' href={ settings?.terms_url } className="hover:text-green-500">Terms of Service</a>
                                    </li>
                                    <li>
                                        <a href={ settings?.privacy_url } className="hover:text-green-500">Privacy Policy</a>
                                    </li>
                                    <li>
                                        <a href={ settings?.risk_url } className="hover:text-green-500">Risk Disclosure</a>
                                    </li>
                                    <li>
                                        <a href={ settings?.help_url } className="hover:text-green-500">Help Center</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer section - Only visible on desktop */}
            { settings?.register_page_footer ? (
                <div className="mt-8 hidden md:block bg-[#0C1E32] py-4">
                    <div className="max-w-6xl mx-auto px-4 md:px-8">
                        <div className="text-center text-xs text-gray-400">
                            <p>
                                { settings?.register_page_footer }
                            </p>
                        </div>
                    </div>
                </div>
            ) : null }

        </div>
    );
}

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import useUserStore from "@/store/userStore";
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
    const setUser = useUserStore((state) => state.setUser);

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
            setUser(user, token);

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
            setIsLoading(false);
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
        <div className="min-h-screen bg-[#0A1A2A] flex flex-col">
            { settings?.login_page_header ? (
                <div className=" w-full bg-[#0C1E32] text-white/80 py-2 px-4 text-center text-sm">
                    { settings?.login_page_header }
                </div>
            ) : (
                <div className=" w-full bg-[#0C1E32] text-white/80 py-2 px-4 text-center text-sm">
                    Trading CFDs carries a high level of risk to your capital, and you should only trade with money you can afford to lose.
                </div>
            )}


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

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4 md:px-8">
                <div className="w-full max-w-6xl">
                    {/* Mobile Layout */}
                    <div className="md:hidden border border-white/10 rounded-3xl bg-[#0C1E32]/40 backdrop-blur-sm p-6">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            <span className="text-[#FF5B22]">Log In</span> to  your account here
                        </h1>

                        <p className="text-white mb-8">
                            Don't have an account yet?
                            <Link to="/signup" className="text-white underline hover:text-white/80"> Sign Up</Link>
                        </p>


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

                                <div className="mt-2">
                                    <Link to="/forgot/password" className="text-white underline hover:text-white/80">Forgot Password</Link>
                                </div>


                                <Button
                                    type="submit"
                                    className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-black font-semibold rounded-full py-6 transition-all flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
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


                        <div className="space-y-3 mb-8">
                            <Button
                                variant="outline"
                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                onClick={() => {/* Add Google login logic */}}
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
                                onClick={() => {/* Add Apple login logic */}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                                    <path d="M17.569 12.787c-.043-3.401 2.777-5.036 2.903-5.114-1.583-2.314-4.042-2.629-4.914-2.665-2.079-.216-4.079 1.242-5.139 1.242-1.077 0-2.714-1.215-4.468-1.181-2.277.034-4.389 1.345-5.562 3.398-2.396 4.158-.612 10.293 1.69 13.661 1.145 1.652 2.492 3.5 4.26 3.433 1.724-.069 2.371-1.103 4.452-1.103 2.063 0 2.662 1.103 4.452 1.066 1.845-.03 3.014-1.664 4.129-3.327 1.319-1.907 1.854-3.765 1.875-3.861-.041-.016-3.576-1.374-3.62-5.438v-.111l-.009.003Zm-3.334-9.983c.932-1.162 1.565-2.745 1.393-4.355-1.344.055-3.011.916-3.981 2.056-.859 1.002-1.623 2.645-1.423 4.193 1.51.115 3.061-.764 4.011-1.894Z"/>
                                </svg>
                                <span className="ml-3">Sign up with Apple</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                onClick={() => {/* Add LinkedIn login logic */}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span className="ml-3">Sign up with LinkedIn</span>
                            </Button>
                        </div>


                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex border border-white/10 rounded-3xl bg-[#0C1E32]/40 backdrop-blur-sm">
                        {/* Left side - Text */}
                        <div className="w-1/2 p-12 flex flex-col justify-center-">
                            <h1 className="text-4xl font-bold text-white mb-4">
                                <span className="text-[#FF5B22]">Log In</span> to your account
                                <br />
                                here
                            </h1>
                            <p className="text-white/60 text-lg">
                                Don't have an account yet? <Link to="/signup" className="text-white underline hover:text-white/80">Sign Up</Link>
                            </p>

                        </div>


                        <div className="w-1/2 p-12 border-l border-white/10">


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


                                    <div className="mt-2">
                                        <Link to="/" className="text-white underline hover:text-white/80">Forgot Password</Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-black font-semibold rounded-full py-6 mt-8 transition-all flex items-center justify-center"
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

                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                    onClick={() => {/* Add Google login logic */}}
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
                                    onClick={() => {/* Add Apple login logic */}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                                        <path d="M17.569 12.787c-.043-3.401 2.777-5.036 2.903-5.114-1.583-2.314-4.042-2.629-4.914-2.665-2.079-.216-4.079 1.242-5.139 1.242-1.077 0-2.714-1.215-4.468-1.181-2.277.034-4.389 1.345-5.562 3.398-2.396 4.158-.612 10.293 1.69 13.661 1.145 1.652 2.492 3.5 4.26 3.433 1.724-.069 2.371-1.103 4.452-1.103 2.063 0 2.662 1.103 4.452 1.066 1.845-.03 3.014-1.664 4.129-3.327 1.319-1.907 1.854-3.765 1.875-3.861-.041-.016-3.576-1.374-3.62-5.438v-.111l-.009.003Zm-3.334-9.983c.932-1.162 1.565-2.745 1.393-4.355-1.344.055-3.011.916-3.981 2.056-.859 1.002-1.623 2.645-1.423 4.193 1.51.115 3.061-.764 4.011-1.894Z"/>
                                    </svg>
                                    <span className="ml-3">Sign up with Apple</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-start px-4 py-6 rounded-full"
                                    onClick={() => {/* Add LinkedIn login logic */}}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    <span className="ml-3">Sign up with LinkedIn</span>
                                </Button>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

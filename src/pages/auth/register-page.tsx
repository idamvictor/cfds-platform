import { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import useUserStore from "@/store/userStore";
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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    phone: z.string().min(6, { message: "Please enter a valid phone number" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const inputClass = "!bg-white !text-gray-900 border-gray-200 placeholder:text-gray-400 rounded-lg py-6 px-4 focus-visible:ring-gray-300 focus-visible:border-gray-400";
const readonlyClass = "!bg-gray-50 !text-gray-500 border-gray-200 rounded-lg py-6 px-4 cursor-default focus-visible:ring-0 focus-visible:border-gray-200";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        if (user && token) navigate("/main");
    }, [user, token, navigate]);

    useEffect(() => {
        const data = localStorage.getItem('registration_data');
        if (!data) {
            toast.error("Please complete the registration process first");
            navigate('/signup');
        }
    }, [navigate]);

    const stored = (() => {
        try { return JSON.parse(localStorage.getItem('registration_data') ?? '{}'); }
        catch { return {}; }
    })();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            username: "",
            phone: "",
            password: stored.password ?? "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const raw = localStorage.getItem('registration_data');
        if (!raw) {
            toast.error("Missing registration data. Please start over.");
            navigate('/signup');
            return;
        }

        const savedData = JSON.parse(raw);

        if (!savedData.email) {
            toast.error("Missing registration data. Please start over.");
            navigate('/signup');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosInstance.post("/auth/register", {
                ...values,
                email: savedData.email.trim(),
                confirm_password: values.password,
                country: savedData.country ?? "",
                nationality: savedData.nationality ?? savedData.country ?? "",
                country_code: "+1",
            });

            localStorage.removeItem('registration_data');

            const { user: newUser, token: newToken } = response.data.data;
            setUser(newUser, newToken);
            toast.success("Account created successfully! Welcome aboard.");
            navigate("/main");
        } catch (error) {
            if (error instanceof AxiosError) {
                const msg = error.response?.data?.message || "Registration failed. Please try again.";
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

    const countryEntry = countries.find(c => c.value === stored.country);
    const nationalityEntry = countries.find(c => c.value === stored.nationality);
    const showNationality = nationalityEntry && nationalityEntry.value !== countryEntry?.value;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Risk warning */}
            <div className="w-full bg-[#0C1E32] text-white/80 py-4 px-4 text-center text-sm">
                Trading CFDs carries a high level of risk to your capital, and you should only trade with money you can afford to lose.
            </div>

            {/* Header */}
            <div className="w-full border-t border-t-gray-700 bg-[#0C1E32] px-4 md:px-8 py-3 flex justify-between items-center">
                <Logo />
                <Button variant="ghost" className="text-white hover:bg-white/10">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 36 36">
                        <rect fill="#00247D" width="36" height="27"/>
                        <path d="M0,0 L36,27 M36,0 L0,27" stroke="#fff" strokeWidth="5.4"/>
                        <path d="M0,0 L36,27 M36,0 L0,27" stroke="#cf142b" strokeWidth="3.6"/>
                        <path d="M18,0 V27 M0,13.5 H36" stroke="#fff" strokeWidth="9"/>
                        <path d="M18,0 V27 M0,13.5 H36" stroke="#cf142b" strokeWidth="5.4"/>
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h1>
                    <p className="text-gray-600 mb-8">
                        Complete your profile to finish creating your account.
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                            {/* Readonly: Email */}
                            <div>
                                <label className="text-gray-700 text-sm mb-2 block">Email</label>
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
                                    <label className="text-gray-700 text-sm mb-2 block">Country of Residence</label>
                                    <Input
                                        value={`${countryEntry.flag}  ${countryEntry.label}`}
                                        readOnly
                                        tabIndex={-1}
                                        className={readonlyClass}
                                    />
                                </div>
                            )}

                            {/* Readonly: Nationality (only if different from country) */}
                            {showNationality && (
                                <div>
                                    <label className="text-gray-700 text-sm mb-2 block">Nationality</label>
                                    <Input
                                        value={`${nationalityEntry!.flag}  ${nationalityEntry!.label}`}
                                        readOnly
                                        tabIndex={-1}
                                        className={readonlyClass}
                                    />
                                </div>
                            )}

                            <hr className="border-gray-100 my-2" />

                            {/* Editable fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="First name" {...field} className={inputClass} />
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
                                            <FormLabel className="text-gray-700 text-sm">Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Last name" {...field} className={inputClass} />
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
                                        <FormLabel className="text-gray-700 text-sm">Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Choose a username" {...field} className={inputClass} />
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
                                        <FormLabel className="text-gray-700 text-sm">Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone number" {...field} className={inputClass} />
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
                                        <FormLabel className="text-gray-700 text-sm">Password</FormLabel>
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
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="bg-[#00A98D]/90 text-white px-6 py-4 rounded-lg text-sm">
                                You will be onboarded with the Trade Nation LTD, registered in England & Wales under company
                                number 07073413, authorised and regulated by the Financial Conduct Authority under firm
                                reference number 525164.
                            </div>

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
                                ) : "Create Account"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

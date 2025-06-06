import { useState, useEffect } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import useUserStore from "@/store/userStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import {toast} from "@/components/ui/sonner.tsx";
import {AxiosError} from "axios";
import AnimatedBackground from "@/pages/auth/animated-background.tsx";

// Define the form schema with validation
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
        email: z.string().email({ message: "Please enter a valid email address" }),
        phone: z.string().min(6, { message: "Please enter a valid phone number" }),
        country_code: z.string(),
        country: z.string(),
        nationality: z.string(),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

// Country options
const countries = [
    { value: "nigeria", label: "Nigeria" },
    { value: "uk", label: "United Kingdom" },
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
];

export default function RegisterBasic() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [registrationData, setRegistrationData] = useState<{
        email?: string;
        password?: string;
        country?: string;
        nationality?: string;
    } | null>(null);
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);

    // Check for existing auth and redirect if found
    useEffect(() => {
        if (user && token) {
            navigate("/main");
        }
    }, [user, token, navigate]);

    useEffect(() => {
        const data = localStorage.getItem('registration_data');
        if (!data) {
            toast.error("Please complete the registration process first");
            navigate('/signup');
            return;
        }

        const parsedData = JSON.parse(data);
        setRegistrationData(parsedData);

        // Set form values from registration_data
        if (parsedData.email) {
            form.setValue('email', parsedData.email);
        }
        if (parsedData.password) {
            form.setValue('password', parsedData.password);
            form.setValue('confirm_password', parsedData.password);
        }
        if (parsedData.country) {
            form.setValue('country', parsedData.country);
        }
        if (parsedData.nationality) {
            form.setValue('nationality', parsedData.nationality);
        }
    }, [navigate]);


    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            phone: "",
            country_code: "+1",
            country: "",
            nationality: "",
            password: "",
            confirm_password: "",
        },
    });

    // Form submission handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Merge form values with registration data
            const submitData = {
                ...values,
                ...(registrationData?.email && { email: registrationData.email }),
                ...(registrationData?.password && {
                    password: registrationData.password,
                    confirm_password: registrationData.password
                }),
                ...(registrationData?.country && { country: registrationData.country }),
                ...(registrationData?.nationality && { nationality: registrationData.nationality }),
            };

            const response = await axiosInstance.post("/auth/register", submitData);
            console.log("Registration successful:", response.data);

            // Clear registration data from localStorage after successful registration
            localStorage.removeItem('registration_data');

            navigate("/");
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

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            <AnimatedBackground />

            <Card className="w-full max-w-md bg-card/90 backdrop-blur-md border-border shadow-xl z-10 relative">
                <CardHeader className="space-y-1 pb-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="h-5 w-5 text-primary" />
                            <h1 className="text-xl font-bold tracking-wider text-card-foreground">
                                CREATE A NEW ACCOUNT
                            </h1>
                        </div>
                        {registrationData && (
                            <p className="text-sm text-muted-foreground">
                                Some fields have been pre-filled from your previous step
                            </p>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-card-foreground">
                                                First Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="First name"
                                                    {...field}
                                                    className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
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
                                            <FormLabel className="text-sm font-medium text-card-foreground">
                                                Last Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Last name"
                                                    {...field}
                                                    className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
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
                                        <FormLabel className="text-sm font-medium text-card-foreground">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Username"
                                                {...field}
                                                className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!registrationData?.email && (
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-card-foreground">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    {...field}
                                                    className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="space-y-2">
                                <div className="text-sm font-medium text-card-foreground">
                                    Phone
                                </div>
                                <div className="flex gap-2">
                                    {/*<FormField*/}
                                    {/*    control={form.control}*/}
                                    {/*    name="country_code"*/}
                                    {/*    render={({ field }) => (*/}
                                    {/*        <FormItem className="w-[100px] flex-shrink-0">*/}
                                    {/*            <Select*/}
                                    {/*                onValueChange={field.onChange}*/}
                                    {/*                defaultValue={field.value}*/}
                                    {/*            >*/}
                                    {/*                <FormControl>*/}
                                    {/*                    <SelectTrigger className="bg-muted border border-border text-card-foreground focus:ring-primary">*/}
                                    {/*                        <SelectValue placeholder="Code" />*/}
                                    {/*                    </SelectTrigger>*/}
                                    {/*                </FormControl>*/}
                                    {/*                <SelectContent className="bg-card border-border text-card-foreground">*/}
                                    {/*                    {countryCodes.map((code) => (*/}
                                    {/*                        <SelectItem key={code.value} value={code.value}>*/}
                                    {/*                            {code.label}*/}
                                    {/*                        </SelectItem>*/}
                                    {/*                    ))}*/}
                                    {/*                </SelectContent>*/}
                                    {/*            </Select>*/}
                                    {/*            <FormMessage />*/}
                                    {/*        </FormItem>*/}
                                    {/*    )}*/}
                                    {/*/>*/}

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Phone number"
                                                        {...field}
                                                        className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {!registrationData?.country && (
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-card-foreground">
                                                Country
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-muted/70 border-border text-card-foreground focus:ring-primary">
                                                        <SelectValue placeholder="Select your country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-card border-border text-card-foreground">
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.value} value={country.value}>
                                                            {country.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {!registrationData?.password && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-card-foreground">
                                                    Password
                                                </FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            {...field}
                                                            className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pr-10"
                                                        />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
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

                                    <FormField
                                        control={form.control}
                                        name="confirm_password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-card-foreground">
                                                    Confirm Password
                                                </FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            {...field}
                                                            className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pr-10"
                                                        />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                                                        aria-label={
                                                            showConfirmPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                    >
                                                        {showConfirmPassword ? (
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
                                </>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Creating account...
                                    </div>
                                ) : (
                                    "CREATE ACCOUNT"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pt-0">
                    <div className="flex items-center justify-center space-x-2 text-sm text-card-foreground/80">
                        <span>Already have an account?</span>
                        <Link
                            to="/"
                            className="text-primary hover:text-primary/90 font-medium"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                        <Link
                            to=""
                            className="text-primary hover:text-primary/90 font-medium"
                        >
                            I have a promo-code
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeOff, Eye } from "lucide-react";
import { CurrencySelector } from "@/components/settings/currency-selector";
import { LanguageSelector } from "@/components/settings/language-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

const passwordFormSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [activationCode] = React.useState(
    "EN5WMXKWPMUT45JZGNCU2M2AJBAGGPDUHAWI"
  );
  const [authCode, setAuthCode] = React.useState("");

  const form = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const handleChangePassword = async (
    values: z.infer<typeof passwordFormSchema>
  ) => {
    try {
      setIsSubmitting(true);
      console.log("Form values:", values);
      await axiosInstance.post("/change/password", {
        current_password: values.current_password,
        new_password: values.new_password,
        confirm_new_password: values.confirm_password,
      });
      toast.success("Password changed successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate2FA = () => {
    // Handle 2FA activation logic
    console.log("Activating 2FA");
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">SETTINGS</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Update Section */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>UPDATE PASSWORD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleChangePassword)}
                className="space-y-4"
              >
                {" "}
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            {...field}
                            className="bg-card border-card-foreground/10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                            aria-label={
                              showCurrentPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            {...field}
                            className="bg-card border-card-foreground/10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                            aria-label={
                              showNewPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            className="bg-card border-card-foreground/10 pr-10"
                          />
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
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 2FA Section */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>ACTIVATE 2FA PROTECTION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-muted-foreground">
                Activation code for Google Authenticator
              </label>
              <Input
                value={activationCode}
                readOnly
                className="bg-card border-card-foreground/10 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="authCode" className="text-muted-foreground">
                Activate Authenticator and enter a generated code in field below
              </label>
              <Input
                id="authCode"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="bg-card border-card-foreground/10"
                placeholder="Enter code"
              />
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground">QR Code</label>
              <div className="bg-white p-4 inline-block">
                <img
                  src="/placeholder.svg?height=180&width=180"
                  alt="QR Code"
                  className="h-[180px] w-[180px]"
                />
              </div>
            </div>

            <Button
              onClick={handleActivate2FA}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Activate 2FA Protection
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Currency Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>DASHBOARD CURRENCY</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencySelector />
        </CardContent>
      </Card>



      {/* Language Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>DASHBOARD LANGUAGE</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSelector />
        </CardContent>
      </Card>
    </div>
  );
}

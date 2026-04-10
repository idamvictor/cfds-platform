import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye, Lock } from "lucide-react";
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

// ── Validation schema (UNCHANGED) ──────────────────────────────────
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

// ── Password strength (purely visual) ──────────────────────────────
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "#f43f5e", percent: 20 };
  if (score <= 2) return { label: "Fair", color: "#FF9800", percent: 40 };
  if (score <= 3) return { label: "Good", color: "#f0b90b", percent: 60 };
  if (score <= 4) return { label: "Strong", color: "#00dfa2", percent: 80 };
  return { label: "Very Strong", color: "#00dfa2", percent: 100 };
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { label, color, percent } = getPasswordStrength(password);
  return (
    <div className="mt-2 space-y-1">
      <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[10px] font-semibold" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

export function PasswordChangeCard() {
  // ── Existing state (UNCHANGED) ──
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // ── Existing form setup (UNCHANGED) ──
  const form = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const watchedNewPassword = form.watch("new_password");

  // ── Existing handler (UNCHANGED) ──
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to change password"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-5 md:p-7">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Security
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleChangePassword)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                    <Lock className="h-3.5 w-3.5" />
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        {...field}
                        className="input-focus-glow h-10 rounded-lg pr-10 text-sm placeholder:text-[#3a4556]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5468] hover:text-[#eef2f7] transition-colors"
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
                  <FormMessage className="text-[11px] font-semibold text-[#f43f5e]" />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                    <Lock className="h-3.5 w-3.5" />
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        {...field}
                        className="input-focus-glow h-10 rounded-lg pr-10 text-sm placeholder:text-[#3a4556]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5468] hover:text-[#eef2f7] transition-colors"
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
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
                  <PasswordStrengthBar password={watchedNewPassword} />
                  <FormMessage className="text-[11px] font-semibold text-[#f43f5e]" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="space-y-1.5 md:col-span-2">
                  <FormLabel className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                    <Lock className="h-3.5 w-3.5" />
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
                        {...field}
                        className="input-focus-glow h-10 rounded-lg pr-10 text-sm placeholder:text-[#3a4556] md:max-w-[calc(50%-0.625rem)]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5468] hover:text-[#eef2f7] transition-colors md:left-[calc(50%-0.625rem-2.5rem)] md:right-auto"
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
                  <FormMessage className="text-[11px] font-semibold text-[#f43f5e]" />
                </FormItem>
              )}
            />
          </div>

          {/* Footer with submit */}
          <div className="flex items-center gap-3 mt-7 pt-5 border-t border-white/[0.06]">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gradient-btn-green text-xs font-extrabold px-6 py-2.5 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="border-white/[0.08] bg-white/[0.03] text-[#8b97a8] font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-white/[0.06] hover:text-[#eef2f7] hover:border-white/[0.12] transition-all active:scale-[0.98]"
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

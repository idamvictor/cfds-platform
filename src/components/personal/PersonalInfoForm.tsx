import { PhotoGuidelines } from "@/components/personal-info/photo-guidelines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  MapPin,
  Globe,
  CalendarDays,
  Mail,
  Phone,
  Shield,
  Upload,
  Camera,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/userStore";
import { countries } from "@/data/countries";
import { useEffect } from "react";
import { AxiosError } from "axios";

// ── Schema (UNCHANGED, moved verbatim) ────────────────────────────
const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  country: z.string().min(1, "Please select a country"),
  birth_date: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  avatar: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface PersonalInfoFormProps {
  /** Show the Profile Photo upload card. Default: true (matches existing PersonalInformation page). */
  showProfilePhoto?: boolean;
  /** Custom submit button label. Default: "Save Changes". */
  submitLabel?: string;
  /** Optional callback fired after a successful POST /update. */
  onSuccess?: () => void;
}

export function PersonalInfoForm({
  showProfilePhoto = true,
  submitLabel = "Save Changes",
  onSuccess,
}: PersonalInfoFormProps) {
  // ── State (UNCHANGED, moved verbatim) ──
  const [image, setImage] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const user = useUserStore((state) => state.user);

  // ── Form setup (UNCHANGED, moved verbatim) ──
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      address: user?.address || "",
      country: user?.country || "maldives",
      birth_date: user?.birth_date || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || null,
    },
  });

  useEffect(() => {
    if (user) {
      setImage(user?.avatar || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Submit handler (UNCHANGED, moved verbatim) ──
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/update", {
        ...data,
        avatar: image,
      });

      if (response.data) {
        toast.success("Profile updated successfully");
        // Update the user store with new data if needed
        if (user) {
          useUserStore.getState().setUser(
            {
              ...user,
              first_name: data.first_name,
              last_name: data.last_name,
              country: data.country,
              birth_date: data.birth_date,
              email: data.email,
              address: data.address,
              phone: data.phone,
              avatar: image || user.avatar,
            },
            useUserStore.getState().token!
          );
        }
        // Optional callback for callers like the KYC flow that need to advance after save
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageData = event.target.result as string;
            setImage(imageData);
            setValue("avatar", imageData);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      handleImageUpload((e.target as HTMLInputElement).files);
    };
    input.click();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      {/* Personal Details Card */}
      <div className="glass-card p-5 md:p-7">
        {/* Section header with accent top border */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
            Account Details
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          {/* First Name */}
          <FieldGroup
            label="First Name"
            icon={<User className="h-3.5 w-3.5" />}
            error={errors.first_name?.message}
          >
            <Input
              id="first_name"
              {...register("first_name")}
              className="h-10 bg-white/[0.03] border-white/[0.08] rounded-lg text-sm text-[#eef2f7] placeholder:text-[#3a4556] focus:border-[#00dfa2]/50 focus:ring-1 focus:ring-[#00dfa2]/10 transition-all"
            />
          </FieldGroup>

          {/* Last Name */}
          <FieldGroup
            label="Last Name"
            icon={<User className="h-3.5 w-3.5" />}
            error={errors.last_name?.message}
          >
            <Input
              id="last_name"
              {...register("last_name")}
              className="h-10 bg-white/[0.03] border-white/[0.08] rounded-lg text-sm text-[#eef2f7] placeholder:text-[#3a4556] focus:border-[#00dfa2]/50 focus:ring-1 focus:ring-[#00dfa2]/10 transition-all"
            />
          </FieldGroup>

          {/* Address */}
          <FieldGroup
            label="Address"
            icon={<MapPin className="h-3.5 w-3.5" />}
            error={errors.address?.message}
          >
            <Input
              id="address"
              {...register("address")}
              className="h-10 bg-white/[0.03] border-white/[0.08] rounded-lg text-sm text-[#eef2f7] placeholder:text-[#3a4556] focus:border-[#00dfa2]/50 focus:ring-1 focus:ring-[#00dfa2]/10 transition-all"
            />
          </FieldGroup>

          {/* Country */}
          <FieldGroup
            label="Country"
            icon={<Globe className="h-3.5 w-3.5" />}
            error={errors.country?.message}
          >
            <Select
              defaultValue={user?.country || "maldives"}
              onValueChange={(value) => setValue("country", value)}
            >
              <SelectTrigger className="h-10 bg-white/[0.03] border-white/[0.08] rounded-lg text-sm text-[#eef2f7] focus:border-[#00dfa2]/50 focus:ring-1 focus:ring-[#00dfa2]/10 transition-all">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1220] border-white/[0.08]">
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>

          {/* Date of Birth */}
          <FieldGroup
            label="Date of Birth"
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            error={errors.birth_date?.message}
          >
            <Input
              id="birth_date"
              type="date"
              {...register("birth_date")}
              className="h-10 bg-white/[0.03] border-white/[0.08] rounded-lg text-sm text-[#eef2f7] placeholder:text-[#3a4556] focus:border-[#00dfa2]/50 focus:ring-1 focus:ring-[#00dfa2]/10 transition-all [color-scheme:dark]"
            />
          </FieldGroup>

          {/* Email */}
          <FieldGroup
            label="Email"
            icon={<Mail className="h-3.5 w-3.5" />}
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="h-10 bg-white/[0.03] border-white/[0.08] rounded-lg text-sm text-[#eef2f7] placeholder:text-[#3a4556] focus:border-[#00dfa2]/50 focus:ring-1 focus:ring-[#00dfa2]/10 transition-all"
            />
          </FieldGroup>

          {/* Phone */}
          <FieldGroup
            label="Phone"
            icon={<Phone className="h-3.5 w-3.5" />}
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="h-10 bg-white/[0.03] border-white/[0.08] rounded-lg text-sm text-[#eef2f7] placeholder:text-[#3a4556] focus:border-[#00dfa2]/50 focus:ring-1 focus:ring-[#00dfa2]/10 transition-all"
            />
          </FieldGroup>

          {/* Account Type */}
          <FieldGroup
            label="Account Type"
            icon={<Shield className="h-3.5 w-3.5" />}
            hint="Account type cannot be modified"
          >
            <Input
              id="account_type"
              value={user?.account_type?.title || "Basic Plan"}
              disabled
              className="h-10 bg-white/[0.02] border-white/[0.06] rounded-lg text-sm text-[#8b97a8] cursor-not-allowed transition-all"
            />
          </FieldGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-7 pt-5 border-t border-white/[0.06]">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-br from-[#00dfa2] to-[#00b881] text-[#07080c] font-extrabold text-xs px-6 py-2.5 rounded-lg shadow-[0_4px_16px_rgba(0,223,162,0.2)] hover:shadow-[0_6px_24px_rgba(0,223,162,0.3)] hover:-translate-y-px transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              Object.keys(formSchema.shape).forEach((key) => {
                setValue(key as keyof FormValues, "");
              });
              setImage(null);
            }}
            className="border-white/[0.08] bg-white/[0.03] text-[#8b97a8] font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-white/[0.06] hover:text-[#eef2f7] hover:border-white/[0.12] transition-all active:scale-[0.98]"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Profile Photo Card (optional — hidden inside KYC flow) */}
      {showProfilePhoto && (
        <div className="glass-card p-5 md:p-7">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
              Profile Photo
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Zone */}
            <div
              className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 min-h-[340px] cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#00dfa2]/60 bg-[#00dfa2]/[0.04]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.03]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              {/* Avatar circle */}
              <div
                className={`relative flex items-center justify-center w-48 h-48 rounded-full mb-5 transition-transform duration-200 ${
                  isDragging ? "scale-105" : "group-hover:scale-[1.02]"
                }`}
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,223,162,0.12) 0%, rgba(0,223,162,0.02) 60%, transparent 80%)",
                }}
              >
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/[0.08] bg-[#0a0d15] flex items-center justify-center">
                  {image ? (
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-[#4a5468]" />
                  )}
                </div>
                {/* Camera overlay badge */}
                <div className="absolute bottom-1 right-1 flex items-center justify-center w-9 h-9 rounded-full bg-[#00dfa2] shadow-[0_4px_12px_rgba(0,223,162,0.3)]">
                  <Camera className="h-4 w-4 text-[#07080c]" />
                </div>
              </div>

              {/* Upload text */}
              <div className="flex items-center gap-2 text-[#8b97a8] mb-1">
                <Upload className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {isDragging ? "Drop to upload" : "Click or drag to upload"}
                </span>
              </div>
              <p className="text-[11px] text-[#4a5468] font-medium">
                JPG, GIF or PNG. Max 5 MB.
              </p>
            </div>

            {/* Photo Guidelines */}
            <PhotoGuidelines />
          </div>
        </div>
      )}
    </form>
  );
}

/* ── Field Group helper ── */
function FieldGroup({
  label,
  icon,
  error,
  hint,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
        {icon}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-semibold text-[#f43f5e]">{error}</p>
      )}
      {hint && (
        <p className="text-[10px] font-medium text-[#4a5468]">{hint}</p>
      )}
    </div>
  );
}

import { UserCircle } from "lucide-react";
import { PersonalInfoForm } from "@/components/personal/PersonalInfoForm";

export default function PersonalInformation() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#00dfa2]/10">
          <UserCircle className="h-5 w-5 text-[#00dfa2]" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[#eef2f7]">
            Personal Information
          </h1>
          <p className="text-[11px] text-[#4a5468] font-semibold">
            Manage your account details and profile
          </p>
        </div>
      </div>

      {/* Extracted shared form (preserves all logic, schema, handler, API) */}
      <PersonalInfoForm />
    </div>
  );
}

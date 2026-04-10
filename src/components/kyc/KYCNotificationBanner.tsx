import { Bell, X } from "lucide-react";
import { useState } from "react";
import useUserStore from "@/store/userStore";

export function KYCNotificationBanner() {
  const user = useUserStore((state) => state.user);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const status = user?.verification_status;
  const isApproved = status === "approved" || status === "verified";

  // Don't show the banner once the user is verified
  if (isApproved) return null;

  const isPending = status === "pending";

  const title = isPending
    ? "Verification under review"
    : "Complete your verification";
  const text = isPending
    ? "Your documents have been submitted and are awaiting review. You'll be notified once your verification is complete."
    : "Complete the steps below to unlock full trading limits and premium features. Your information stays private and secure.";

  return (
    <div className="mx-auto mt-4 max-w-[1280px] px-4 md:px-8">
      <div
        className="relative flex items-center gap-3.5 overflow-hidden rounded-[14px] border-[1.5px] border-[rgba(0,223,162,0.25)] p-[16px_20px]"
        style={{
          background:
            "linear-gradient(145deg,rgba(0,223,162,0.12),rgba(0,223,162,0.04))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[40%] rounded-t-[14px]"
          style={{
            background:
              "linear-gradient(175deg,rgba(255,255,255,0.06),transparent)",
          }}
        />
        <div
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(0,223,162,0.25)] text-[#00dfa2] shadow-[0_4px_12px_rgba(0,223,162,0.2)]"
          style={{
            background:
              "linear-gradient(145deg,rgba(0,223,162,0.3),rgba(0,223,162,0.1))",
          }}
        >
          <Bell className="h-4 w-4" />
        </div>
        <div className="relative flex-1">
          <div className="text-[0.88rem] font-bold text-[#eef2f7]">{title}</div>
          <div className="mt-0.5 text-[0.78rem] leading-[1.5] text-[#8b97a8]">
            {text}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="relative shrink-0 rounded-md p-2 text-[#4a5468] transition-colors hover:bg-white/[0.06] hover:text-[#eef2f7]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

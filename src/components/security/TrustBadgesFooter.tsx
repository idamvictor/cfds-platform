import { Shield } from "lucide-react";

const items = [
  "Enterprise-Grade Encryption",
  "Data encrypted at rest and in transit",
  "Glassmorphism Dark Theme",
];

export function TrustBadgesFooter() {
  return (
    <div
      className="mt-2 rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5"
      style={{
        background:
          "linear-gradient(145deg,rgba(0,223,162,0.04),rgba(255,255,255,0.01))",
      }}
    >
      <div className="mb-3 flex items-center gap-2 text-[0.95rem] font-extrabold text-[#eef2f7]">
        <Shield className="h-4 w-4 text-[#00dfa2]" />
        Security & Trust
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[rgba(0,223,162,0.25)] bg-[rgba(0,223,162,0.08)] px-3 py-1 text-[0.72rem] font-semibold text-[#00dfa2]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

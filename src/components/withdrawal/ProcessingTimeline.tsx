import { Clock, CheckCircle, ShieldCheck } from "lucide-react";

const steps = [
  {
    num: "1",
    title: "Request Submitted",
    desc: "Your withdrawal is queued for admin review.",
    time: "Immediate",
    color: "#00dfa2",
    dimColor: "rgba(0,223,162,0.1)",
    borderColor: "rgba(0,223,162,0.35)",
    icon: <Clock className="h-3 w-3" />,
  },
  {
    num: "2",
    title: "Admin Approval",
    desc: "Team verifies destination address and amount.",
    time: "Within 2–4 hours",
    color: "#c8e64e",
    dimColor: "rgba(200,230,78,0.1)",
    borderColor: "rgba(200,230,78,0.32)",
    icon: <ShieldCheck className="h-3 w-3" />,
  },
  {
    num: "3",
    title: "Crypto Sent",
    desc: "Funds dispatched to your wallet address.",
    time: "Within 24 hours",
    color: "#00dfa2",
    dimColor: "rgba(0,223,162,0.1)",
    borderColor: "rgba(0,223,162,0.35)",
    icon: <CheckCircle className="h-3 w-3" />,
  },
];

export function ProcessingTimeline() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0f1220] p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-white">
        <Clock className="h-4 w-4 text-[#4a5468]" />
        Processing Timeline
      </div>
      <div className="flex flex-col gap-0">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex items-start gap-3 border-b border-white/[0.04] py-3 last:border-b-0"
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold"
              style={{
                background: step.dimColor,
                border: `1.5px solid ${step.borderColor}`,
                color: step.color,
              }}
            >
              {step.num === "3" ? step.icon : step.num}
            </div>
            <div>
              <div className="text-xs text-[#a8b5c8]">
                <strong className="text-white">{step.title}</strong> — {step.desc}
              </div>
              <div className="mt-0.5 text-[11px] text-[#4a5468]">{step.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

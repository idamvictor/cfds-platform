import { Check } from "lucide-react";

export interface KYCStep {
  id: string;
  label: string;
}

interface KYCStepBarProps {
  steps: KYCStep[];
  currentIndex: number; // 0-based
}

export function KYCStepBar({ steps, currentIndex }: KYCStepBarProps) {
  const progress =
    steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="mb-8">
      {/* Track */}
      <div className="relative mb-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg,#00dfa2,#00ffc3)",
          }}
        />
      </div>

      {/* Nodes */}
      <div className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isActive = index === currentIndex;
          return (
            <div
              key={step.id}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] text-[0.78rem] font-bold transition-all ${
                  isComplete
                    ? "border-[#00dfa2] bg-[#00dfa2] text-[#07080c]"
                    : isActive
                      ? "border-[#00dfa2] bg-[rgba(0,223,162,0.1)] text-[#00dfa2] shadow-[0_0_0_4px_rgba(0,223,162,0.1)]"
                      : "border-white/[0.08] bg-white/[0.02] text-[#4a5468]"
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div
                className={`hidden text-center text-[0.7rem] font-semibold transition-colors sm:block ${
                  isActive
                    ? "text-[#eef2f7]"
                    : isComplete
                      ? "text-[#00dfa2]"
                      : "text-[#4a5468]"
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  footnote?: string;
  valueClassName?: string;
  secondaryValue?: string;
  metaValue?: string;
  iconTone?: "green" | "blue" | "violet" | "amber";
}

const iconToneClasses = {
  green: "bg-[rgba(0,223,162,0.1)] text-[#00dfa2]",
  blue: "bg-[rgba(91,141,239,0.1)] text-[#5b8def]",
  violet: "bg-[rgba(240,180,41,0.1)] text-[#F0B429]",
  amber: "bg-[rgba(30,215,96,0.1)] text-[#1ED760]",
};

export function StatCard({
  title,
  value,
  icon,
  footnote,
  valueClassName = "",
  secondaryValue,
  metaValue,
  iconTone = "green",
}: StatCardProps) {
  return (
    <div className="scard relative overflow-hidden rounded-2xl border-[1.5px] border-white/[0.06] bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-[22px_24px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(175deg,rgba(255,255,255,0.03),transparent_40%)]" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#4a5468]">
            {title}
          </div>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[10px] text-[0.82rem]",
              iconToneClasses[iconTone],
            )}
          >
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <div
            className={cn(
              "font-mono text-[1.45rem] font-extrabold tracking-[-0.02em] text-[#eef2f7]",
              valueClassName,
            )}
          >
            {value}
          </div>
          {secondaryValue && (
            <span className="font-mono text-[1.45rem] font-normal text-[#4a5468]">
              {secondaryValue}
            </span>
          )}
        </div>

        {metaValue && (
          <div className="mt-1 text-[0.72rem] text-[#4a5468]">{metaValue}</div>
        )}
        {footnote && (
          <p className="mt-2 text-[0.72rem] text-[#4a5468]">{footnote}</p>
        )}
      </div>
    </div>
  );
}

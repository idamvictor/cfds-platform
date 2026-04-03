import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
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
  green: "bg-emerald-500/12 text-emerald-300 border-emerald-400/10",
  blue: "bg-sky-500/12 text-sky-300 border-sky-400/10",
  violet: "bg-violet-500/12 text-violet-300 border-violet-400/10",
  amber: "bg-amber-500/12 text-amber-300 border-amber-400/10",
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
    <Card className="h-full rounded-[22px] border-white/6 bg-[#0d131d] p-5 text-white shadow-none stat_card">
      <div className="flex h-full flex-col ">
        <div className="mb-8- flex items-start justify-between gap-4">
          <div>
            <h3 className="sub_header font-semibold uppercase  text-[#6f7c92]">
              {title}
            </h3>
          
          </div>

          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl border",
              iconToneClasses[iconTone],
            )}
          >
            {icon}
          </div>
        </div>

        <div className="mt-auto-">
          <div className="flex items-end- gap-2">
            <div className={cn("header font-semibold leading-none text-white", valueClassName)}>
              {value}
            </div>
            {secondaryValue && (
              <div className="pb-1 text-lg font-semibold text-[#56647c]">{secondaryValue}</div>
            )}
          </div>
  {metaValue && (
              <div className="mt-3 inline-flex rounded-md bg-white/4 px-1.5 py-0.5 text-xs font-semibold text-[#7f8ca3]">
                {metaValue}
              </div>
            )}
          {footnote && <p className="mt-3 text-[10px] text-[#5e6b83]">{footnote}</p>}
        </div>
      </div>
    </Card>
  );
}

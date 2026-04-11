import type { ReactNode } from "react";
import { ListOrdered } from "lucide-react";

interface DepositHistoryListCardProps {
  children: ReactNode;
}

export function DepositHistoryListCard({ children }: DepositHistoryListCardProps) {
  return (
    <div className="glass-card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-2">
        <ListOrdered className="h-4 w-4 text-[#00dfa2]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
          Transactions
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {/* Slot: renders the locked <DepositHistory /> untouched */}
      <div className="deposit-history-slot">{children}</div>
    </div>
  );
}

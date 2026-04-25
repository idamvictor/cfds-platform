import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { History, ArrowRight, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────────
// Types — shape mirrors existing /user/deposits and /user/withdrawals
// (already used by deposit-history.tsx and withdrawal-history.tsx).
// We do NOT modify those endpoints; this component only READS them.
// ───────────────────────────────────────────────────────────────

interface RawTransaction {
  id: string;
  amount: string;
  date: string;
  type: string;
  account: string;
  status: string;
  details: string | null;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: RawTransaction[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
  };
}

type TxKind = "deposit" | "withdrawal";

interface MergedTransaction extends RawTransaction {
  kind: TxKind;
  ts: number; // numeric timestamp for sorting
}

type TabKey = "all" | "deposits" | "withdrawals" | "gold";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "deposits", label: "Deposits" },
  { key: "withdrawals", label: "Withdrawals" },
  { key: "gold", label: "Gold" },
];

function parseTs(d: string): number {
  const t = Date.parse(d);
  return Number.isFinite(t) ? t : 0;
}

function statusKey(s: string): "approved" | "rejected" | "pending" {
  const v = (s || "").toLowerCase();
  if (v === "approved" || v === "completed") return "approved";
  if (v === "rejected" || v === "failed" || v === "declined") return "rejected";
  return "pending";
}

function statusLabel(s: string): string {
  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function avatarColorFor(kind: TxKind, account: string): string {
  if (kind === "deposit") return "#3b82f6";
  if ((account || "").toLowerCase().includes("crypto")) return "#f7931a";
  if ((account || "").toLowerCase().includes("wire")) return "#627eea";
  return "#f59e0b";
}

function avatarLetter(kind: TxKind): string {
  return kind === "deposit" ? "D" : "W";
}

export function WalletTransactionHistory() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [deposits, setDeposits] = useState<RawTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<RawTransaction[]>([]);
  const [isLoadingD, setIsLoadingD] = useState(true);
  const [isLoadingW, setIsLoadingW] = useState(true);
  const [errorD, setErrorD] = useState<string | null>(null);
  const [errorW, setErrorW] = useState<string | null>(null);

  // Read-only fetches from existing endpoints. Same calls used by
  // deposit-history.tsx / withdrawal-history.tsx — no new API.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosInstance.get<ApiResponse>("/user/deposits");
        if (!cancelled) {
          setDeposits(res.data?.data?.data ?? []);
          setErrorD(null);
        }
      } catch {
        if (!cancelled) setErrorD("Failed to load deposits");
      } finally {
        if (!cancelled) setIsLoadingD(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosInstance.get<ApiResponse>("/user/withdrawals");
        if (!cancelled) {
          setWithdrawals(res.data?.data?.data ?? []);
          setErrorW(null);
        }
      } catch {
        if (!cancelled) setErrorW("Failed to load withdrawals");
      } finally {
        if (!cancelled) setIsLoadingW(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const merged: MergedTransaction[] = useMemo(() => {
    const d: MergedTransaction[] = deposits.map((t) => ({
      ...t,
      kind: "deposit",
      ts: parseTs(t.date),
    }));
    const w: MergedTransaction[] = withdrawals.map((t) => ({
      ...t,
      kind: "withdrawal",
      ts: parseTs(t.date),
    }));
    return [...d, ...w].sort((a, b) => b.ts - a.ts);
  }, [deposits, withdrawals]);

  const visibleRows: MergedTransaction[] = useMemo(() => {
    if (activeTab === "deposits") return merged.filter((m) => m.kind === "deposit");
    if (activeTab === "withdrawals")
      return merged.filter((m) => m.kind === "withdrawal");
    if (activeTab === "gold") return [];
    return merged;
  }, [merged, activeTab]);

  const isLoading = activeTab === "gold"
    ? false
    : activeTab === "deposits"
      ? isLoadingD
      : activeTab === "withdrawals"
        ? isLoadingW
        : isLoadingD || isLoadingW;

  const error = activeTab === "gold"
    ? null
    : activeTab === "deposits"
      ? errorD
      : activeTab === "withdrawals"
        ? errorW
        : errorD && errorW
          ? "Failed to load transactions"
          : null;

  const showEmpty = !isLoading && !error && visibleRows.length === 0;

  return (
    <div
      className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="flex items-center gap-2.5">
          <History className="h-4 w-4 text-[#00dfa2]" />
          <span className="text-[0.95rem] font-extrabold text-[#eef2f7]">
            Transaction history
          </span>
        </div>
        <div
          role="tablist"
          aria-label="Transaction filter"
          className="flex flex-wrap gap-1.5 sm:gap-2"
        >
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[11px] font-bold transition-colors",
                  active
                    ? "bg-[#00dfa2] text-[#07080c]"
                    : "bg-[rgba(255,255,255,0.04)] text-[#8b97a8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#eef2f7]"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 md:p-4">
        {isLoading && (
          <div className="px-2 py-12 text-center text-sm text-[#8b97a8]">
            Loading transactions…
          </div>
        )}

        {!isLoading && error && (
          <div className="px-2 py-12 text-center text-sm text-[#f43f5e]">
            {error}
          </div>
        )}

        {!isLoading && !error && activeTab === "gold" && (
          <div className="px-4 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(240,180,41,0.1)] text-[#F0B429]">
              <Coins className="h-5 w-5" />
            </div>
            <div className="mb-1 text-[0.95rem] font-extrabold text-[#eef2f7]">
              No gold transactions yet
            </div>
            <div className="mx-auto max-w-[420px] text-[0.82rem] text-[#8b97a8]">
              When you place a physical gold order, it will appear here with
              full delivery and serial-number tracking.
            </div>
          </div>
        )}

        {showEmpty && activeTab !== "gold" && (
          <div className="px-2 py-12 text-center text-sm text-[#8b97a8]">
            No transactions found.
          </div>
        )}

        {!isLoading && !error && visibleRows.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                      Asset
                    </th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                      Account
                    </th>
                    <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                      Date
                    </th>
                    <th className="px-3 py-2 text-right text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((tx) => {
                    const sk = statusKey(tx.status);
                    return (
                      <tr
                        key={`${tx.kind}-${tx.id}`}
                        className="border-t border-white/[0.04] text-[0.82rem]"
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                              style={{
                                background: avatarColorFor(tx.kind, tx.account),
                              }}
                            >
                              {avatarLetter(tx.kind)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium capitalize text-[#eef2f7]">
                                {tx.kind === "deposit" ? "Deposit" : "Withdrawal"}
                              </span>
                              <span className="text-[0.7rem] capitalize text-[#4a5468]">
                                {tx.account || "—"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[0.7rem] font-bold",
                              tx.kind === "deposit"
                                ? "bg-[rgba(59,130,246,0.12)] text-[#3b82f6]"
                                : "bg-[rgba(245,158,11,0.12)] text-[#f59e0b]"
                            )}
                          >
                            {tx.kind === "deposit" ? "Deposit" : "Withdraw"}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[0.78rem] text-[#eef2f7]">
                          {tx.amount}
                        </td>
                        <td className="px-3 py-3 capitalize text-[#8b97a8]">
                          {tx.type || "—"}
                        </td>
                        <td className="px-3 py-3 text-[#8b97a8]">{tx.date}</td>
                        <td className="px-3 py-3 text-right">
                          <span
                            className={cn(
                              "rounded px-2 py-1 text-[0.7rem] font-bold",
                              sk === "approved"
                                ? "bg-[rgba(0,223,162,0.1)] text-[#00dfa2]"
                                : sk === "rejected"
                                  ? "bg-[rgba(244,63,94,0.1)] text-[#f43f5e]"
                                  : "bg-[rgba(240,180,41,0.1)] text-[#F0B429]"
                            )}
                          >
                            {statusLabel(tx.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-2.5 md:hidden">
              {visibleRows.map((tx) => {
                const sk = statusKey(tx.status);
                return (
                  <div
                    key={`m-${tx.kind}-${tx.id}`}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                          style={{
                            background: avatarColorFor(tx.kind, tx.account),
                          }}
                        >
                          {avatarLetter(tx.kind)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.85rem] font-medium text-[#eef2f7]">
                            {tx.kind === "deposit" ? "Deposit" : "Withdrawal"}
                          </span>
                          <span className="text-[0.7rem] capitalize text-[#4a5468]">
                            {tx.account || "—"}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "rounded px-2 py-1 text-[0.65rem] font-bold",
                          sk === "approved"
                            ? "bg-[rgba(0,223,162,0.1)] text-[#00dfa2]"
                            : sk === "rejected"
                              ? "bg-[rgba(244,63,94,0.1)] text-[#f43f5e]"
                              : "bg-[rgba(240,180,41,0.1)] text-[#F0B429]"
                        )}
                      >
                        {statusLabel(tx.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-white/[0.04] pt-2 text-[0.78rem]">
                      <div className="text-[#4a5468]">Amount</div>
                      <div className="text-right font-mono text-[#eef2f7]">
                        {tx.amount}
                      </div>
                      <div className="text-[#4a5468]">Type</div>
                      <div className="text-right capitalize text-[#8b97a8]">
                        {tx.type || "—"}
                      </div>
                      <div className="text-[#4a5468]">Date</div>
                      <div className="text-right text-[#8b97a8]">{tx.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer link to full deposit history page (real route) */}
      <div className="border-t border-white/[0.06] px-5 py-3 text-center md:px-6">
        <Link
          to="/main/deposit-history"
          className="inline-flex items-center gap-1 text-[0.78rem] font-bold text-[#00dfa2] transition-colors hover:text-[#00ffc3]"
        >
          View all transactions
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default WalletTransactionHistory;

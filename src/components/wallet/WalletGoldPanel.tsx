import { Coins, Lock, BadgeCheck, Truck } from "lucide-react";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";

const ELITE_THRESHOLD = 100000;

const GOLD_SPECS: Array<{ label: string; value: string; sub: string }> = [
  {
    label: "Purity",
    value: "999.9 Fine Gold",
    sub: "LBMA London certified",
  },
  {
    label: "Refinery",
    value: "PAMP Suisse",
    sub: "Swiss-assay hallmark",
  },
  {
    label: "Current Spot Price",
    value: "$2,018 / oz",
    sub: "Updated live",
  },
  {
    label: "Delivery",
    value: "7 — 14 Business Days",
    sub: "Insured, tracked worldwide",
  },
];

const DELIVERY_STEPS: Array<{ title: string; desc: string }> = [
  {
    title: "Order Placed",
    desc: "Funds deducted, order forwarded to our Swiss vault partner.",
  },
  {
    title: "Compliance Review",
    desc: "FINMA anti-money-laundering review — completed within 24h.",
  },
  {
    title: "Bar Allocated & Sealed",
    desc: "Your specific bar is allocated with serial number and assay certificate.",
  },
  {
    title: "Brinks Insured Dispatch",
    desc: "Shipped via Brinks Global Services with full insurance and tracking.",
  },
  {
    title: "Signature Delivery",
    desc: "Delivered to your address, signature required upon receipt.",
  },
];

export function WalletGoldPanel() {
  const user = useUserStore((state) => state.user);
  const { formatCurrency } = useCurrency();
  const balance = user?.balance || 0;
  const isElite = balance >= ELITE_THRESHOLD;
  const progressPct = Math.min(100, (balance / ELITE_THRESHOLD) * 100);

  if (!isElite) {
    return (
      <div
        className="rounded-2xl border-[1.5px] border-dashed border-[rgba(0,223,162,0.3)] p-7 text-center"
        style={{
          background:
            "linear-gradient(135deg,rgba(0,223,162,0.04),rgba(0,223,162,0.02))",
        }}
      >
        <div
          className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[rgba(0,223,162,0.3)]"
          style={{ background: "rgba(0,223,162,0.1)" }}
        >
          <Lock className="h-5 w-5 text-[#00dfa2]" />
        </div>
        <div className="mb-2 text-[1.05rem] font-extrabold text-[#00ffc3]">
          Physical Gold Withdrawals — Elite Only
        </div>
        <div className="mx-auto mb-4 max-w-[380px] text-[0.83rem] leading-[1.75] text-[#4a5468]">
          Physical gold bar withdrawals are available exclusively to Elite
          members with an account balance of at least{" "}
          {formatCurrency(ELITE_THRESHOLD)}. Delivered insured to your door
          worldwide.
        </div>
        <div className="mx-auto max-w-[380px] rounded-lg bg-[rgba(255,255,255,0.06)] px-[18px] py-[14px] text-left">
          <div className="mb-1.5 flex justify-between text-[0.78rem]">
            <span className="text-[#4a5468]">Current Balance</span>
            <span className="font-mono font-bold text-[#00ffc3]">
              {formatCurrency(balance)}
            </span>
          </div>
          <div className="mb-1.5 flex justify-between text-[0.78rem]">
            <span className="text-[#4a5468]">Elite Threshold</span>
            <span className="font-mono font-bold text-[#00ffc3]">
              {formatCurrency(ELITE_THRESHOLD)}
            </span>
          </div>
          <div className="h-[7px] overflow-hidden rounded bg-[rgba(255,255,255,0.08)]">
            <div
              className="h-full rounded"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg,#00dfa2,#00ffc3)",
                transition: "width .8s",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(0,223,162,0.3)] p-7"
      style={{
        background:
          "linear-gradient(145deg,rgba(0,223,162,0.08),rgba(0,223,162,0.04))",
      }}
    >
      <div
        className="pointer-events-none absolute -right-[60px] -top-[60px] h-[200px] w-[200px]"
        style={{
          background:
            "radial-gradient(circle,rgba(0,223,162,0.1),transparent 65%)",
        }}
      />
      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 border-b border-[rgba(0,223,162,0.3)] pb-5">
          <div
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] text-[1.3rem] shadow-[0_6px_20px_rgba(0,223,162,0.35)]"
            style={{
              background: "linear-gradient(135deg,#00dfa2,#00ffc3)",
              color: "#060A14",
            }}
          >
            <Coins className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-[1.1rem] font-extrabold tracking-[-0.02em] text-[#00ffc3]">
              Physical Gold Bar Withdrawal
            </div>
            <div className="mt-0.5 text-[0.78rem] text-[#4a5468]">
              LBMA-certified 999.9 fine gold, insured worldwide delivery
            </div>
          </div>
          <div
            className="shrink-0 rounded-full px-3 py-1.5 text-[0.7rem] font-extrabold"
            style={{
              background: "linear-gradient(135deg,#00dfa2,#00ffc3)",
              color: "#060A14",
            }}
          >
            Elite Only
          </div>
        </div>

        {/* Spec grid */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GOLD_SPECS.map((spec) => (
            <div
              key={spec.label}
              className="rounded-[10px] border border-[rgba(0,223,162,0.3)] p-[14px]"
              style={{ background: "rgba(7,12,24,0.4)" }}
            >
              <div className="mb-[5px] text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#00dfa2]">
                {spec.label}
              </div>
              <div className="text-[0.95rem] font-bold text-[#eef2f7]">
                {spec.value}
              </div>
              <div className="mt-0.5 text-[0.72rem] text-[#3a4556]">
                {spec.sub}
              </div>
            </div>
          ))}
        </div>

        {/* KYC notice */}
        <div
          className="mb-6 flex items-start gap-3 rounded-[10px] border border-[rgba(0,223,162,0.3)] px-4 py-3"
          style={{ background: "rgba(0,223,162,0.1)" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[#00dfa2]"
            style={{ background: "rgba(0,223,162,0.12)" }}
          >
            <BadgeCheck className="h-[0.9rem] w-[0.9rem]" />
          </div>
          <div className="text-[0.78rem] leading-[1.65] text-[#8b97a8]">
            Gold delivery requires a verified KYC Level 3 account and a
            confirmed postal address. Please contact support to initiate a gold
            delivery request once your details are up to date.
          </div>
        </div>

        {/* Delivery steps */}
        <div className="mb-2 flex items-center gap-2 text-[0.82rem] font-extrabold text-[#eef2f7]">
          <Truck className="h-[0.9rem] w-[0.9rem] text-[#00dfa2]" />
          Delivery Process
        </div>
        <div className="flex flex-col">
          {DELIVERY_STEPS.map((s, i) => (
            <div key={s.title} className="relative flex gap-3.5 py-3">
              {i < DELIVERY_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-4 top-10 bottom-0 w-[1.5px]"
                  style={{ background: "rgba(0,223,162,0.3)" }}
                />
              )}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(0,223,162,0.3)] text-[0.75rem] font-extrabold text-[#00ffc3]"
                style={{ background: "rgba(0,223,162,0.1)" }}
              >
                {i + 1}
              </div>
              <div>
                <div className="text-[0.87rem] font-bold text-[#eef2f7]">
                  {s.title}
                </div>
                <div className="text-[0.75rem] leading-[1.6] text-[#3a4556]">
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

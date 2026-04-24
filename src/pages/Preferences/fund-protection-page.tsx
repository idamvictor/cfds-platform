import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TickerBar } from "@/components/dashboard/TickerBar";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";
import {
  ShieldHalf,
  Lock,
  Coins,
  Building2,
  UserRound,
  Database,
  BadgeCheck,
  FileText,
  Snowflake,
  Landmark,
  Search,
  UserCog,
  Fingerprint,
  Building,
  LineChart,
  Calculator,
  Percent,
  TrendingDown,
  ListChecks,
  Scale,
  Banknote,
  SlidersHorizontal,
  TriangleAlert,
  Vault,
  Clock,
  Eye,
  CalendarCheck,
  Ban,
  CircleCheck,
  CircleX,
  Handshake,
  Cpu,
  ArrowRight,
  Key,
  ShieldAlert,
  Smartphone,
  Network,
  Flag,
  ClipboardList,
  Plus,
  UserPlus,
  Crown,
  HelpCircle,
  Globe,
  Target,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────
// STATIC CONTENT (presentational only — from html_files/fund-protection.html)
// ───────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { icon: Coins, tone: "gold", val: "$1,000,000", lab: "Enhanced Insurance" },
  { icon: Building2, tone: "green", val: "100%", lab: "Funds Segregated" },
  { icon: UserRound, tone: "red", val: "$20M+", lab: "Min. Manager Bond" },
  { icon: Database, tone: "blue", val: "98%", lab: "Cold Storage" },
  { icon: BadgeCheck, tone: "gold", val: "FINMA", lab: "Regulated Entity" },
] as const;

const PILLARS = [
  {
    tone: "gold",
    icon: FileText,
    title: "Enhanced Insurance Coverage",
    body: "1 Trade Market has purchased separate insurance protection covering losses in excess of $10,000 up to $1,000,000 per client in the event of insolvency, at no direct cost to clients.",
    statIcon: Coins,
    stat: "Up to $1,000,000 per client",
  },
  {
    tone: "green",
    icon: Building2,
    title: "Ring-Fenced Segregated Accounts",
    body: "All client accounts are legally ring-fenced from company operating funds, held in segregated accounts with internationally recognised Tier-1 financial institutions. Company insolvency cannot affect client assets.",
    statIcon: CircleCheck,
    stat: "Fully Ring-Fenced",
  },
  {
    tone: "red",
    icon: UserCog,
    title: "Vetted Fund Manager Bonds",
    body: "All fund managers operating on our platform must post a mandatory security deposit of $20M–$500M before managing any client capital. This bond is locked for the duration of their engagement.",
    statIcon: Lock,
    stat: "$20M–$500M Security Deposit",
  },
  {
    tone: "blue",
    icon: Snowflake,
    title: "Cold Storage Asset Custody",
    body: "98% of all digital assets are held in air-gapped, hardware-secured cold storage facilities with multi-signature approval requirements and geographically distributed backups.",
    statIcon: Database,
    stat: "98% Cold Storage",
  },
  {
    tone: "navy",
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    body: "1 Trade Market is fully compliant with FINMA (Financial Market Supervisory Authority) guidelines, International Anti-Money Laundering laws, and international FATF standards.",
    statIcon: Landmark,
    stat: "FINMA Regulated",
  },
  {
    tone: "purple",
    icon: Search,
    title: "Independent Quarterly Audits",
    body: "An independent Big Four audit firm conducts quarterly financial and security audits. Audit reports are published on our transparency portal for all clients to verify.",
    statIcon: CalendarCheck,
    stat: "Quarterly Audits",
  },
] as const;

type Tone = "red" | "gold" | "green" | "blue" | "navy" | "purple";

const TONE_STYLES: Record<
  Tone,
  { bg: string; color: string; border: string; cardBorder: string }
> = {
  red: {
    bg: "rgba(200, 230, 78, 0.1)",
    color: "#c8e64e",
    border: "1px solid rgba(200, 230, 78, 0.25)",
    cardBorder: "rgba(200, 230, 78, 0.2)",
  },
  gold: {
    bg: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    cardBorder: "rgba(59, 130, 246, 0.2)",
  },
  green: {
    bg: "rgba(0, 223, 162, 0.1)",
    color: "#00dfa2",
    border: "1px solid rgba(0, 223, 162, 0.25)",
    cardBorder: "rgba(0, 223, 162, 0.2)",
  },
  blue: {
    bg: "rgba(168, 85, 247, 0.1)",
    color: "#a855f7",
    border: "1px solid rgba(168, 85, 247, 0.25)",
    cardBorder: "rgba(168, 85, 247, 0.2)",
  },
  navy: {
    bg: "rgba(236, 72, 153, 0.1)",
    color: "#ec4899",
    border: "1px solid rgba(236, 72, 153, 0.25)",
    cardBorder: "rgba(236, 72, 153, 0.2)",
  },
  purple: {
    bg: "rgba(240, 180, 41, 0.1)",
    color: "#f0b429",
    border: "1px solid rgba(240, 180, 41, 0.25)",
    cardBorder: "rgba(240, 180, 41, 0.2)",
  },
};

type TagTone = "default" | "red" | "gold" | "green";

const VETTING_STEPS: {
  num: string;
  title: string;
  body: string;
  tags: { icon: React.ElementType; label: string; tone: TagTone }[];
}[] = [
  {
    num: "01",
    title: "Initial Application & Identity Verification",
    body: "Prospective managers submit a detailed application including entity registration documents, regulatory licences, and personal identification for all principals. Full KYB (Know Your Business) and KYC verification is conducted through our Swiss-grade compliance partner.",
    tags: [
      { icon: Fingerprint, label: "Government ID", tone: "red" },
      { icon: Building, label: "Entity Docs", tone: "default" },
      { icon: BadgeCheck, label: "Regulatory Licence", tone: "default" },
    ],
  },
  {
    num: "02",
    title: "Track Record & Performance Audit",
    body: "A minimum 3-year verifiable trading history is required. We review audited performance reports, Sharpe ratio, maximum drawdown, risk-adjusted returns, and trading strategy documentation. All performance claims are independently verified by our risk committee.",
    tags: [
      { icon: LineChart, label: "3-Year History", tone: "gold" },
      { icon: Calculator, label: "Audited P&L", tone: "default" },
      { icon: Percent, label: "Sharpe Ratio ≥ 1.2", tone: "default" },
      { icon: TrendingDown, label: "Max Drawdown ≤ 20%", tone: "default" },
    ],
  },
  {
    num: "03",
    title: "AML, Sanctions & Background Screening",
    body: "Comprehensive background screening across international watchlists including OFAC, EU Sanctions, UN Sanctions, and Interpol databases. Full Anti-Money Laundering (AML) check and source of funds verification for all principals and beneficial owners.",
    tags: [
      { icon: ListChecks, label: "OFAC / EU Sanctions", tone: "default" },
      { icon: Scale, label: "AML Clearance", tone: "default" },
      { icon: Banknote, label: "Source of Funds", tone: "default" },
    ],
  },
  {
    num: "04",
    title: "Risk Assessment & Strategy Evaluation",
    body: "The manager's trading strategy is evaluated by our internal risk committee. Leverage limits, position concentration rules, stop-loss protocols, and risk management frameworks are reviewed. Managers must demonstrate compliance with our investor protection mandate.",
    tags: [
      { icon: ShieldHalf, label: "Risk Framework", tone: "red" },
      { icon: SlidersHorizontal, label: "Leverage Limits", tone: "default" },
      { icon: TriangleAlert, label: "Stop-Loss Rules", tone: "default" },
    ],
  },
  {
    num: "05",
    title: "Mandatory Security Deposit Lodgement",
    body: "Approved managers must post a mandatory, locked security deposit scaled to the total Assets Under Management (AUM) they intend to manage. This deposit acts as a performance bond and investor protection mechanism. The deposit is held in a segregated trust account and cannot be accessed during the management period.",
    tags: [
      { icon: Lock, label: "$20M–$500M Deposit", tone: "gold" },
      { icon: Vault, label: "Locked in Trust", tone: "green" },
      { icon: Clock, label: "Duration-Locked", tone: "default" },
    ],
  },
  {
    num: "06",
    title: "Ongoing Monitoring & Annual Re-vetting",
    body: "Approved managers are subject to real-time trade monitoring, monthly performance reviews, and full re-vetting on an annual basis. Any breach of risk parameters, unusual trading patterns, or compliance failures triggers immediate suspension and investigation.",
    tags: [
      { icon: Eye, label: "Real-Time Monitoring", tone: "default" },
      { icon: CalendarCheck, label: "Annual Re-Vetting", tone: "gold" },
      { icon: Ban, label: "Instant Suspension", tone: "red" },
    ],
  },
];

const TAG_TONE_STYLES: Record<
  TagTone,
  { bg: string; border: string; color: string }
> = {
  default: {
    bg: "rgba(255, 255, 255, 0.02)",
    border: "rgba(255, 255, 255, 0.08)",
    color: "#4a5468",
  },
  red: {
    bg: "rgba(200, 230, 78, 0.1)",
    border: "rgba(200, 230, 78, 0.25)",
    color: "#c8e64e",
  },
  gold: {
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.25)",
    color: "#3b82f6",
  },
  green: {
    bg: "rgba(0, 223, 162, 0.1)",
    border: "rgba(0, 223, 162, 0.25)",
    color: "#00dfa2",
  },
};

const DEPOSIT_TIERS = [
  {
    label: "AUM: Up to $50M",
    amount: "$20,000,000",
    fill: 4,
    note: "Minimum deposit for all managers · Entry Tier",
  },
  {
    label: "AUM: $50M – $150M",
    amount: "$50,000,000",
    fill: 10,
    note: "Growth tier · Enhanced monitoring active",
  },
  {
    label: "AUM: $150M – $500M",
    amount: "$100,000,000",
    fill: 20,
    note: "Mid-tier · Dedicated compliance officer assigned",
  },
  {
    label: "AUM: $500M – $2B",
    amount: "$200,000,000",
    fill: 40,
    note: "Institutional tier · Quarterly board review",
  },
  {
    label: "AUM: $2B – $5B",
    amount: "$350,000,000",
    fill: 70,
    note: "Tier 1 · Independent custodian required",
  },
  {
    label: "AUM: $5B+",
    amount: "$500,000,000",
    fill: 100,
    note: "Maximum tier · Sovereign-grade oversight",
  },
];

const INSURANCE_FEATURES_PRIMARY = [
  { plain: "Covers insolvency-related losses above ", strong: "$10,000", tail: "" },
  { plain: "Maximum protection of ", strong: "$1,000,000 per client account", tail: "" },
  { plain: "Underwritten by ", strong: "Lloyd's of London", tail: " syndicates" },
  { plain: "", strong: "Zero cost", tail: " to clients, fully funded by 1 Trade Market" },
  { plain: "Coverage applies to ", strong: "all client account types", tail: " including Retirement Staking™" },
  { plain: "Claims processed within ", strong: "30 business days", tail: " of verified event" },
];

const CLAIMS_FEATURES = [
  "Automatic claim initiation",
  "48-hour client notification",
  "Dedicated claims case manager",
  "Settlement within 30 business days",
];

const COVERED_FEATURES = [
  { strong: "Cash balances", tail: ", USD, EUR, CHF" },
  { strong: "Digital assets", tail: ", BTC, ETH, and all supported cryptos" },
  { strong: "Retirement Staking™ accounts", tail: ", crypto holdings" },
  { strong: "Staking rewards", tail: ", accrued but unclaimed" },
];

const NOT_COVERED_FEATURES = [
  "Trading losses from market movements",
  "Losses from client's own negligence (e.g. sharing credentials)",
  "Fund manager performance losses",
  "Losses from unauthorised third-party access due to client error",
];

const SEG_GUARANTEES = [
  {
    icon: Scale,
    title: "Legal Protection",
    body: "Under Swiss law, segregated client assets cannot be used to satisfy claims by 1 Trade Market's creditors in the event of insolvency.",
  },
  {
    icon: Handshake,
    title: "Institutional Partners",
    body: "Client funds are held at Tier-1 banks and custodians including UBS, Julius Bär, Deutsche Bank, and HSBC, all FINMA-regulated entities.",
  },
  {
    icon: Eye,
    title: "Daily Reconciliation",
    body: "An independent reconciliation agent verifies that total client liabilities match segregated account balances every 24 hours.",
  },
  {
    icon: Target,
    title: "Immediate Return Guarantee",
    body: "If 1 Trade Market were to cease operations, segregated client funds would be returned directly to clients without any prior satisfaction of company debts.",
  },
  {
    icon: Globe,
    title: "International Custody",
    body: "Crypto assets are held under institutional custody across multiple jurisdictions including Switzerland, Singapore, and the Cayman Islands to reduce systemic risk.",
  },
  {
    icon: Search,
    title: "Client Verification Portal",
    body: "All clients can independently verify their segregated account balance and custody status at any time through our real-time transparency portal.",
  },
];

const INFRA_ITEMS = [
  {
    icon: Snowflake,
    color: "#00dfa2",
    title: "Cold Storage Vault System",
    body: "98% of all digital assets are stored in air-gapped hardware security modules (HSMs) with no internet connectivity. Physical vaults are located in Swiss mountain facilities with biometric access controls.",
    spec: "AES-256 · Multi-Sig 3-of-5 · HSM Level 3",
  },
  {
    icon: Key,
    color: "#3b82f6",
    title: "Multi-Signature Authorization",
    body: "All withdrawals above $10,000 require multi-signature approval from geographically separated key holders. No single employee can authorise or execute large transfers alone.",
    spec: "3-of-5 Multi-Sig · HSM Protected · Geo-Distributed",
  },
  {
    icon: Lock,
    color: "#a855f7",
    title: "End-to-End Encryption",
    body: "All client data and communications are encrypted using TLS 1.3 in transit and AES-256 at rest. Our cryptographic standards exceed NIST SP 800-57 recommendations.",
    spec: "TLS 1.3 · AES-256 · NIST SP 800-57",
  },
  {
    icon: ShieldAlert,
    color: "#ec4899",
    title: "Real-Time Threat Detection",
    body: "AI-powered intrusion detection systems monitor all network traffic 24/7. Anomalous patterns trigger automatic account locks and security team alerts within seconds.",
    spec: "ML-Based IDS · <2s Response Time · 24/7/365",
  },
  {
    icon: Smartphone,
    color: "#c8e64e",
    title: "Mandatory Two-Factor Authentication",
    body: "All accounts require 2FA via hardware security keys (FIDO2/WebAuthn), TOTP authenticator apps, or biometric verification. SMS-only 2FA is not permitted for high-value accounts.",
    spec: "FIDO2 / WebAuthn · TOTP · Biometric",
  },
  {
    icon: Network,
    color: "#f0b429",
    title: "Distributed Infrastructure",
    body: "Platform infrastructure is distributed across 5 data centres in Zurich, Frankfurt, Singapore, New York, and Tokyo, ensuring 99.99% uptime and resilience against regional failures.",
    spec: "99.99% SLA · 5-Region · Active-Active",
  },
];

const PARTNERS = [
  {
    abbr: "UBS",
    name: "UBS Group AG",
    type: "Custody · Cash Clearing",
    badge: "FINMA Regulated",
  },
  {
    abbr: "JB",
    name: "Julius Bär",
    type: "Private Banking · Custody",
    badge: "FINMA Regulated",
  },
  {
    abbr: "DB",
    name: "Deutsche Bank",
    type: "Correspondent Banking",
    badge: "BaFin Regulated",
  },
  {
    abbr: "HSBC",
    name: "HSBC Holdings",
    type: "International Clearing",
    badge: "FCA Regulated",
  },
  {
    abbr: "BC",
    name: "BitGo Custody",
    type: "Digital Asset Custody",
    badge: "$250M Insured",
  },
  {
    abbr: "FF",
    name: "Fireblocks",
    type: "Crypto Infrastructure",
    badge: "MPC-CMP Secured",
  },
];

const COMPLIANCE_ITEMS = [
  { strong: "FINMA Authorisation", tail: ", Licensed as a FinTech company under Art. 1b BankA" },
  { strong: "AMLA Compliance", tail: ", Full International Anti-Money Laundering Act compliance with FINMA-supervised SRO membership" },
  { strong: "FIDLEG / FinSA", tail: ", Compliant with Swiss Financial Services Act client protection requirements" },
  { strong: "DLT Act 2021", tail: ", Registered under Switzerland's blockchain-specific regulatory framework" },
  { strong: "FATF Compliance", tail: ", Full Travel Rule implementation and VASP registration" },
  { strong: "GDPR / nDSG", tail: ", Swiss Data Protection Act compliant with EU GDPR equivalency" },
];

type AuditStatus = "passed" | "current" | "pending";

const AUDIT_ITEMS: {
  dot: "green" | "gold";
  title: string;
  detail: string;
  status: AuditStatus;
  statusLabel: string;
}[] = [
  {
    dot: "green",
    title: "Q1 2026 Financial Audit, PwC Switzerland",
    detail: "Full balance sheet and segregated accounts verification",
    status: "passed",
    statusLabel: "Passed",
  },
  {
    dot: "green",
    title: "ISO/IEC 27001:2022 Certification",
    detail: "Information Security Management System, Bureau Veritas",
    status: "passed",
    statusLabel: "Certified",
  },
  {
    dot: "gold",
    title: "SOC 2 Type II Report, Deloitte",
    detail: "Security, Availability, Confidentiality assessment, Q2 2026",
    status: "current",
    statusLabel: "In Progress",
  },
  {
    dot: "green",
    title: "FINMA Supervisory Review 2025",
    detail: "On-site inspection, full regulatory compliance confirmed",
    status: "passed",
    statusLabel: "Passed",
  },
  {
    dot: "green",
    title: "Penetration Testing, NCC Group",
    detail: "Black-box and white-box security penetration test",
    status: "passed",
    statusLabel: "Passed",
  },
  {
    dot: "gold",
    title: "Smart Contract Audit, CertiK",
    detail: "Full audit of on-chain contracts and custody logic, Q3 2026",
    status: "pending",
    statusLabel: "Scheduled",
  },
];

const FAQS = [
  {
    q: "What happens to my funds if 1 Trade Market becomes insolvent?",
    a: "Your funds are held in legally segregated accounts entirely separate from 1 Trade Market's company assets. Under Swiss law, these cannot be used to satisfy company debts. Additionally, our enhanced insurance policy covers losses above $10,000 up to $1,000,000 per client, meaning your capital is protected even in the worst-case scenario.",
  },
  {
    q: "How is the fund manager security deposit used to protect me?",
    a: "Every fund manager must post a mandatory security deposit (between $20M and $500M depending on their AUM) before managing any client capital. This deposit is held in a locked trust account. If a manager engages in misconduct, fraud, or causes losses due to negligence, this deposit is liquidated first to compensate affected investors, before any other recourse is taken.",
  },
  {
    q: "What qualifications does a fund manager need to be approved?",
    a: "Managers must complete a 6-stage vetting process: identity and entity verification, a 3-year audited track record, AML/sanctions screening, risk framework evaluation, security deposit lodgement, and ongoing monitoring. We require a minimum Sharpe ratio of 1.2, maximum drawdown of 20%, and a valid regulatory licence in their home jurisdiction.",
  },
  {
    q: "Can I verify where my funds are held?",
    a: "Yes. All clients have access to our real-time Transparency Portal, which shows the total balance held in segregated accounts at each custodian institution, reconciled daily by an independent agent. You can log in at any time and verify that your account balance is fully represented in our segregated holdings.",
  },
  {
    q: "Is my insurance coverage automatic or do I need to register?",
    a: "Insurance coverage is automatic for all registered clients, there is no separate registration or opt-in required. Coverage applies from the moment your account is verified and active. The policy is maintained by 1 Trade Market at no cost to you, and applies to all account types including standard trading accounts and Retirement Staking™ accounts.",
  },
  {
    q: "How do I revoke a fund manager's access to my account?",
    a: "You can revoke a fund manager's access at any time, instantly, from the Trade Access page in your dashboard. The revocation takes effect immediately, the manager loses all access and cannot place any further trades. Any open positions remain yours to manage, and a full audit log of all activity during the managed period is available for download.",
  },
];

const FOOTER_LINKS = [
  { label: "Home", to: "/main/dashboard" },
  { label: "Dashboard", to: "/main/dashboard" },
  { label: "Wallet", to: "/main/wallet" },
  { label: "Fund Managers", to: "/main/fund-managers" },
  { label: "KYC / Onboarding", to: "/main/kyc" },
  { label: "Security", to: "/main/security" },
  { label: "Trade Access", to: "/main/trade-access" },
  { label: "Trading Plans", to: "/main/trading-plans" },
  { label: "Fund Protection", to: "/main/fund-protection" },
];

// Reference-style navbar items. Only real existing routes are included.
// "Retirement Staking™" is omitted (no equivalent route in this workspace).
const NAV_LINKS = [
  { label: "Dashboard", to: "/main/dashboard" },
  { label: "Markets", to: "/main/market" },
  { label: "Wallet", to: "/main/wallet" },
  { label: "Fund Managers", to: "/main/fund-managers" },
  { label: "Trade Access", to: "/main/trade-access" },
  { label: "Trading Plans", to: "/main/trading-plans" },
  { label: "Fund Protection", to: "/main/fund-protection" },
];

// Shared motion config — subtle 250ms fade + rise triggered by viewport
const revealProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

// ───────────────────────────────────────────────────────────────
// PAGE
// ───────────────────────────────────────────────────────────────

export default function FundProtectionPage() {
  const [openFaq, setOpenFaq] = useState(0);

  // Read-only: avatar initials + brand name (no mutations)
  const user = useUserStore((state) => state.user);
  const settings = useSiteSettingsStore((state) => state.settings);
  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "JD";
  const brandName = settings?.name || "1 Trade Market";

  // Hide MainLayout chrome while this page is mounted — scoped body class,
  // same pattern used by trade-access-page.tsx. Cleaned up on unmount.
  useEffect(() => {
    document.body.classList.add("fp-active");
    return () => {
      document.body.classList.remove("fp-active");
    };
  }, []);

  // Load reference fonts (Outfit + Inter + JetBrains Mono) for visual accuracy.
  // Scoped to this page — removed on unmount.
  useEffect(() => {
    if (document.querySelector<HTMLLinkElement>('link[data-fp-fonts="1"]'))
      return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    link.dataset.fpFonts = "1";
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <div
      className="fp-root w-full"
      style={{
        background: "linear-gradient(135deg, #07080c 0%, #0a0d15 100%)",
        color: "#eef2f7",
        fontFamily: "Inter, -apple-system, 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        /* ─── Hide MainLayout chrome only while this page is mounted ───
           Reuses the exact body-class pattern from trade-access-page.tsx.
           Selectors target the specific utility-class elements in src/layouts/MainLayout.tsx.
           Scope: /main/fund-protection only. */
        body.fp-active .fixed.top-0.left-0.right-0.z-20,
        body.fp-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.fp-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.fp-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }

        .fp-root { line-height: 1.6; }
        .fp-outfit { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; }
        .fp-mono { font-family: 'JetBrains Mono', monospace; }
        .fp-container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .fp-section { padding: 72px 0; }
        .fp-section-alt { background: rgba(255, 255, 255, 0.02); }

        /* ─── TICKER WRAP (reference visual: 34px, glass background) ─── */
        .fp-ticker-wrap { position: relative; z-index: 299; }
        .fp-ticker-wrap > div {
          height: 34px !important;
          background: rgba(7,8,12,0.65) !important;
          border-bottom: 1px solid rgba(255,255,255,0.04) !important;
        }

        /* ─── NAV (reference-matched) ─── */
        .fp-nav {
          position: sticky;
          top: 0;
          z-index: 200;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 24px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .fp-nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #eef2f7;
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .fp-nav-logo em {
          color: #00dfa2;
          font-style: normal;
        }
        .fp-logo-box {
          width: 40px;
          height: 40px;
          background: linear-gradient(145deg, #00ffc3, #00dfa2, #00b881);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.75rem;
          color: #07080c;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 24px rgba(0,223,162,0.4),
                      inset 0 1px 2px rgba(255,255,255,0.3),
                      inset 0 -2px 4px rgba(0,0,0,0.2);
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .fp-nav-links {
          display: flex;
          gap: 2px;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .fp-nav-links::-webkit-scrollbar { display: none; }
        .fp-nav-link {
          white-space: nowrap;
          text-decoration: none;
          color: #8b97a8;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .fp-nav-link:hover {
          color: #eef2f7;
          background: rgba(255,255,255,0.12);
        }
        .fp-nav-link-active {
          color: #00dfa2;
          background: rgba(0,223,162,0.1);
          font-weight: 600;
        }
        .fp-nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .fp-btn-nav {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }
        .fp-btn-nav-red {
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          color: #07080c;
          font-weight: 600;
        }
        .fp-btn-nav-red:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,223,162,0.3);
        }
        .fp-nav-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #00dfa2;
          color: #07080c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          cursor: pointer;
          border: 1.5px solid rgba(0,223,162,0.3);
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .fp-nav { padding: 0 12px; gap: 12px; }
          .fp-nav-logo { font-size: 0.88rem; }
          .fp-logo-box { width: 34px; height: 34px; font-size: 0.7rem; }
          .fp-btn-nav-red .fp-btn-nav-label { display: none; }
        }

        .fp-gold-text {
          background: linear-gradient(135deg, #00ffc3, #00dfa2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .fp-bonus-text { color: #c8e64e; }

        @keyframes fp-pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .fp-pulse-ring::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(0, 223, 162, 0.12);
          animation: fp-pulse-ring 3s ease-out infinite;
        }

        .fp-card-hover {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .fp-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 16px 48px rgba(0, 223, 162, 0.15);
        }
        .fp-seg-box-hover {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .fp-seg-box-hover:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.12);
        }
        .fp-partner-hover {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .fp-partner-hover:hover {
          transform: translateY(-2px);
          border-color: rgba(0,223,162,0.3);
        }
        .fp-tier-hover {
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .fp-tier-hover:hover {
          border-color: rgba(0,223,162,0.3);
          background: rgba(0,223,162,0.05);
        }
        .fp-audit-hover {
          transition: border-color 0.2s ease;
        }
        .fp-audit-hover:hover {
          border-color: rgba(0,223,162,0.3);
        }
        .fp-infra-hover {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .fp-infra-hover:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 12px 32px rgba(0,223,162,0.1);
        }

        .fp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          white-space: nowrap;
        }
        .fp-btn-red {
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          color: #07080c;
        }
        .fp-btn-red:hover {
          background: linear-gradient(135deg, #00ffc3, #00dfa2);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,223,162,0.3);
        }
        .fp-btn-gold {
          background: linear-gradient(135deg, #c8e64e, #a88830);
          color: #07080c;
        }
        .fp-btn-gold:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(200,230,78,0.3);
        }
        .fp-btn-outline {
          background: transparent;
          color: #eef2f7;
          border: 1.5px solid rgba(255,255,255,0.12);
        }
        .fp-btn-outline:hover {
          border-color: #00dfa2;
          color: #00dfa2;
        }
        .fp-apply-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          background: #00dfa2;
          color: #07080c;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .fp-apply-btn:hover { background: #00b881; }

        .fp-footer-link {
          color: #4a5468;
          font-size: 0.8rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .fp-footer-link:hover { color: #00dfa2; }

        @media (max-width: 960px) {
          .fp-vetting-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .fp-insurance-grid, .fp-compliance-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .fp-hero { padding: 48px 16px 40px !important; }
          .fp-section { padding: 56px 0 !important; }
          .fp-trust-bar { gap: 24px !important; }
          .fp-trust-item { flex-direction: column !important; text-align: center !important; gap: 6px !important; }
          .fp-seg-flow { flex-direction: column !important; }
          .fp-seg-arrow { transform: rotate(90deg); }
          .fp-infra-card { flex-direction: column !important; }
          .fp-cta-banner { padding: 32px 20px !important; }
        }
      `}</style>

      {/* ─── TICKER ─── */}
      <div className="fp-ticker-wrap">
        <TickerBar />
      </div>

      {/* ─── NOTICE BAR ─── */}
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(0,223,162,0.06), rgba(200,230,78,0.04))",
          borderBottom: "1px solid rgba(0,223,162,0.2)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "0.8rem",
          color: "#8b97a8",
        }}
      >
        <ShieldHalf className="h-[0.85rem] w-[0.85rem] flex-shrink-0" style={{ color: "#00dfa2" }} />
        <span>
          1 Trade Market operates under 1 Trade Market financial regulations. All
          client funds are protected by institutional-grade security protocols
          and segregated account policies.
        </span>
      </div>

      {/* ─── NAV (reference-style; renders in place of the hidden MainLayout chrome) ─── */}
      <nav className="fp-nav">
        <Link to="/main/dashboard" className="fp-nav-logo" aria-label={brandName}>
          <div className="fp-logo-box">1TM</div>
          {(() => {
            const parts = brandName.split(" ").filter(Boolean);
            if (parts.length <= 1) return <em>{brandName}</em>;
            const head = parts.slice(0, -1).join(" ");
            const tail = parts[parts.length - 1];
            return (
              <>
                {head} <em>{tail}</em>
              </>
            );
          })()}
        </Link>
        <div className="fp-nav-links">
          {NAV_LINKS.map((l) => {
            const active = l.to === "/main/fund-protection";
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`fp-nav-link${active ? " fp-nav-link-active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="fp-nav-right">
          <Link to="/main/kyc" className="fp-btn-nav fp-btn-nav-red">
            <UserCog className="h-[0.82rem] w-[0.82rem]" />
            <span className="fp-btn-nav-label">Apply as Manager</span>
          </Link>
          <div className="fp-nav-avatar" title={user?.first_name ? `${user.first_name} ${user.last_name ?? ""}`.trim() : "Account"}>
            {initials}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <motion.section
        {...revealProps}
        className="fp-hero relative text-center"
        style={{ padding: "80px 24px 64px", overflow: "hidden" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(0,223,162,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(200,230,78,0.04) 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <div
            className="fp-pulse-ring relative mx-auto mb-6 flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              background:
                "linear-gradient(135deg, rgba(0,223,162,0.15), rgba(200,230,78,0.1))",
              border: "1.5px solid rgba(0,223,162,0.3)",
              borderRadius: "50%",
              color: "#00dfa2",
            }}
          >
            <ShieldHalf className="h-8 w-8" />
          </div>

          <div
            className="mb-6 inline-flex items-center gap-2 rounded-[20px] px-4 py-1.5"
            style={{
              background: "rgba(0,223,162,0.1)",
              border: "1px solid rgba(0,223,162,0.25)",
              color: "#00dfa2",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <Lock className="h-[0.72rem] w-[0.72rem]" /> 1 Trade Market Investor Protection
          </div>

          <h1
            className="fp-outfit mx-auto mb-5"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              maxWidth: 820,
            }}
          >
            Your Funds Are Protected
            <br />
            by <span className="fp-gold-text">Institutional</span>{" "}
            <span className="fp-bonus-text">Standards</span>
          </h1>

          <p
            className="mx-auto"
            style={{
              fontSize: "1rem",
              color: "#8b97a8",
              maxWidth: 680,
              marginBottom: 36,
              lineHeight: 1.8,
            }}
          >
            1 Trade Market continuously invests in infrastructure, maintains the
            highest security standards, and partners with the most reputable
            financial institutions worldwide, ensuring that whatever happens,
            your capital is fully protected.
          </p>

          <div
            className="fp-trust-bar fp-container mx-auto flex flex-wrap justify-center"
            style={{
              gap: 40,
              padding: "28px 0",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              maxWidth: 900,
            }}
          >
            {TRUST_STATS.map((s, i) => {
              const t = TONE_STYLES[s.tone as Tone];
              const Icon = s.icon;
              return (
                <div key={i} className="fp-trust-item flex items-center gap-3">
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: t.bg,
                      color: t.color,
                      border: t.border,
                      fontSize: "1rem",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div
                      className="fp-mono"
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#eef2f7",
                        lineHeight: 1.2,
                      }}
                    >
                      {s.val}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#4a5468" }}>
                      {s.lab}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ─── PROTECTION PILLARS ─── */}
      <section className="fp-section">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<ShieldHalf className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="green"
            label="Core Protections"
            title={
              <>
                Six Layers of <span className="fp-gold-text">Investor Protection</span>
              </>
            }
            desc="Every client account at 1 Trade Market is backed by multiple, independent layers of protection, from legal segregation to cutting-edge cybersecurity."
          />
          <motion.div
            {...revealProps}
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {PILLARS.map((p, i) => {
              const t = TONE_STYLES[p.tone as Tone];
              const Icon = p.icon;
              const StatIcon = p.statIcon;
              return (
                <div
                  key={i}
                  className="fp-card-hover relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(40px)",
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: 16,
                    padding: "32px 28px",
                  }}
                >
                  <div
                    className="mb-5 flex items-center justify-center"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: t.bg,
                      color: t.color,
                      border: t.border,
                      fontSize: "1.3rem",
                    }}
                  >
                    <Icon className="h-[1.3rem] w-[1.3rem]" />
                  </div>
                  <h3
                    className="fp-outfit mb-2.5"
                    style={{ fontSize: "1.05rem", fontWeight: 700, color: "#eef2f7" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{ fontSize: "0.86rem", color: "#8b97a8", lineHeight: 1.75 }}
                  >
                    {p.body}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-1.5 rounded-[20px]"
                    style={{
                      background: "rgba(0,223,162,0.08)",
                      border: "1px solid rgba(0,223,162,0.2)",
                      padding: "5px 12px",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#00dfa2",
                    }}
                  >
                    <StatIcon className="h-[0.72rem] w-[0.72rem]" />
                    {p.stat}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── FUND MANAGER VETTING ─── */}
      <section className="fp-section fp-section-alt">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<UserCog className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="green"
            label="Manager Vetting"
            title={
              <>
                Rigorous <span className="fp-bonus-text">Fund Manager</span> Vetting Process
              </>
            }
            desc="Every fund manager on our platform undergoes a thorough, multi-stage vetting process before being approved to manage client capital. We accept only the most qualified, compliant, and financially sound managers."
          />

          <motion.div
            {...revealProps}
            className="fp-vetting-grid grid items-start"
            style={{ gridTemplateColumns: "1fr 420px", gap: 48 }}
          >
            {/* STEPS */}
            <div className="flex flex-col">
              {VETTING_STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="relative flex gap-5"
                  style={{
                    padding: "28px 0",
                    borderBottom:
                      i < VETTING_STEPS.length - 1
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="fp-mono relative z-[1] flex items-center justify-center"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(0,223,162,0.1)",
                        border: "1.5px solid rgba(0,223,162,0.3)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#00dfa2",
                      }}
                    >
                      {step.num}
                    </div>
                    {i < VETTING_STEPS.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: 21,
                          top: 44,
                          bottom: -28,
                          width: 1.5,
                          background:
                            "linear-gradient(180deg, rgba(0,223,162,0.3) 0%, rgba(255,255,255,0.08) 100%)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className="fp-outfit mb-2"
                      style={{ fontSize: "1rem", fontWeight: 700, color: "#eef2f7" }}
                    >
                      {step.title}
                    </h4>
                    <p
                      className="mb-3"
                      style={{ fontSize: "0.86rem", color: "#8b97a8", lineHeight: 1.75 }}
                    >
                      {step.body}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.tags.map((tag, ti) => {
                        const tone = TAG_TONE_STYLES[tag.tone];
                        const TagIcon = tag.icon;
                        return (
                          <span
                            key={ti}
                            className="inline-flex items-center gap-1.5 rounded-[20px]"
                            style={{
                              background: tone.bg,
                              border: `1px solid ${tone.border}`,
                              color: tone.color,
                              fontSize: "0.72rem",
                              fontWeight: 500,
                              padding: "3px 10px",
                            }}
                          >
                            <TagIcon className="h-[0.6rem] w-[0.6rem]" />
                            {tag.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SECURITY DEPOSIT SIDEBAR */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(0,223,162,0.2)",
                borderRadius: 16,
                padding: 32,
              }}
            >
              <h3
                className="fp-outfit mb-1.5 flex items-center gap-2"
                style={{ fontSize: "1.1rem", fontWeight: 700, color: "#00dfa2" }}
              >
                <Vault className="h-[1rem] w-[1rem]" />
                Security Deposit Scale
              </h3>
              <p
                style={{
                  fontSize: "0.83rem",
                  color: "#4a5468",
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                The mandatory security deposit is calculated based on total AUM
                and remains locked for the duration of the management
                engagement.
              </p>

              <div className="flex flex-col gap-3">
                {DEPOSIT_TIERS.map((tier, i) => (
                  <div
                    key={i}
                    className="fp-tier-hover"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "16px 18px",
                    }}
                  >
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#eef2f7",
                        }}
                      >
                        {tier.label}
                      </span>
                      <span
                        className="fp-mono"
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#00dfa2",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tier.amount}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${tier.fill}%`,
                          background: "linear-gradient(90deg, #00dfa2, #c8e64e)",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#4a5468", marginTop: 6 }}>
                      {tier.note}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-5"
                style={{
                  background: "rgba(0,223,162,0.08)",
                  border: "1px solid rgba(0,223,162,0.2)",
                  borderRadius: 8,
                  padding: "14px 16px",
                }}
              >
                <p style={{ fontSize: "0.8rem", color: "#8b97a8", lineHeight: 1.6, margin: 0 }}>
                  <strong style={{ color: "#00dfa2" }}>Important:</strong>{" "}
                  Security deposits are held in segregated trust and are not
                  accessible to 1 Trade Market. In the event of manager
                  misconduct, the deposit is used to compensate affected
                  investors before any other recourse.
                </p>
              </div>

              <Link to="/main/kyc" className="fp-apply-btn">
                <UserCog className="h-[0.85rem] w-[0.85rem]" />
                Apply as Fund Manager
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ENHANCED INSURANCE ─── */}
      <section className="fp-section">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<FileText className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="blue"
            label="Insurance Protection"
            title={
              <>
                Enhanced <span className="fp-gold-text">Insurance</span> Up to $1,000,000
              </>
            }
            desc="1 Trade Market has purchased, at no direct cost to clients, separate insurance protection to cover losses in the event of an insolvency incident, far exceeding standard industry coverage."
          />

          <motion.div
            {...revealProps}
            className="fp-insurance-grid grid items-start"
            style={{ gridTemplateColumns: "1fr 1fr", gap: 32 }}
          >
            {/* FEATURED CARD */}
            <div
              className="relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,223,162,0.08), rgba(10,13,21,0) 60%), rgba(255,255,255,0.04)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(0,223,162,0.3)",
                borderRadius: 16,
                padding: 36,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #00dfa2, transparent)",
                }}
              />
              <div
                className="mb-5 inline-flex items-center gap-1.5 rounded-[20px]"
                style={{
                  background: "rgba(0,223,162,0.1)",
                  border: "1px solid rgba(0,223,162,0.25)",
                  color: "#00dfa2",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "5px 14px",
                  letterSpacing: "0.04em",
                }}
              >
                <ShieldHalf className="h-[0.7rem] w-[0.7rem]" /> 1 Trade Market Enhanced Coverage
              </div>
              <div
                className="fp-mono mb-2"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#00dfa2",
                  lineHeight: 1,
                }}
              >
                $1,000,000
                <span
                  className="ml-1.5"
                  style={{
                    fontSize: "1rem",
                    color: "#4a5468",
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  per client
                </span>
              </div>
              <div
                className="mb-5"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#4a5468",
                }}
              >
                Enhanced Insurance Protection, No Direct Cost to Clients
              </div>
              <p
                className="mb-6"
                style={{ fontSize: "0.88rem", color: "#8b97a8", lineHeight: 1.75 }}
              >
                In the event of an insolvency event at 1 Trade Market, clients
                are covered for losses exceeding $10,000 up to a maximum of
                $1,000,000 per account. This separate insurance policy is
                underwritten by Lloyd's of London syndicates and is entirely
                funded by 1 Trade Market, not deducted from client assets.
              </p>
              <div className="flex flex-col gap-2.5">
                {INSURANCE_FEATURES_PRIMARY.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CircleCheck
                      className="mt-1 h-[0.78rem] w-[0.78rem] flex-shrink-0"
                      style={{ color: "#00dfa2" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#8b97a8" }}>
                      {f.plain}
                      <strong style={{ color: "#eef2f7" }}>{f.strong}</strong>
                      {f.tail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coverage comparison */}
              <div
                className="mt-6 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                {[
                  { label: "Industry Standard (FDIC-equivalent)", val: "$10,000", width: 1, bg: "rgba(59,130,246,0.6)" },
                  { label: "Typical Crypto Broker (SIPC-style)", val: "$500,000", width: 50, bg: "rgba(0,223,162,0.6)" },
                  { label: "1 Trade Market Enhanced", val: "$1,000,000", width: 100, bg: "linear-gradient(90deg, #00dfa2, #c8e64e)" },
                ].map((row, i) => (
                  <div key={i} style={{ marginTop: i === 0 ? 0 : 10 }}>
                    <div className="mb-2 flex items-center justify-between">
                      <span style={{ fontSize: "0.78rem", color: "#4a5468" }}>
                        {row.label}
                      </span>
                      <span
                        className="fp-mono"
                        style={{ fontSize: "0.78rem", fontWeight: 600, color: "#00dfa2" }}
                      >
                        {row.val}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: 4,
                        overflow: "hidden",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${row.width}%`,
                          background: row.bg,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDE CARDS */}
            <div className="flex flex-col gap-5">
              <InsuranceSideCard
                icon={<Handshake className="h-[1.3rem] w-[1.3rem]" />}
                tone="gold"
                title="How Claims Work"
                desc="In the event of an insolvency or platform failure, our legal team initiates the claims process automatically on your behalf. You will be notified within 48 hours and provided with a dedicated claims case number."
                features={CLAIMS_FEATURES.map((f) => ({ text: f }))}
              />
              <InsuranceSideCard
                icon={<Scale className="h-[1.3rem] w-[1.3rem]" />}
                tone="green"
                title="What Is Covered"
                desc="Coverage applies to direct losses arising from 1 Trade Market's insolvency. This includes cash balances, crypto holdings, and Retirement Staking™ accounts held on our platform."
                features={COVERED_FEATURES.map((f) => ({
                  strong: f.strong,
                  tail: f.tail,
                }))}
              />
              <div
                className="relative overflow-hidden"
                style={{
                  background: "rgba(0,223,162,0.1)",
                  border: "1px solid rgba(0,223,162,0.15)",
                  borderRadius: 16,
                  padding: 36,
                }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <TriangleAlert
                    className="h-[1.1rem] w-[1.1rem]"
                    style={{ color: "#00dfa2" }}
                  />
                  <span
                    style={{ fontSize: "0.88rem", fontWeight: 700, color: "#eef2f7" }}
                  >
                    What Is Not Covered
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {NOT_COVERED_FEATURES.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CircleX
                        className="mt-1 h-[0.78rem] w-[0.78rem] flex-shrink-0"
                        style={{ color: "#00dfa2" }}
                      />
                      <span style={{ fontSize: "0.85rem", color: "#8b97a8" }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SEGREGATED ACCOUNTS ─── */}
      <section className="fp-section fp-section-alt">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<Building2 className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="green"
            label="Account Segregation"
            title={
              <>
                Ring-Fenced <span className="fp-gold-text">Segregated</span> Accounts
              </>
            }
            desc="All client accounts are ring-fenced from company funds by being held in segregated accounts with reputable, internationally recognised financial institutions. This is a legal and operational requirement, not merely a policy."
          />

          <motion.div {...revealProps} className="mb-12 flex flex-col gap-4">
            <div className="fp-seg-flow flex flex-wrap items-center gap-4">
              <SegBox
                tone="client"
                icon={<UserRound className="h-[1.1rem] w-[1.1rem]" />}
                title="Client Deposits"
                body="Your funds deposited on the platform"
              />
              <div className="fp-seg-arrow flex-shrink-0" style={{ fontSize: "1.2rem", color: "#4a5468" }}>
                <ArrowRight className="h-5 w-5" />
              </div>
              <SegBox
                tone="segregated"
                icon={<Vault className="h-[1.1rem] w-[1.1rem]" />}
                title="Segregated Trust Account"
                body="Held at Tier-1 financial institutions · legally ring-fenced"
              />
              <div
                className="fp-seg-arrow flex-shrink-0 fp-mono"
                style={{ color: "#00dfa2", fontSize: "1.4rem", fontWeight: 700, lineHeight: 1 }}
                aria-hidden="true"
              >
                ≠
              </div>
              <SegBox
                tone="company"
                icon={<Building className="h-[1.1rem] w-[1.1rem]" />}
                title="Company Operating Funds"
                body="Completely separate · cannot touch client assets"
              />
            </div>

            <div className="flex items-center gap-4 px-2">
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              <div
                className="inline-flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#00dfa2",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: "rgba(0,223,162,0.1)",
                  border: "1px solid rgba(0,223,162,0.25)",
                  padding: "3px 12px",
                  borderRadius: 20,
                }}
              >
                <Lock className="h-[0.65rem] w-[0.65rem]" />
                Legal Firewall, Client Funds Are Fully Protected
              </div>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            </div>
          </motion.div>

          <motion.div
            {...revealProps}
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {SEG_GUARANTEES.map((g, i) => {
              const Icon = g.icon;
              return (
                <div
                  key={i}
                  className="fp-card-hover flex items-start gap-3.5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "22px 24px",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "rgba(0,223,162,0.1)",
                      color: "#00dfa2",
                      border: "1px solid rgba(0,223,162,0.25)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <Icon className="h-[0.95rem] w-[0.95rem]" />
                  </div>
                  <div>
                    <h4
                      className="fp-outfit mb-1"
                      style={{ fontSize: "0.9rem", fontWeight: 700, color: "#eef2f7" }}
                    >
                      {g.title}
                    </h4>
                    <p style={{ fontSize: "0.8rem", color: "#8b97a8", lineHeight: 1.6 }}>
                      {g.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── SECURITY INFRASTRUCTURE ─── */}
      <section className="fp-section">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<Cpu className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="blue"
            label="Infrastructure"
            title={
              <>
                Enterprise-Grade <span className="fp-gold-text">Security Infrastructure</span>
              </>
            }
            desc="Our platform is built on the same security architecture used by the world's largest financial institutions, from quantum-resistant encryption to physical vault custody."
          />

          <motion.div
            {...revealProps}
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}
          >
            {INFRA_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="fp-infra-hover fp-infra-card flex"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 28,
                    gap: 18,
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${item.color}1a`,
                      color: item.color,
                      border: `1px solid ${item.color}40`,
                      fontSize: "1.2rem",
                    }}
                  >
                    <Icon className="h-[1.2rem] w-[1.2rem]" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="fp-outfit mb-2"
                      style={{ fontSize: "0.95rem", fontWeight: 700, color: "#eef2f7" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mb-3"
                      style={{ fontSize: "0.83rem", color: "#8b97a8", lineHeight: 1.7 }}
                    >
                      {item.body}
                    </p>
                    <span
                      className="fp-mono inline-block"
                      style={{
                        fontSize: "0.75rem",
                        color: "#4a5468",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {item.spec}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── FINANCIAL PARTNERS ─── */}
      <section className="fp-section fp-section-alt">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<Handshake className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="green"
            label="Institutional Partners"
            title={
              <>
                Trusted <span className="fp-gold-text">Financial Institution</span> Partners
              </>
            }
            desc="Client funds are held exclusively with the world's most reputable, FINMA-regulated and internationally recognised financial institutions."
          />

          <motion.div
            {...revealProps}
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
          >
            {PARTNERS.map((p, i) => (
              <div
                key={i}
                className="fp-partner-hover text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(40px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "22px 20px",
                }}
              >
                <div
                  className="fp-mono mb-1.5"
                  style={{ fontSize: "1.4rem", fontWeight: 700, color: "#00dfa2" }}
                >
                  {p.abbr}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#eef2f7",
                    marginBottom: 4,
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#4a5468" }}>
                  {p.type}
                </div>
                <div
                  className="mt-2.5 inline-flex items-center gap-1"
                  style={{
                    fontSize: "0.68rem",
                    color: "#00dfa2",
                    background: "rgba(0,223,162,0.1)",
                    border: "1px solid rgba(0,223,162,0.25)",
                    padding: "3px 8px",
                    borderRadius: 10,
                  }}
                >
                  <CircleCheck className="h-[0.6rem] w-[0.6rem]" />
                  {p.badge}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── COMPLIANCE ─── */}
      <section className="fp-section">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<Landmark className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="green"
            label="Compliance"
            title={
              <>
                Regulatory <span className="fp-bonus-text">Compliance</span> & Audit Record
              </>
            }
            desc="1 Trade Market is a fully regulated entity operating under Swiss law. Our compliance programme exceeds the requirements of FINMA and international financial standards bodies."
          />

          <motion.div
            {...revealProps}
            className="fp-compliance-grid grid"
            style={{ gridTemplateColumns: "1fr 1fr", gap: 32 }}
          >
            {/* Swiss Regulatory */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 32,
              }}
            >
              <div className="mb-5 flex items-center gap-3.5">
                <div
                  className="flex flex-shrink-0 items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(0,223,162,0.1)",
                    border: "1px solid rgba(0,223,162,0.25)",
                    borderRadius: 8,
                    color: "#00dfa2",
                    fontSize: "1.4rem",
                  }}
                >
                  <Flag className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <div>
                  <h3
                    className="fp-outfit"
                    style={{ fontSize: "1.05rem", fontWeight: 700, color: "#eef2f7" }}
                  >
                    Swiss Regulatory Framework
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#4a5468" }}>
                    FINMA · AMLA · FIDLEG · DLT Act 2021
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {COMPLIANCE_ITEMS.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5"
                    style={{
                      fontSize: "0.85rem",
                      color: "#8b97a8",
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 8,
                      borderLeft: "3px solid #00dfa2",
                    }}
                  >
                    <CircleCheck
                      className="mt-0.5 h-[0.78rem] w-[0.78rem] flex-shrink-0"
                      style={{ color: "#00dfa2" }}
                    />
                    <span>
                      <strong style={{ color: "#eef2f7" }}>{c.strong}</strong>
                      {c.tail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Timeline */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 32,
              }}
            >
              <div className="mb-5 flex items-center gap-3.5">
                <div
                  className="flex flex-shrink-0 items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "rgba(59,130,246,0.1)",
                    border: "1.5px solid rgba(59,130,246,0.25)",
                    color: "#3b82f6",
                    fontSize: "1.1rem",
                  }}
                >
                  <ClipboardList className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <div>
                  <h3
                    className="fp-outfit"
                    style={{ fontSize: "1.05rem", fontWeight: 700, color: "#eef2f7" }}
                  >
                    Audit & Certification Record
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#4a5468" }}>
                    Independent third-party assessments
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                {AUDIT_ITEMS.map((a, i) => {
                  const dotStyle =
                    a.dot === "green"
                      ? {
                          background: "#00dfa2",
                          boxShadow: "0 0 8px rgba(0,223,162,0.4)",
                        }
                      : {
                          background: "#3b82f6",
                          boxShadow: "0 0 8px rgba(59,130,246,0.4)",
                        };
                  const statusStyle =
                    a.status === "passed"
                      ? {
                          background: "rgba(0,223,162,0.1)",
                          color: "#00dfa2",
                          border: "1px solid rgba(0,223,162,0.25)",
                        }
                      : a.status === "current"
                        ? {
                            background: "rgba(59,130,246,0.1)",
                            color: "#3b82f6",
                            border: "1px solid rgba(59,130,246,0.25)",
                          }
                        : {
                            background: "rgba(168,85,247,0.1)",
                            color: "#a855f7",
                            border: "1px solid rgba(168,85,247,0.25)",
                          };
                  return (
                    <div
                      key={i}
                      className="fp-audit-hover flex items-center gap-3.5"
                      style={{
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          flexShrink: 0,
                          ...dotStyle,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#eef2f7",
                          }}
                        >
                          {a.title}
                        </div>
                        <div
                          className="mt-0.5"
                          style={{ fontSize: "0.75rem", color: "#4a5468" }}
                        >
                          {a.detail}
                        </div>
                      </div>
                      <span
                        className="whitespace-nowrap"
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          ...statusStyle,
                        }}
                      >
                        {a.statusLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="fp-section fp-section-alt">
        <div className="fp-container">
          <SectionHeader
            labelIcon={<HelpCircle className="h-[0.65rem] w-[0.65rem]" />}
            labelTone="blue"
            label="Common Questions"
            title={
              <>
                Frequently Asked <span className="fp-gold-text">Questions</span>
              </>
            }
          />

          <motion.div
            {...revealProps}
            className="flex flex-col gap-2.5"
            style={{ maxWidth: 820 }}
          >
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(40px)",
                    border: `1px solid ${isOpen ? "rgba(0,223,162,0.3)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                    style={{
                      padding: "20px 24px",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                    }}
                  >
                    <span
                      style={{ fontSize: "0.92rem", fontWeight: 600, color: "#eef2f7" }}
                    >
                      {item.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex flex-shrink-0 items-center justify-center"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: isOpen
                          ? "rgba(0,223,162,0.1)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isOpen ? "rgba(0,223,162,0.25)" : "rgba(255,255,255,0.08)"}`,
                        color: isOpen ? "#00dfa2" : "#4a5468",
                      }}
                    >
                      <Plus className="h-[0.7rem] w-[0.7rem]" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 24px 20px" }}>
                          <p
                            style={{
                              fontSize: "0.87rem",
                              color: "#8b97a8",
                              lineHeight: 1.8,
                              borderLeft: "3px solid rgba(0,223,162,0.25)",
                              paddingLeft: 14,
                            }}
                          >
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="fp-section">
        <div className="fp-container">
          <motion.div
            {...revealProps}
            className="fp-cta-banner relative overflow-hidden text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,223,162,0.1), rgba(200,230,78,0.05))",
              border: "1px solid rgba(0,223,162,0.2)",
              borderRadius: 16,
              padding: 48,
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,223,162,0.08) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className="mx-auto mb-5 flex items-center justify-center"
                style={{
                  width: 60,
                  height: 60,
                  background:
                    "linear-gradient(135deg, rgba(0,223,162,0.15), rgba(200,230,78,0.1))",
                  border: "1.5px solid rgba(0,223,162,0.3)",
                  borderRadius: "50%",
                  color: "#00dfa2",
                  fontSize: "1.5rem",
                }}
              >
                <ShieldHalf className="h-6 w-6" />
              </div>
              <h2
                className="fp-outfit mb-3"
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "#eef2f7",
                }}
              >
                Ready to Invest with{" "}
                <span className="fp-bonus-text">Complete Confidence?</span>
              </h2>
              <p
                className="mx-auto mb-7"
                style={{
                  fontSize: "0.95rem",
                  color: "#8b97a8",
                  maxWidth: 560,
                  lineHeight: 1.7,
                }}
              >
                Open your verified account today and benefit from Swiss-grade
                fund protection, $1M insurance coverage, and access to our
                rigorously vetted fund manager network.
              </p>
              <div className="flex flex-wrap justify-center gap-3.5">
                <Link to="/main/kyc" className="fp-btn fp-btn-red">
                  <UserPlus className="h-[0.88rem] w-[0.88rem]" />
                  Open Protected Account
                </Link>
                <Link to="/main/fund-managers" className="fp-btn fp-btn-gold">
                  <UserCog className="h-[0.88rem] w-[0.88rem]" />
                  Browse Fund Managers
                </Link>
                <Link to="/main/trading-plans" className="fp-btn fp-btn-outline">
                  <Crown className="h-[0.88rem] w-[0.88rem]" />
                  View VIP Plans
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="text-center"
        style={{
          background: "rgba(255,255,255,0.01)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 24px",
        }}
      >
        <div className="mb-5 flex flex-wrap justify-center gap-6">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="fp-footer-link">
              {l.label}
            </Link>
          ))}
        </div>
        <p
          className="mx-auto"
          style={{
            fontSize: "0.75rem",
            color: "#4a5468",
            lineHeight: 1.6,
            maxWidth: 700,
          }}
        >
          © 2026 1 Trade Market · Registered in Switzerland · Zug, Switzerland ·
          FINMA Licensed
          <br />
          All client funds are held in segregated accounts. Enhanced insurance
          up to $1,000,000 per client. Past performance is not indicative of
          future results. Crypto assets are subject to market risk.
        </p>
      </footer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// LOCAL HELPER COMPONENTS
// ───────────────────────────────────────────────────────────────

function SectionHeader({
  label,
  labelIcon,
  labelTone,
  title,
  desc,
}: {
  label: string;
  labelIcon: React.ReactNode;
  labelTone: "green" | "blue";
  title: React.ReactNode;
  desc?: string;
}) {
  const toneColor = labelTone === "blue" ? "#c8e64e" : "#00dfa2";
  return (
    <motion.div {...revealProps} className="mb-12">
      <div
        className="inline-flex items-center gap-2"
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 14,
          color: toneColor,
        }}
      >
        {labelIcon}
        {label}
      </div>
      <h2
        className="fp-outfit mb-3"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
          fontWeight: 700,
          color: "#eef2f7",
          letterSpacing: "-0.015em",
          lineHeight: 1.25,
        }}
      >
        {title}
      </h2>
      {desc && (
        <p
          style={{
            fontSize: "0.95rem",
            color: "#8b97a8",
            maxWidth: 620,
            lineHeight: 1.8,
          }}
        >
          {desc}
        </p>
      )}
    </motion.div>
  );
}

function SegBox({
  tone,
  icon,
  title,
  body,
}: {
  tone: "client" | "segregated" | "company";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const toneStyle =
    tone === "client"
      ? {
          border: "1.5px solid rgba(59,130,246,0.3)",
          iconBg: "rgba(59,130,246,0.1)",
          iconColor: "#3b82f6",
          iconBorder: "1px solid rgba(59,130,246,0.25)",
          opacity: 1,
        }
      : tone === "segregated"
        ? {
            border: "1.5px solid rgba(0,223,162,0.3)",
            iconBg: "rgba(0,223,162,0.1)",
            iconColor: "#00dfa2",
            iconBorder: "1px solid rgba(0,223,162,0.25)",
            opacity: 1,
          }
        : {
            border: "1.5px solid rgba(200,230,78,0.2)",
            iconBg: "rgba(200,230,78,0.1)",
            iconColor: "#c8e64e",
            iconBorder: "1px solid rgba(200,230,78,0.25)",
            opacity: 0.5,
          };

  return (
    <div
      className="fp-seg-box-hover flex-1 text-center"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px)",
        border: toneStyle.border,
        borderRadius: 12,
        padding: "20px 24px",
        minWidth: 200,
        opacity: toneStyle.opacity,
      }}
    >
      <div
        className="mx-auto mb-2.5 flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: toneStyle.iconBg,
          color: toneStyle.iconColor,
          border: toneStyle.iconBorder,
          fontSize: "1.1rem",
        }}
      >
        {icon}
      </div>
      <h4
        className="fp-outfit mb-1"
        style={{ fontSize: "0.88rem", fontWeight: 700, color: "#eef2f7" }}
      >
        {title}
      </h4>
      <p style={{ fontSize: "0.75rem", color: "#4a5468", lineHeight: 1.5 }}>
        {body}
      </p>
    </div>
  );
}

function InsuranceSideCard({
  icon,
  tone,
  title,
  desc,
  features,
}: {
  icon: React.ReactNode;
  tone: "gold" | "green";
  title: string;
  desc: string;
  features: { text?: string; strong?: string; tail?: string }[];
}) {
  const iconTone =
    tone === "gold"
      ? {
          bg: "rgba(59,130,246,0.1)",
          color: "#3b82f6",
          border: "1px solid rgba(59,130,246,0.25)",
        }
      : {
          bg: "rgba(0,223,162,0.1)",
          color: "#00dfa2",
          border: "1px solid rgba(0,223,162,0.25)",
        };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 36,
      }}
    >
      <div
        className="mb-4 flex items-center justify-center"
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: iconTone.bg,
          color: iconTone.color,
          border: iconTone.border,
          fontSize: "1.3rem",
        }}
      >
        {icon}
      </div>
      <div
        className="fp-outfit mb-3"
        style={{ fontSize: "1.1rem", fontWeight: 700, color: "#eef2f7" }}
      >
        {title}
      </div>
      <p
        className="mb-6"
        style={{ fontSize: "0.88rem", color: "#8b97a8", lineHeight: 1.75 }}
      >
        {desc}
      </p>
      <div className="flex flex-col gap-2.5">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CircleCheck
              className="mt-1 h-[0.78rem] w-[0.78rem] flex-shrink-0"
              style={{ color: "#00dfa2" }}
            />
            <span style={{ fontSize: "0.85rem", color: "#8b97a8" }}>
              {f.text ? (
                f.text
              ) : (
                <>
                  <strong style={{ color: "#eef2f7" }}>{f.strong}</strong>
                  {f.tail}
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

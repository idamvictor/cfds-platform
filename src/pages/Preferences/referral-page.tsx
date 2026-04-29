import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TickerBar } from "@/components/dashboard/TickerBar";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";
import {
  Gift,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  MessageCircle,
  Link2,
  UserPlus,
  LineChart,
  Wallet,
  Layers,
  Handshake,
  Star,
  Trophy,
  HelpCircle,
  Play,
  ArrowRight,
  DollarSign,
  UserCheck,
  Globe,
  BarChart3,
  Zap,
  Infinity as InfinityIcon,
  Megaphone,
  // Plus,
  Menu,
  X as XIcon,
  ChevronDown,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────
// STATIC CONTENT (presentational only — from html_files/referral.html)
// ───────────────────────────────────────────────────────────────

// In-page anchor IDs (live elements on this page).
const NAV_ANCHORS = [
  { label: "How It Works", href: "#rf-how-it-works" },
  { label: "Tiers", href: "#rf-commission-tiers" },
  { label: "Partner Program", href: "#rf-partner" },
  { label: "FAQ", href: "#rf-faq" },
];

const HERO_STATS = [
  { value: "$0.00", label: "Available to Withdraw" },
  { value: "$0.00", label: "Total Earned" },
  { value: "0", label: "Users Invited" },
  { value: "0%", label: "Conversion Rate" },
];

const COMMISSION_STRUCTURE = [
  { tier: "Tier 1", pct: "30%", width: 30, desc: "of trading fees" },
  { tier: "Tier 2", pct: "15%", width: 15, desc: "of trading fees" },
  { tier: "Tier 3", pct: "5%", width: 5, desc: "of trading fees" },
];

const RECENT_ACTIVITY = [
  { initials: "AC", user: "@alex_crypto", amount: "+$24.50" },
  { initials: "JD", user: "@jordan_dev", amount: "+$18.75" },
  { initials: "MK", user: "@mike_trader", amount: "+$31.20" },
  { initials: "SR", user: "@sarah_invest", amount: "+$12.90" },
];

const HOW_STEPS: {
  num: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}[] = [
  {
    num: "01",
    icon: Link2,
    title: "Share Your Link",
    desc: "Copy your unique referral link and share it with friends via email, social media, or chat.",
  },
  {
    num: "02",
    icon: UserPlus,
    title: "Friend Signs Up",
    desc: "Your friends click your link and create a new 1 Trade Market account using your referral code.",
  },
  {
    num: "03",
    icon: LineChart,
    title: "Friend Trades",
    desc: "Your referred user starts trading crypto and generating transaction fees on the platform.",
  },
  {
    num: "04",
    icon: Wallet,
    title: "You Earn",
    desc: "Earn commissions instantly on every trade your referrals make. Withdraw to your wallet anytime.",
  },
];

type TierTone = "bronze" | "silver" | "gold" | "platinum" | "diamond";

const COMMISSION_TIERS: {
  tier: string;
  tone: TierTone;
  volume: string;
  rate: string;
  bonus: string;
  status: string;
  current?: boolean;
}[] = [
  {
    tier: "Bronze",
    tone: "bronze",
    volume: "0 - 9 referrals",
    rate: "25%",
    bonus: "—",
    status: "Current",
    current: true,
  },
  {
    tier: "Silver",
    tone: "silver",
    volume: "10 - 49 referrals",
    rate: "30%",
    bonus: "+$50",
    status: "10 more referrals",
  },
  {
    tier: "Gold",
    tone: "gold",
    volume: "50 - 199 referrals",
    rate: "35%",
    bonus: "+$100",
    status: "50 more referrals",
  },
  {
    tier: "Platinum",
    tone: "platinum",
    volume: "200 - 499 referrals",
    rate: "40%",
    bonus: "+$200",
    status: "200 more referrals",
  },
  {
    tier: "Diamond",
    tone: "diamond",
    volume: "500+ referrals",
    rate: "50%",
    bonus: "+$500",
    status: "500+ achieved",
  },
];

const PARTNER_FEATURES = [
  "Dedicated partnership manager available 24/7",
  "Custom landing pages and branding options",
  "Real-time dashboard with advanced analytics",
  "Co-marketing campaigns and promotional materials",
  "Priority API access and custom integrations",
  "Higher commission tiers (up to 60%)",
  "Monthly performance bonuses",
  "Exclusive events and networking opportunities",
];

const PARTNER_BENEFITS: {
  icon: React.ElementType;
  title: string;
  desc: string;
}[] = [
  {
    icon: DollarSign,
    title: "Minimum $10K Monthly",
    desc: "Earn at least $10,000 per month with dedicated support",
  },
  {
    icon: UserCheck,
    title: "Dedicated Manager",
    desc: "Personal account manager for strategy and optimization",
  },
  {
    icon: Globe,
    title: "Custom Landing Pages",
    desc: "Create branded pages to increase conversion rates",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    desc: "Advanced analytics and performance tracking",
  },
  {
    icon: Zap,
    title: "Priority Support",
    desc: "24/7 dedicated support for your campaigns",
  },
  {
    icon: Gift,
    title: "Monthly Bonuses",
    desc: "Earn additional bonuses for hitting targets",
  },
];

type RewardTone = "green" | "purple" | "blue";

const REWARDS: {
  icon: React.ElementType;
  tone: RewardTone;
  stat: string;
  title: string;
  desc: string;
  tag: string;
}[] = [
  {
    icon: InfinityIcon,
    tone: "green",
    stat: "∞",
    title: "Lifetime Commissions",
    desc: "Earn commissions on every trade your referrals make forever. No expiration dates or limits.",
    tag: "No time limit",
  },
  {
    icon: Zap,
    tone: "purple",
    stat: "⚡",
    title: "Instant Payouts",
    desc: "Get paid instantly. Withdraw your earnings to your wallet anytime, anywhere, with no fees.",
    tag: "Zero withdrawal fee",
  },
  {
    icon: Megaphone,
    tone: "blue",
    stat: "📢",
    title: "Marketing Materials",
    desc: "Access a suite of professionally designed marketing materials, videos, and graphics.",
    tag: "Always updated",
  },
];

type RankTone = "first" | "silver" | "gold" | "default";

const TOP_EARNERS: {
  rank: number;
  rankTone: RankTone;
  initials: string;
  name: string;
  referrals: number;
  monthly: string;
  total: string;
  tier: TierTone;
  tierLabel: string;
}[] = [
  {
    rank: 1,
    rankTone: "first",
    initials: "CR",
    name: "@crypto_royale",
    referrals: 847,
    monthly: "$12,450.80",
    total: "$187,240.50",
    tier: "diamond",
    tierLabel: "Diamond",
  },
  {
    rank: 2,
    rankTone: "silver",
    initials: "TM",
    name: "@trading_mind",
    referrals: 634,
    monthly: "$8,920.30",
    total: "$145,670.20",
    tier: "diamond",
    tierLabel: "Diamond",
  },
  {
    rank: 3,
    rankTone: "gold",
    initials: "BC",
    name: "@blockchain_guru",
    referrals: 521,
    monthly: "$7,240.50",
    total: "$98,450.75",
    tier: "diamond",
    tierLabel: "Diamond",
  },
  {
    rank: 4,
    rankTone: "default",
    initials: "ML",
    name: "@market_leader",
    referrals: 412,
    monthly: "$5,680.90",
    total: "$76,230.40",
    tier: "platinum",
    tierLabel: "Platinum",
  },
  {
    rank: 5,
    rankTone: "default",
    initials: "DT",
    name: "@digital_trader",
    referrals: 368,
    monthly: "$4,920.20",
    total: "$62,850.60",
    tier: "platinum",
    tierLabel: "Platinum",
  },
];

const FAQS = [
  {
    q: "How do I get my referral link and start earning?",
    a: "It's simple! Sign up for a 1 Trade Market account, go to your dashboard, and navigate to the Referral section. Your unique referral link will be generated automatically. Copy it and start sharing it with your network. You'll begin earning commissions as soon as your referrals sign up and start trading.",
  },
  {
    q: "When do I receive my referral earnings?",
    a: "Referral earnings are calculated and available in your account in real-time. You can withdraw your earnings instantly to your wallet at any time. There's no minimum withdrawal amount, and we don't charge any fees for withdrawals. Your earnings are always yours to keep.",
  },
  {
    q: "What happens if my referral stops trading?",
    a: "You only earn commissions when your referrals are actively trading. If they stop trading, your commissions stop as well. However, all commissions you've already earned remain in your account. We recommend keeping your referrals engaged with market insights and trading tips to maximize your earning potential.",
  },
  {
    q: "Can I upgrade my tier status?",
    a: "Absolutely! Your tier status is automatically updated as you bring more referrals to the platform. Every milestone unlocks higher commission rates and exclusive bonuses. Track your progress in your dashboard to see exactly how many more referrals you need to reach the next tier.",
  },
  {
    q: "Is there a limit to how much I can earn?",
    a: "No! There's no cap on your earnings. The more referrals you bring and the more they trade, the more you earn. With lifetime commissions, you can continue earning from your referrals indefinitely. Our top earners make thousands of dollars every month through our referral program.",
  },
];

// Footer — only real workspace routes (no fake hrefs).
const FOOTER_LINKS: { label: string; to: string }[] = [
  { label: "Dashboard", to: "/main/dashboard" },
  { label: "Markets", to: "/main/market" },
  { label: "Trading Plans", to: "/main/trading-plans" },
  { label: "Welcome Bonus", to: "/main/welcome-bonus" },
  { label: "Fund Protection", to: "/main/fund-protection" },
  { label: "Fund Managers", to: "/main/fund-managers" },
  { label: "Security", to: "/main/security" },
  { label: "Contact Support", to: "/main/chat" },
];

// Social share — visual no-op buttons (no fake routes).
const SOCIAL_SHARE: { icon: React.ElementType; label: string }[] = [
  { icon: Twitter, label: "Share on Twitter" },
  { icon: Facebook, label: "Share on Facebook" },
  { icon: Linkedin, label: "Share on LinkedIn" },
  { icon: Send, label: "Share via Telegram" },
  { icon: MessageCircle, label: "Share via Discord" },
];

const revealProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

function smoothScroll(href: string) {
  if (typeof window === "undefined") return;
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ───────────────────────────────────────────────────────────────
// PAGE
// ───────────────────────────────────────────────────────────────

export default function ReferralPage() {
  const user = useUserStore((state) => state.user);
  const settings = useSiteSettingsStore((state) => state.settings);
  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "JD";
  const brandName = settings?.name || "1 Trade Market";

  const [openFaq, setOpenFaq] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralLink] = useState("https://1trade.com/ref/yourcode");
  const [ctaEmail, setCtaEmail] = useState("");

  // Hide MainLayout chrome while this page is mounted (same approved pattern
  // as wb-active / fp-active / csr-active).
  useEffect(() => {
    document.body.classList.add("rf-active");
    return () => {
      document.body.classList.remove("rf-active");
    };
  }, []);

  // Page-scoped font loading.
  useEffect(() => {
    if (document.querySelector<HTMLLinkElement>('link[data-rf-fonts="1"]'))
      return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    link.dataset.rfFonts = "1";
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch {
        /* noop */
      }
    };
  }, []);

  // Copy referral link to clipboard (client-only, no API).
  const handleCopy = async () => {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(referralLink);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const brandParts = brandName.split(" ").filter(Boolean);
  const brandHead =
    brandParts.length > 1 ? brandParts.slice(0, -1).join(" ") : "";
  const brandTail = brandParts[brandParts.length - 1] || brandName;

  return (
    <div
      className="rf-root w-full"
      style={{
        background: "linear-gradient(135deg, #07080c 0%, #0a0d15 100%)",
        color: "#eef2f7",
        fontFamily: "Inter, -apple-system, 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        /* ─── Chrome-hiding (body.rf-active) ─── */
        body.rf-active .fixed.top-0.left-0.right-0.z-20,
        body.rf-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.rf-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.rf-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }

        .rf-root { line-height: 1.6; overflow-x: hidden; }
        .rf-heading { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; }
        .rf-mono { font-family: 'JetBrains Mono', monospace; }

        /* ─── TICKER (reused TickerBar wrap, Welcome Bonus override) ─── */
        .rf-ticker-wrap { position: relative; z-index: 299; }
        .rf-ticker-wrap > div {
          height: 34px !important;
          background: rgba(7,8,12,0.65) !important;
          border-bottom: 1px solid rgba(255,255,255,0.04) !important;
        }

        /* ─── NAV ─── */
        .rf-nav {
          position: sticky;
          top: 0;
          z-index: 200;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .rf-nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          gap: 16px;
        }
        .rf-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          color: #eef2f7;
          text-decoration: none;
        }
        .rf-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.9rem;
          color: #000;
          font-family: 'Outfit', sans-serif;
          flex-shrink: 0;
        }
        .rf-logo-text {
          font-weight: 800;
          font-size: 1rem;
          color: #eef2f7;
          white-space: nowrap;
          font-family: 'Outfit', sans-serif;
        }
        .rf-logo-text em {
          font-style: normal;
          color: #00dfa2;
          font-weight: 800;
        }
        .rf-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .rf-nav-link {
          padding: 8px 14px;
          font-size: 0.835rem;
          font-weight: 500;
          color: #8b97a8;
          border-radius: 6px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .rf-nav-link:hover {
          color: #eef2f7;
          background: rgba(255,255,255,0.06);
        }
        .rf-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .rf-btn-sm {
          padding: 7px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%);
          color: #000;
          border: none;
          box-shadow: 0 8px 32px rgba(0,223,162,0.25), inset 0 1px 0 rgba(255,255,255,0.3);
          cursor: pointer;
          font-family: inherit;
        }
        .rf-btn-sm:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0,223,162,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .rf-nav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #00dfa2;
          color: #07080c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 700;
          border: 1.5px solid rgba(0,223,162,0.3);
          flex-shrink: 0;
        }
        .rf-hamburger {
          display: none;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #8b97a8;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
        }
        .rf-hamburger:hover {
          color: #eef2f7;
          background: rgba(255,255,255,0.06);
        }
        .rf-mobile-menu {
          padding: 16px 20px;
          background: rgba(7,8,12,0.92);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(40px);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .rf-mobile-menu .rf-nav-link {
          text-align: left;
          padding: 12px 14px;
        }

        /* ─── CONTAINER + SECTIONS ─── */
        .rf-container { max-width: 1280px; margin: 0 auto; padding: 0 20px; }
        .rf-sec { padding: 80px 0; position: relative; }
        .rf-sec-dark { background: rgba(255,255,255,0.01); }
        .rf-sec-header { text-align: center; margin-bottom: 48px; }
        .rf-sec-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 6px;
          background: rgba(0,223,162,0.1);
          border: 1px solid rgba(0,223,162,0.2);
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #00ffc3;
          margin-bottom: 20px;
        }
        .rf-sec-label-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #00dfa2;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rf-sec-title {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 900;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        .rf-sec-desc {
          font-size: 1rem;
          color: #8b97a8;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ─── HERO ─── */
        .rf-hero {
          padding: 64px 0 56px;
          position: relative;
          overflow: hidden;
          min-height: 700px;
          display: flex;
          align-items: center;
        }
        .rf-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,223,162,0.1), transparent 60%);
          pointer-events: none;
        }
        .rf-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(0,223,162,0.01) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,223,162,0.01) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }
        .rf-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .rf-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0,223,162,0.1);
          border: 1px solid rgba(0,223,162,0.25);
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #00dfa2;
          margin-bottom: 20px;
        }
        .rf-h1 {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .rf-h1 .rf-gradient {
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .rf-hero-sub {
          font-size: 1.05rem;
          color: #8b97a8;
          margin-bottom: 32px;
          line-height: 1.8;
          max-width: 560px;
        }

        /* Stats strip */
        .rf-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .rf-stat-box {
          padding: 20px;
          text-align: center;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rf-stat-val {
          font-size: 1.65rem;
          font-weight: 900;
          color: #00dfa2;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 6px;
          line-height: 1.1;
        }
        .rf-stat-lab {
          font-size: 0.78rem;
          color: #8b97a8;
          font-weight: 600;
        }

        /* Referral input + buttons */
        .rf-input-group {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .rf-input-group input {
          flex: 1;
          min-width: 0;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #eef2f7;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.88rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .rf-input-group input:focus {
          outline: none;
          border-color: #00dfa2;
          box-shadow: 0 0 0 3px rgba(0,223,162,0.15);
        }
        .rf-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          white-space: nowrap;
        }
        .rf-btn-primary {
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          color: #000;
          box-shadow: 0 8px 32px rgba(0,223,162,0.2);
        }
        .rf-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,223,162,0.35);
        }
        .rf-btn-row {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .rf-btn-row .rf-btn { flex: 1; }
        .rf-social-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .rf-social-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #eef2f7;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .rf-social-btn:hover {
          background: rgba(0,223,162,0.1);
          border-color: rgba(0,223,162,0.4);
          color: #00dfa2;
          transform: translateY(-2px);
        }

        /* Hero right — commission card */
        .rf-glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rf-commission-card {
          padding: 32px;
        }
        .rf-commission-title {
          font-size: 1.25rem;
          font-weight: 900;
          margin-bottom: 24px;
          font-family: 'Outfit', sans-serif;
          color: #eef2f7;
        }
        .rf-tier-item {
          margin-bottom: 22px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .rf-tier-item:last-of-type {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .rf-tier-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .rf-tier-label { font-weight: 700; color: #eef2f7; font-size: 0.95rem; }
        .rf-tier-pct {
          font-size: 1.2rem;
          font-weight: 900;
          color: #00dfa2;
          font-family: 'JetBrains Mono', monospace;
        }
        .rf-tier-track {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.04);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .rf-tier-fill {
          height: 100%;
          background: linear-gradient(90deg, #00dfa2, #00ffc3);
          border-radius: 3px;
        }
        .rf-tier-desc { font-size: 0.82rem; color: #8b97a8; }

        .rf-activity-block {
          margin-top: 26px;
          padding-top: 26px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .rf-activity-title {
          font-weight: 700;
          font-size: 0.78rem;
          color: #8b97a8;
          margin-bottom: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .rf-activity-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .rf-activity-row:last-child { margin-bottom: 0; }
        .rf-activity-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          color: #000;
          font-weight: 900;
          flex-shrink: 0;
        }
        .rf-activity-text {
          flex: 1;
          font-size: 0.85rem;
          color: #8b97a8;
          min-width: 0;
        }
        .rf-activity-user { color: #eef2f7; font-weight: 600; }
        .rf-activity-amount {
          color: #00dfa2;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
        }

        /* How It Works */
        .rf-how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          position: relative;
        }
        .rf-how-card {
          padding: 32px 24px;
          text-align: center;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          position: relative;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .rf-how-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0,223,162,0.25);
        }
        .rf-how-step {
          font-size: 2.6rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          font-family: 'Outfit', sans-serif;
          line-height: 1;
        }
        .rf-how-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: rgba(0,223,162,0.1);
          border: 1px solid rgba(0,223,162,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00dfa2;
          margin: 0 auto 18px;
        }
        .rf-how-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 10px;
          font-family: 'Outfit', sans-serif;
          color: #eef2f7;
        }
        .rf-how-desc { font-size: 0.88rem; color: #8b97a8; line-height: 1.6; }

        /* Commission Tiers — Table (desktop) + Cards (mobile) */
        .rf-table-wrap {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(40px);
        }
        .rf-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .rf-table thead { background: rgba(255,255,255,0.04); }
        .rf-table th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 700;
          color: #8b97a8;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: 'Outfit', sans-serif;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .rf-table td {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          color: #8b97a8;
          font-size: 0.92rem;
          background: rgba(255,255,255,0.01);
        }
        .rf-table tbody tr:last-child td { border-bottom: none; }
        .rf-table tbody tr:hover td { background: rgba(0,223,162,0.03); }

        .rf-tier-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0,223,162,0.1);
          border: 1px solid rgba(0,223,162,0.25);
          border-radius: 6px;
          font-weight: 700;
          color: #00dfa2;
          font-size: 0.82rem;
        }
        .rf-tier-badge.silver {
          background: rgba(168,85,247,0.1);
          border-color: rgba(168,85,247,0.25);
          color: #a855f7;
        }
        .rf-tier-badge.gold {
          background: rgba(240,180,41,0.1);
          border-color: rgba(240,180,41,0.25);
          color: #f0b429;
        }
        .rf-tier-badge.platinum {
          background: rgba(59,130,246,0.1);
          border-color: rgba(59,130,246,0.25);
          color: #3b82f6;
        }
        .rf-tier-badge.diamond {
          background: rgba(236,72,153,0.1);
          border-color: rgba(236,72,153,0.25);
          color: #ec4899;
        }
        .rf-table-mobile { display: none; }
        .rf-tier-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 12px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rf-tier-card:last-child { margin-bottom: 0; }
        .rf-tier-card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          font-size: 0.88rem;
        }
        .rf-tier-card-key { color: #8b97a8; }
        .rf-tier-card-val { color: #eef2f7; font-weight: 600; }

        /* Partner Program — 2-col */
        .rf-zero-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .rf-zero-content h3 {
          font-size: 1.65rem;
          font-weight: 900;
          margin-bottom: 22px;
          font-family: 'Outfit', sans-serif;
          color: #eef2f7;
        }
        .rf-feature-list { list-style: none; padding: 0; margin: 0 0 28px; }
        .rf-feature-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 0.95rem;
          color: #eef2f7;
        }
        .rf-feature-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0,223,162,0.15);
          color: #00dfa2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rf-partner-visual {
          padding: 32px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rf-partner-benefit {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        .rf-partner-benefit:last-child { margin-bottom: 0; }
        .rf-partner-benefit-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(0,223,162,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00dfa2;
          flex-shrink: 0;
        }
        .rf-partner-benefit-text h4 {
          font-weight: 700;
          color: #eef2f7;
          margin: 0 0 4px;
          font-size: 0.95rem;
          font-family: 'Outfit', sans-serif;
        }
        .rf-partner-benefit-text p {
          font-size: 0.84rem;
          color: #8b97a8;
          margin: 0;
          line-height: 1.5;
        }

        /* Why Refer */
        .rf-rewards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .rf-reward-card {
          padding: 36px 28px;
          text-align: center;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .rf-reward-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0,223,162,0.3);
          box-shadow: 0 12px 48px rgba(0,223,162,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rf-pillar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }
        .rf-pillar.green {
          background: rgba(0,223,162,0.1);
          color: #00dfa2;
          border: 1px solid rgba(0,223,162,0.25);
        }
        .rf-pillar.purple {
          background: rgba(168,85,247,0.1);
          color: #a855f7;
          border: 1px solid rgba(168,85,247,0.25);
        }
        .rf-pillar.blue {
          background: rgba(59,130,246,0.1);
          color: #3b82f6;
          border: 1px solid rgba(59,130,246,0.25);
        }
        .rf-reward-stat {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
          line-height: 1;
        }
        .rf-reward-stat.green { color: #00dfa2; }
        .rf-reward-stat.purple { color: #a855f7; }
        .rf-reward-stat.blue { color: #3b82f6; }
        .rf-reward-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 10px;
          font-family: 'Outfit', sans-serif;
          color: #eef2f7;
        }
        .rf-reward-desc {
          font-size: 0.88rem;
          color: #8b97a8;
          margin-bottom: 18px;
          line-height: 1.65;
        }
        .rf-req-tag {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #8b97a8;
        }

        /* Leaderboard */
        .rf-rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          color: #000;
          font-weight: 900;
          font-size: 0.88rem;
          flex-shrink: 0;
        }
        .rf-rank-badge.silver {
          background: linear-gradient(135deg, #a855f7, #c084fc);
          color: #fff;
        }
        .rf-rank-badge.gold {
          background: linear-gradient(135deg, #f0b429, #fcd34d);
          color: #07080c;
        }
        .rf-rank-badge.default {
          background: rgba(255,255,255,0.06);
          color: #eef2f7;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .rf-user-info { display: flex; align-items: center; gap: 12px; }
        .rf-user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #eef2f7;
          font-size: 0.78rem;
          flex-shrink: 0;
        }
        .rf-user-name { color: #eef2f7; font-weight: 600; }
        .rf-earned {
          color: #00dfa2;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
        }

        /* FAQ */
        .rf-faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 780px;
          margin: 0 auto;
        }
        .rf-faq-item {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .rf-faq-item.open { border-color: rgba(0,223,162,0.3); }
        .rf-faq-q {
          width: 100%;
          padding: 20px 22px;
          background: none;
          border: none;
          color: #eef2f7;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          text-align: left;
          line-height: 1.4;
          transition: background 0.2s ease;
        }
        .rf-faq-q:hover { background: rgba(0,223,162,0.04); }
        .rf-faq-toggle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0,223,162,0.1);
          border: 1px solid rgba(0,223,162,0.25);
          color: #00dfa2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rf-faq-item.open .rf-faq-toggle {
          background: #00dfa2;
          color: #000;
          border-color: #00dfa2;
        }
        .rf-faq-a {
          padding: 0 22px 22px;
          color: #8b97a8;
          font-size: 0.9rem;
          line-height: 1.75;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .rf-faq-a-inner { padding-top: 18px; }

        /* CTA Banner */
        .rf-cta-section {
          padding: 80px 0;
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.01);
        }
        .rf-cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,223,162,0.15), transparent 70%);
          pointer-events: none;
        }
        .rf-cta-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(0,223,162,0.01) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,223,162,0.01) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }
        .rf-cta-inner {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .rf-cta-title {
          font-size: clamp(2rem, 4vw, 2.6rem);
          font-weight: 900;
          margin-bottom: 18px;
          font-family: 'Outfit', sans-serif;
          color: #eef2f7;
          letter-spacing: -0.02em;
        }
        .rf-cta-sub {
          color: #8b97a8;
          margin-bottom: 28px;
          font-size: 1.05rem;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }
        .rf-cta-input-group {
          display: flex;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
        }
        .rf-cta-input-group input {
          flex: 1;
          min-width: 0;
          padding: 14px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #eef2f7;
          font-size: 0.92rem;
          font-family: inherit;
        }
        .rf-cta-input-group input::placeholder { color: #4a5468; }
        .rf-cta-input-group input:focus {
          outline: none;
          border-color: #00dfa2;
          box-shadow: 0 0 0 3px rgba(0,223,162,0.15);
        }

        /* Footer */
        .rf-footer {
          background: #0a0d15;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 36px 0 28px;
        }
        .rf-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .rf-footer-links {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
        }
        .rf-footer-link {
          font-size: 0.82rem;
          color: #8b97a8;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .rf-footer-link:hover { color: #00dfa2; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .rf-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .rf-hero { min-height: auto; padding: 56px 0 48px; }
          .rf-stats-strip { grid-template-columns: repeat(2, 1fr); }
          .rf-how-grid { grid-template-columns: repeat(2, 1fr); }
          .rf-rewards-grid { grid-template-columns: repeat(2, 1fr); }
          .rf-zero-layout { grid-template-columns: 1fr; gap: 36px; }
        }

        @media (max-width: 768px) {
          .rf-sec { padding: 56px 0; }
          .rf-nav-links { display: none; }
          .rf-nav-right .rf-btn-sm { display: none; }
          .rf-hamburger { display: flex; }
          .rf-stats-strip { grid-template-columns: 1fr; }
          .rf-how-grid { grid-template-columns: 1fr; }
          .rf-rewards-grid { grid-template-columns: 1fr; }
          .rf-cta-input-group { flex-direction: column; }
          .rf-footer-row { flex-direction: column; text-align: center; }
          .rf-footer-links { justify-content: center; }
          .rf-table-wrap { display: none; }
          .rf-table-mobile { display: block; }
          .rf-input-group { flex-direction: column; }
          .rf-input-group .rf-btn { width: 100%; }
        }

        @media (max-width: 600px) {
          .rf-hero { padding: 40px 0 32px; }
          .rf-h1 { font-size: 2rem; }
          .rf-hero-sub { font-size: 0.95rem; }
          .rf-commission-card { padding: 24px; }
          .rf-partner-visual { padding: 24px; }
          .rf-reward-card { padding: 28px 22px; }
          .rf-cta-section { padding: 56px 0; }
        }
      `}</style>

      {/* ─── TICKER (reused from Welcome Bonus pattern) ─── */}
      <div className="rf-ticker-wrap">
        <TickerBar />
      </div>

      {/* ─── NAV ─── */}
      <nav className="rf-nav">
        <div className="rf-nav-inner">
          <Link to="/main/dashboard" className="rf-logo" aria-label={brandName}>
            <div className="rf-logo-icon">1TM</div>
            <div className="rf-logo-text">
              {brandHead ? (
                <>
                  <em>{brandHead}</em> {brandTail}
                </>
              ) : (
                <em>{brandTail}</em>
              )}
            </div>
          </Link>

          <div className="rf-nav-links">
            {NAV_ANCHORS.map((l) => (
              <button
                key={l.href}
                type="button"
                className="rf-nav-link"
                onClick={() => smoothScroll(l.href)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="rf-nav-right">
            <Link to="/main/dashboard" className="rf-btn-sm">
              Get Started
              <ArrowRight className="h-[0.85rem] w-[0.85rem]" />
            </Link>
            <div className="rf-nav-avatar" aria-label="User initials">
              {initials}
            </div>
            <button
              type="button"
              className="rf-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="rf-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="rf-mobile-menu">
                {NAV_ANCHORS.map((l) => (
                  <button
                    key={l.href}
                    type="button"
                    className="rf-nav-link"
                    onClick={() => {
                      setMenuOpen(false);
                      smoothScroll(l.href);
                    }}
                  >
                    {l.label}
                  </button>
                ))}
                <Link
                  to="/main/dashboard"
                  className="rf-btn-sm"
                  style={{ marginTop: 8, justifyContent: "center" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                  <ArrowRight className="h-[0.85rem] w-[0.85rem]" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section className="rf-hero" id="rf-hero">
        <div className="rf-container" style={{ maxWidth: 1400, padding: "0 40px", width: "100%" }}>
          <div className="rf-hero-grid">
            <motion.div {...revealProps}>
              <div className="rf-hero-badge">
                <Gift className="h-4 w-4" />
                Referral Program
              </div>
              <h1 className="rf-h1">
                Earn up to <span className="rf-gradient">$5,000</span> Per Referral
              </h1>
              <p className="rf-hero-sub">
                Share your unique referral link and earn competitive commissions
                every time your friends trade. The more referrals you bring, the
                higher your earning tier and rewards.
              </p>

              <div className="rf-stats-strip">
                {HERO_STATS.map((s, i) => (
                  <div key={i} className="rf-stat-box">
                    <div className="rf-stat-val">{s.value}</div>
                    <div className="rf-stat-lab">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rf-input-group">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  aria-label="Your referral link"
                />
                <button
                  type="button"
                  className="rf-btn rf-btn-primary"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="rf-btn-row">
                <button type="button" className="rf-btn rf-btn-primary">
                  Send Gift Link
                </button>
              </div>

              <div className="rf-social-row" role="group" aria-label="Share buttons">
                {SOCIAL_SHARE.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      className="rf-social-btn"
                      title={s.label}
                      aria-label={s.label}
                    >
                      <Icon className="h-[1.05rem] w-[1.05rem]" />
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div {...revealProps}>
              <div className="rf-glass rf-commission-card">
                <div className="rf-commission-title">Commission Structure</div>
                {COMMISSION_STRUCTURE.map((t) => (
                  <div key={t.tier} className="rf-tier-item">
                    <div className="rf-tier-head">
                      <span className="rf-tier-label">{t.tier}</span>
                      <span className="rf-tier-pct">{t.pct}</span>
                    </div>
                    <div className="rf-tier-track">
                      <div
                        className="rf-tier-fill"
                        style={{ width: `${t.width}%` }}
                      />
                    </div>
                    <div className="rf-tier-desc">{t.desc}</div>
                  </div>
                ))}

                <div className="rf-activity-block">
                  <div className="rf-activity-title">Recent Activity</div>
                  {RECENT_ACTIVITY.map((a, i) => (
                    <div key={i} className="rf-activity-row">
                      <div className="rf-activity-avatar">{a.initials}</div>
                      <div className="rf-activity-text">
                        <span className="rf-activity-user">{a.user}</span> just
                        traded
                      </div>
                      <div className="rf-activity-amount">{a.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="rf-sec rf-sec-dark" id="rf-how-it-works">
        <div className="rf-container">
          <motion.div {...revealProps} className="rf-sec-header">
            <div className="rf-sec-label">
              <span className="rf-sec-label-icon">
                <Play className="h-[0.6rem] w-[0.6rem]" fill="#000" />
              </span>
              Process
            </div>
            <h2 className="rf-sec-title">How It Works</h2>
            <p className="rf-sec-desc">
              Four simple steps to start earning money with 1 Trade Market
              referrals.
            </p>
          </motion.div>

          <div className="rf-how-grid">
            {HOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                    delay: i * 0.05,
                  }}
                  className="rf-how-card"
                >
                  <div className="rf-how-step">{step.num}</div>
                  <div className="rf-how-icon">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="rf-how-title">{step.title}</h3>
                  <p className="rf-how-desc">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── COMMISSION TIERS ─── */}
      <section className="rf-sec" id="rf-commission-tiers">
        <div className="rf-container">
          <motion.div {...revealProps} className="rf-sec-header">
            <div className="rf-sec-label">
              <span className="rf-sec-label-icon">
                <Layers className="h-[0.6rem] w-[0.6rem]" />
              </span>
              Levels
            </div>
            <h2 className="rf-sec-title">Commission Tiers</h2>
            <p className="rf-sec-desc">
              Unlock higher commissions and exclusive bonuses as you bring more
              referrals to the platform.
            </p>
          </motion.div>

          <motion.div {...revealProps} className="rf-table-wrap">
            <table className="rf-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Referral Volume</th>
                  <th>Commission Rate</th>
                  <th>Bonus Per Referral</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {COMMISSION_TIERS.map((t) => (
                  <tr key={t.tier}>
                    <td>
                      <span
                        className={`rf-tier-badge${
                          t.tone === "bronze" ? "" : ` ${t.tone}`
                        }`}
                      >
                        {t.tier}
                      </span>
                    </td>
                    <td>{t.volume}</td>
                    <td>
                      <strong style={{ color: "#eef2f7" }}>{t.rate}</strong>
                    </td>
                    <td>
                      {t.bonus === "—" ? (
                        "—"
                      ) : (
                        <strong style={{ color: "#eef2f7" }}>{t.bonus}</strong>
                      )}
                    </td>
                    <td>
                      {t.current ? (
                        <span style={{ color: "#00dfa2", fontWeight: 700 }}>
                          {t.status}
                        </span>
                      ) : (
                        t.status
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div {...revealProps} className="rf-table-mobile">
            {COMMISSION_TIERS.map((t) => (
              <div key={t.tier} className="rf-tier-card">
                <div
                  className="rf-tier-card-row"
                  style={{ paddingTop: 0, alignItems: "center" }}
                >
                  <span
                    className={`rf-tier-badge${
                      t.tone === "bronze" ? "" : ` ${t.tone}`
                    }`}
                  >
                    {t.tier}
                  </span>
                  {t.current ? (
                    <span style={{ color: "#00dfa2", fontWeight: 700, fontSize: "0.82rem" }}>
                      {t.status}
                    </span>
                  ) : (
                    <span style={{ color: "#8b97a8", fontSize: "0.82rem" }}>
                      {t.status}
                    </span>
                  )}
                </div>
                <div className="rf-tier-card-row">
                  <span className="rf-tier-card-key">Volume</span>
                  <span className="rf-tier-card-val">{t.volume}</span>
                </div>
                <div className="rf-tier-card-row">
                  <span className="rf-tier-card-key">Rate</span>
                  <span className="rf-tier-card-val">{t.rate}</span>
                </div>
                <div className="rf-tier-card-row">
                  <span className="rf-tier-card-key">Bonus</span>
                  <span className="rf-tier-card-val">{t.bonus}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PARTNER PROGRAM ─── */}
      <section className="rf-sec rf-sec-dark" id="rf-partner">
        <div className="rf-container">
          <motion.div {...revealProps} className="rf-sec-header">
            <div className="rf-sec-label">
              <span className="rf-sec-label-icon">
                <Handshake className="h-[0.6rem] w-[0.6rem]" />
              </span>
              Partnership
            </div>
            <h2 className="rf-sec-title">Partner Program</h2>
            <p className="rf-sec-desc">
              For influencers, content creators, and large-scale operators
              looking for dedicated support.
            </p>
          </motion.div>

          <div className="rf-zero-layout">
            <motion.div {...revealProps} className="rf-zero-content">
              <h3>Influencer &amp; Creator Benefits</h3>
              <ul className="rf-feature-list">
                {PARTNER_FEATURES.map((f) => (
                  <li key={f}>
                    <span className="rf-feature-check">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/main/chat"
                className="rf-btn rf-btn-primary"
                style={{ display: "inline-flex" }}
              >
                <ArrowRight className="h-4 w-4" />
                Apply for Partner Program
              </Link>
            </motion.div>

            <motion.div {...revealProps} className="rf-partner-visual">
              {PARTNER_BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rf-partner-benefit">
                    <div className="rf-partner-benefit-icon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="rf-partner-benefit-text">
                      <h4>{b.title}</h4>
                      <p>{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHY REFER ─── */}
      <section className="rf-sec">
        <div className="rf-container">
          <motion.div {...revealProps} className="rf-sec-header">
            <div className="rf-sec-label">
              <span className="rf-sec-label-icon">
                <Star className="h-[0.6rem] w-[0.6rem]" />
              </span>
              Benefits
            </div>
            <h2 className="rf-sec-title">Why Refer with 1 Trade</h2>
            <p className="rf-sec-desc">
              Discover the advantages of our referral program compared to other
              platforms.
            </p>
          </motion.div>

          <div className="rf-rewards-grid">
            {REWARDS.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                    delay: i * 0.05,
                  }}
                  className="rf-reward-card"
                >
                  <div className={`rf-pillar ${r.tone}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`rf-reward-stat ${r.tone}`}>{r.stat}</div>
                  <h3 className="rf-reward-title">{r.title}</h3>
                  <p className="rf-reward-desc">{r.desc}</p>
                  <span className="rf-req-tag">{r.tag}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TOP EARNERS ─── */}
      <section className="rf-sec rf-sec-dark">
        <div className="rf-container">
          <motion.div {...revealProps} className="rf-sec-header">
            <div className="rf-sec-label">
              <span className="rf-sec-label-icon">
                <Trophy className="h-[0.6rem] w-[0.6rem]" />
              </span>
              Rankings
            </div>
            <h2 className="rf-sec-title">Top Earners This Month</h2>
            <p className="rf-sec-desc">
              See who's earning the most with the 1 Trade referral program. Will
              you be next?
            </p>
          </motion.div>

          <motion.div {...revealProps} className="rf-table-wrap">
            <table className="rf-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Referrals</th>
                  <th>Earned (Monthly)</th>
                  <th>Earned (Total)</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                {TOP_EARNERS.map((e) => (
                  <tr key={e.rank}>
                    <td>
                      <span className={`rf-rank-badge ${e.rankTone}`}>
                        {e.rank}
                      </span>
                    </td>
                    <td>
                      <div className="rf-user-info">
                        <div className="rf-user-avatar">{e.initials}</div>
                        <span className="rf-user-name">{e.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "#eef2f7", fontWeight: 600 }}>
                      {e.referrals}
                    </td>
                    <td>
                      <span className="rf-earned">{e.monthly}</span>
                    </td>
                    <td>
                      <span className="rf-earned">{e.total}</span>
                    </td>
                    <td>
                      <span className={`rf-tier-badge ${e.tier}`}>
                        {e.tierLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div {...revealProps} className="rf-table-mobile">
            {TOP_EARNERS.map((e) => (
              <div key={e.rank} className="rf-tier-card">
                <div className="rf-tier-card-row" style={{ paddingTop: 0 }}>
                  <div className="rf-user-info">
                    <span className={`rf-rank-badge ${e.rankTone}`}>
                      {e.rank}
                    </span>
                    <span className="rf-user-name">{e.name}</span>
                  </div>
                  <span className={`rf-tier-badge ${e.tier}`}>
                    {e.tierLabel}
                  </span>
                </div>
                <div className="rf-tier-card-row">
                  <span className="rf-tier-card-key">Referrals</span>
                  <span className="rf-tier-card-val">{e.referrals}</span>
                </div>
                <div className="rf-tier-card-row">
                  <span className="rf-tier-card-key">Monthly</span>
                  <span className="rf-earned">{e.monthly}</span>
                </div>
                <div className="rf-tier-card-row">
                  <span className="rf-tier-card-key">Total</span>
                  <span className="rf-earned">{e.total}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="rf-sec" id="rf-faq">
        <div className="rf-container">
          <motion.div {...revealProps} className="rf-sec-header">
            <div className="rf-sec-label">
              <span className="rf-sec-label-icon">
                <HelpCircle className="h-[0.6rem] w-[0.6rem]" />
              </span>
              Questions
            </div>
            <h2 className="rf-sec-title">Frequently Asked Questions</h2>
            <p className="rf-sec-desc">
              Everything you need to know about the 1 Trade referral program and
              earning commissions.
            </p>
          </motion.div>

          <motion.div {...revealProps} className="rf-faq-list">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rf-faq-item${isOpen ? " open" : ""}`}
                >
                  <button
                    type="button"
                    className="rf-faq-q"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="rf-faq-toggle"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
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
                        <div className="rf-faq-a">
                          <div className="rf-faq-a-inner">{item.a}</div>
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

      {/* ─── CTA: Start Earning Today ─── */}
      <section className="rf-cta-section">
        <div className="rf-container">
          <motion.div {...revealProps} className="rf-cta-inner">
            <h2 className="rf-cta-title">Start Earning Today</h2>
            <p className="rf-cta-sub">
              Join thousands of referrers earning passive income. Get your unique
              link and start sharing now.
            </p>
            <form
              className="rf-cta-input-group"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="button" className="rf-btn rf-btn-primary">
                Claim Your Link
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="rf-footer">
        <div className="rf-container">
          <div className="rf-footer-row">
            <Link to="/main/dashboard" className="rf-logo" aria-label={brandName}>
              <div className="rf-logo-icon" style={{ width: 32, height: 32, fontSize: "0.72rem", borderRadius: 6 }}>
                1TM
              </div>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#8b97a8" }}>
                © 2024–2026 {brandName}
              </span>
            </Link>
            <div className="rf-footer-links">
              {FOOTER_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="rf-footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

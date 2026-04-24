import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TickerBar } from "@/components/dashboard/TickerBar";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";
import {
  Gift,
  Percent,
  Banknote,
  LineChart,
  Check,
  CircleCheck,
  ArrowLeftRight,
  Rocket,
  Info,
  Plus,
  Menu,
  X as XIcon,
  Sprout,
  Coins,
  Zap,
  Flame,
  Gem,
  Crown,
  Trophy,
  ArrowRight,
  ShieldHalf,
  Lock,
  Users,
  Clock,
  Twitter,
  Send,
  MessageCircle,
  Youtube,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────
// STATIC CONTENT (presentational only — from html_files/welcome-bonus.html)
// ───────────────────────────────────────────────────────────────

// Reference navbar: Markets, Features, Security, App, VIP Plans, Fund Protection.
// Per approval: drop "App", drop "Log In"; map "Features" → /main/trade-access.
const NAV_LINKS = [
  { label: "Markets", to: "/main/market" },
  { label: "Features", to: "/main/trade-access" },
  { label: "Security", to: "/main/security" },
  { label: "VIP Plans", to: "/main/trading-plans" },
  { label: "Fund Protection", to: "/main/fund-protection" },
];

const BONUS_STEPS = [
  {
    num: 1,
    title: "Sign Up & Verify KYC",
    desc: "Create your account and complete identity verification.",
    reward: { text: "$10 Bonus", tone: "green" as const, icon: Gift },
  },
  {
    num: 2,
    title: "First Deposit",
    desc: "Deposit $100 or more within 7 days of registration.",
    reward: { text: "$50 Bonus", tone: "green" as const, icon: Gift },
  },
  {
    num: 3,
    title: "Trade $10,000+ Volume",
    desc: "Reach $10K in cumulative trading volume within 30 days.",
    reward: { text: "$200 Bonus", tone: "bonus" as const, icon: Trophy },
  },
  {
    num: 4,
    title: "VIP Volume Tiers",
    desc: "Unlock additional bonuses up to $4,740 with higher volume tiers.",
    reward: { text: "Up to $4,740", tone: "bonus" as const, icon: Crown },
  },
];

const REWARDS = [
  {
    icon: Percent,
    bonusPre: "",
    bonusAccent: "0%",
    bonusTail: " Fees",
    title: "Zero Trading Fees",
    desc: "Enjoy 30 full days of zero maker and taker fees on all spot trading pairs. No limits on volume.",
    req: "Automatically applied on signup",
  },
  {
    icon: Banknote,
    bonusPre: "Up to ",
    bonusAccent: "$260",
    bonusTail: "",
    title: "Deposit Bonuses",
    desc: "Earn instant trading credits based on your deposit amount. Higher deposits unlock bigger bonuses.",
    req: "Minimum deposit: $100",
  },
  {
    icon: LineChart,
    bonusPre: "Up to ",
    bonusAccent: "$4,740",
    bonusTail: "",
    title: "Volume Bonuses",
    desc: "Hit cumulative trading milestones to unlock tiered rewards. Trade spot or futures to qualify.",
    req: "Trade within 30 days of signup",
  },
];

const ZERO_FEATURES = [
  {
    title: "All Spot Pairs Included",
    desc: "Trade any of our 800+ spot pairs with zero fees. No pair restrictions.",
  },
  {
    title: "Unlimited Volume",
    desc: "No caps on trading volume. Whether you trade $100 or $10M, fees stay at 0%.",
  },
  {
    title: "Maker & Taker Both Zero",
    desc: "Both sides of the order book, zero fees. No hidden markups or spreads.",
  },
  {
    title: "Automatically Activated",
    desc: "No code needed. Zero-fee period starts the moment your account is verified.",
  },
];

const FEE_COMPARE: { icon: React.ElementType; label: string; other: string; ours: string }[] = [
  { icon: ArrowLeftRight, label: "Spot Maker Fee", other: "0.10%", ours: "0.00%" },
  { icon: ArrowLeftRight, label: "Spot Taker Fee", other: "0.10%", ours: "0.00%" },
  { icon: Rocket, label: "Futures Maker", other: "0.02%", ours: "0.01%" },
  { icon: Rocket, label: "Futures Taker", other: "0.06%", ours: "0.03%" },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Create Account",
    desc: "Sign up with email in under 60 seconds.",
  },
  {
    num: "02",
    title: "Verify Identity",
    desc: "Quick automated KYC, takes ~2 minutes.",
  },
  {
    num: "03",
    title: "Deposit Funds",
    desc: "Deposit $100+ via crypto, card, or bank.",
  },
  {
    num: "04",
    title: "Start Trading",
    desc: "Fees auto-waived. Bonuses unlock as you trade.",
  },
];

const TIERS: {
  icon: React.ElementType;
  tier: string;
  volume: string;
  bonus: string;
  timeframe: string;
  status: string;
  statusTone: "accent" | "muted";
}[] = [
  {
    icon: Sprout,
    tier: "Starter",
    volume: "$0",
    bonus: "$10",
    timeframe: "Instant",
    status: "On Signup + KYC",
    statusTone: "accent",
  },
  {
    icon: Coins,
    tier: "Depositor",
    volume: "$100+ deposit",
    bonus: "$50",
    timeframe: "Within 7 days",
    status: "First deposit required",
    statusTone: "muted",
  },
  {
    icon: Zap,
    tier: "Active",
    volume: "$10,000",
    bonus: "$200",
    timeframe: "30 days",
    status: "Trade to unlock",
    statusTone: "muted",
  },
  {
    icon: Flame,
    tier: "Pro",
    volume: "$100,000",
    bonus: "$500",
    timeframe: "30 days",
    status: "Trade to unlock",
    statusTone: "muted",
  },
  {
    icon: Gem,
    tier: "Elite",
    volume: "$500,000",
    bonus: "$1,500",
    timeframe: "30 days",
    status: "Trade to unlock",
    statusTone: "muted",
  },
  {
    icon: Crown,
    tier: "VIP",
    volume: "$1,000,000+",
    bonus: "$2,740",
    timeframe: "30 days",
    status: "Trade to unlock",
    statusTone: "muted",
  },
];

const FAQS = [
  {
    q: "Who is eligible for the welcome bonus?",
    a: "All new users who register for a 1 Trade Market account are eligible. The offer applies to accounts created during the promotional period. Existing users and sub-accounts are not eligible.",
  },
  {
    q: "How long do I have to claim the bonuses?",
    a: "The zero-fee period starts immediately upon KYC verification and lasts exactly 30 calendar days. Deposit bonuses must be claimed within 7 days of registration. Volume bonuses must be earned within 30 days of registration.",
  },
  {
    q: "Can I withdraw the bonus directly?",
    a: "Bonuses are credited as trading credits and cannot be withdrawn directly. However, any profits earned using the bonus credits are fully withdrawable. There is a 1x trading volume requirement on bonus credits before withdrawal of profits.",
  },
  {
    q: "Does the 0% fee apply to futures trading too?",
    a: "The zero-fee promotion applies to all spot trading pairs. Futures trading receives a discounted rate of 0.01% maker / 0.03% taker during the 30-day period, still significantly below industry average.",
  },
  {
    q: "Is there a minimum deposit to get started?",
    a: "There is no minimum deposit to create an account or to benefit from the zero-fee period. However, to unlock the deposit bonus tier, a minimum first deposit of $100 (or equivalent in crypto) is required within 7 days.",
  },
  {
    q: "What happens after 30 days?",
    a: "After the 30-day promotional period, your account moves to our standard fee schedule starting at 0.05% maker / 0.10% taker. High-volume traders qualify for our VIP tier program with further discounts.",
  },
];

const CTA_TRUST = [
  { icon: ShieldHalf, label: "Licensed & Regulated" },
  { icon: Lock, label: "Bank-Grade Security" },
  { icon: Users, label: "12M+ Traders" },
  { icon: Clock, label: "24/7 Support" },
];

const FOOTER_LINKS = [
  { label: "Home", to: "/main/dashboard" },
  { label: "Markets", to: "/main/market" },
  { label: "Features", to: "/main/trade-access" },
  { label: "Security", to: "/main/security" },
];

const FOOTER_SOCIALS = [
  { icon: Twitter, label: "Twitter" },
  { icon: Send, label: "Telegram" },
  { icon: MessageCircle, label: "Discord" },
  { icon: Youtube, label: "YouTube" },
];

const revealProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ───────────────────────────────────────────────────────────────
// PAGE
// ───────────────────────────────────────────────────────────────

export default function WelcomeBonusPage() {
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
  const [email, setEmail] = useState("");

  // Countdown — 14 days from mount, resolves at 23:59:59 of target day.
  // Presentational only, no persistence.
  const endRef = useRef<number | null>(null);
  const [cd, setCd] = useState({ days: "14", hours: "00", mins: "00", secs: "00" });

  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 14);
    end.setHours(23, 59, 59, 0);
    endRef.current = end.getTime();

    const tick = () => {
      if (endRef.current == null) return;
      const diff = endRef.current - Date.now();
      if (diff <= 0) {
        setCd({ days: "00", hours: "00", mins: "00", secs: "00" });
        return;
      }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setCd({ days: pad(d), hours: pad(h), mins: pad(m), secs: pad(s) });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Hide MainLayout chrome while this page is mounted (same pattern as
  // fund-protection-page.tsx and social-responsibility-page.tsx).
  useEffect(() => {
    document.body.classList.add("wb-active");
    return () => {
      document.body.classList.remove("wb-active");
    };
  }, []);

  // Page-scoped font loading.
  useEffect(() => {
    if (document.querySelector<HTMLLinkElement>('link[data-wb-fonts="1"]'))
      return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    link.dataset.wbFonts = "1";
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch {
        /* noop */
      }
    };
  }, []);

  const brandParts = brandName.split(" ").filter(Boolean);
  const brandHead = brandParts.length > 1 ? brandParts.slice(0, -1).join(" ") : "";
  const brandTail = brandParts[brandParts.length - 1] || brandName;

  return (
    <div
      className="wb-root w-full"
      style={{
        background: "linear-gradient(135deg, #07080c 0%, #0a0d15 100%)",
        color: "#eef2f7",
        fontFamily: "Inter, -apple-system, 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        /* ─── Chrome-hiding (body.wb-active) ─── */
        body.wb-active .fixed.top-0.left-0.right-0.z-20,
        body.wb-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.wb-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.wb-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }

        .wb-root { line-height: 1.5; }
        .wb-heading { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; }
        .wb-mono { font-family: 'JetBrains Mono', monospace; }

        /* ─── TICKER ─── */
        .wb-ticker-wrap { position: relative; z-index: 299; }
        .wb-ticker-wrap > div {
          height: 34px !important;
          background: rgba(7,8,12,0.65) !important;
          border-bottom: 1px solid rgba(255,255,255,0.04) !important;
        }

        /* ─── NAV ─── */
        .wb-nav {
          position: sticky;
          top: 0;
          z-index: 200;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .wb-nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          gap: 16px;
        }
        .wb-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          color: #eef2f7;
          text-decoration: none;
        }
        .wb-logo-icon {
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
        .wb-logo-text {
          font-weight: 800;
          font-size: 1rem;
          color: #eef2f7;
          white-space: nowrap;
          font-family: 'Outfit', sans-serif;
        }
        .wb-logo-text em {
          font-style: normal;
          color: #00dfa2;
          font-weight: 800;
        }
        .wb-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .wb-nav-link {
          padding: 8px 14px;
          font-size: 0.835rem;
          font-weight: 500;
          color: #8b97a8;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .wb-nav-link:hover {
          color: #eef2f7;
          background: rgba(255,255,255,0.06);
        }
        .wb-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .wb-nav-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.08);
          margin: 0 4px;
        }
        .wb-btn-sm {
          padding: 7px 16px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .wb-btn-accent {
          background: linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%);
          color: #000;
          font-weight: 700;
          border: none;
          box-shadow: 0 8px 32px rgba(0,223,162,0.25), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .wb-btn-accent:hover {
          box-shadow: 0 12px 48px rgba(0,223,162,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }
        .wb-nav-avatar {
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
          cursor: pointer;
          border: 1.5px solid rgba(0,223,162,0.3);
          flex-shrink: 0;
        }
        .wb-hamburger {
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
        .wb-hamburger:hover {
          color: #eef2f7;
          background: rgba(255,255,255,0.06);
        }

        /* ─── HERO ─── */
        .wb-container { max-width: 1280px; margin: 0 auto; padding: 0 20px; }
        .wb-hero {
          padding: 64px 0 48px;
          position: relative;
          overflow: hidden;
          min-height: 560px;
          display: flex;
          align-items: center;
        }
        .wb-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,223,162,0.1), transparent 60%);
          pointer-events: none;
        }
        .wb-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(0,223,162,0.01) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,223,162,0.01) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }
        .wb-hero-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .wb-promo-badge {
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
        .wb-promo-badge-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #00dfa2;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
        }
        .wb-h1 {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          font-family: 'Outfit', sans-serif;
        }
        .wb-highlight {
          background: linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .wb-big-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(2.8rem, 5vw, 4rem);
          background: linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .wb-hero-sub {
          font-size: 1.05rem;
          color: #8b97a8;
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 520px;
        }

        /* Countdown */
        .wb-countdown {
          display: flex;
          gap: 10px;
          margin-bottom: 32px;
        }
        .wb-cd-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          text-align: center;
          min-width: 72px;
          backdrop-filter: blur(40px);
        }
        .wb-cd-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.8rem;
          font-weight: 800;
          color: #00dfa2;
          line-height: 1;
        }
        .wb-cd-lab {
          font-size: 0.65rem;
          color: #4a5468;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
          font-weight: 600;
        }
        .wb-cd-sep {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.6rem;
          font-weight: 700;
          color: #4a5468;
          display: flex;
          align-items: center;
          padding-bottom: 12px;
        }

        /* Signup input */
        .wb-hero-signup {
          display: flex;
          gap: 0;
          max-width: 480px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(40px);
          margin-bottom: 14px;
        }
        .wb-hero-signup input {
          flex: 1;
          padding: 15px 16px;
          background: transparent;
          border: none;
          color: #eef2f7;
          font-size: 0.9rem;
          outline: none;
          min-width: 0;
          font-family: inherit;
        }
        .wb-hero-signup input::placeholder {
          color: #4a5468;
        }
        .wb-hero-signup a {
          border-radius: 0;
          padding: 15px 28px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%);
          color: #000;
          font-weight: 700;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .wb-hero-signup a:hover {
          box-shadow: 0 12px 48px rgba(0,223,162,0.4);
        }
        .wb-signup-note {
          font-size: 0.75rem;
          color: #4a5468;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wb-signup-note svg { color: #00dfa2; }

        /* Bonus card (right side of hero) */
        .wb-bonus-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,223,162,0.1);
          backdrop-filter: blur(40px);
          position: relative;
        }
        .wb-bc-header {
          background: linear-gradient(135deg, rgba(0,223,162,0.08), rgba(0,223,162,0.02));
          padding: 28px 28px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
        }
        .wb-bc-header::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,223,162,0.1), transparent 70%);
          pointer-events: none;
        }
        .wb-bc-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00dfa2;
          animation: wb-pulse 2s infinite;
        }
        @keyframes wb-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,223,162,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(0,223,162,0); }
        }
        .wb-bc-progress-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #00dfa2 0%, #00ffc3 100%);
          width: 0%;
          transition: width 1.5s cubic-bezier(0.4,0,0.2,1);
        }

        /* ─── SECTION CORE ─── */
        .wb-sec { padding: 72px 0; }
        .wb-sec-dark { background: #0a0d15; }
        .wb-sec-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #00dfa2;
          margin-bottom: 8px;
          font-family: 'Outfit', sans-serif;
        }
        .wb-sec-title {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 800;
          margin-bottom: 12px;
          line-height: 1.2;
          font-family: 'Outfit', sans-serif;
        }
        .wb-sec-desc {
          font-size: 0.95rem;
          color: #8b97a8;
          max-width: 560px;
          line-height: 1.7;
        }
        .wb-sec-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .wb-sec-header .wb-sec-desc { margin: 0 auto; }

        /* Rewards */
        .wb-rewards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .wb-reward-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 32px 24px;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
          backdrop-filter: blur(40px);
        }
        .wb-reward-card:hover {
          border-color: rgba(0,223,162,0.15);
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0,223,162,0.15);
        }

        /* Zero section */
        .wb-zero-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .wb-zero-visual {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(40px);
        }
        .wb-zero-visual::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 30%, rgba(0,223,162,0.05), transparent 65%);
          pointer-events: none;
        }

        /* How it works */
        .wb-how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          position: relative;
        }
        .wb-how-grid::before {
          content: '';
          position: absolute;
          top: 36px;
          left: 12%;
          right: 12%;
          height: 1px;
          background: repeating-linear-gradient(90deg, #00dfa2 0, #00dfa2 4px, transparent 4px, transparent 12px);
          opacity: 0.2;
        }
        .wb-how-num {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 2px solid rgba(0,223,162,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.2rem;
          font-weight: 800;
          color: #00dfa2;
          position: relative;
        }
        .wb-how-num::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid rgba(0,223,162,0.1);
        }

        /* Tiers table */
        .wb-terms-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
        }
        .wb-terms-table th {
          text-align: left;
          padding: 14px 20px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #8b97a8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-family: 'Outfit', sans-serif;
        }
        .wb-terms-table td {
          padding: 14px 20px;
          font-size: 0.88rem;
          color: #eef2f7;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.01);
        }
        .wb-terms-table tbody tr:last-child td { border-bottom: none; }
        .wb-terms-table tbody tr:hover td { background: rgba(0,223,162,0.02); }
        .wb-terms-table td:first-child { font-weight: 600; color: #eef2f7; }

        /* CTA */
        .wb-cta-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 64px;
          text-align: center;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(40px);
        }
        .wb-cta-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(0,223,162,0.08), transparent 55%);
          pointer-events: none;
        }
        .wb-btn-xl {
          padding: 16px 40px;
          font-size: 1.05rem;
          border-radius: 12px;
          font-weight: 700;
          background: linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%);
          color: #000;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          box-shadow: 0 8px 32px rgba(0,223,162,0.25), inset 0 1px 0 rgba(255,255,255,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wb-btn-xl:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0,223,162,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
        }

        /* Footer */
        .wb-footer {
          background: #0a0d15;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 40px 0 0;
        }
        .wb-ft-social-a {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a5468;
          transition: border-color 0.15s, color 0.15s;
          cursor: pointer;
        }
        .wb-ft-social-a:hover {
          border-color: rgba(0,223,162,0.3);
          color: #00dfa2;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .wb-hero-layout { grid-template-columns: 1fr !important; text-align: center; }
          .wb-hero-left-wrap .wb-promo-badge,
          .wb-hero-left-wrap .wb-hero-signup { margin-left: auto !important; margin-right: auto !important; }
          .wb-hero-sub { margin-left: auto; margin-right: auto; }
          .wb-countdown { justify-content: center; }
          .wb-signup-note { justify-content: center; }
          .wb-bonus-card { max-width: 460px; margin: 32px auto 0 !important; }
          .wb-rewards-grid { grid-template-columns: 1fr !important; }
          .wb-zero-layout { grid-template-columns: 1fr !important; }
          .wb-how-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .wb-sec { padding: 48px 0; }
          .wb-nav-links { display: none !important; }
          .wb-hamburger { display: flex !important; }
          .wb-nav-right-buttons { display: none !important; }
          .wb-rewards-grid, .wb-how-grid { grid-template-columns: 1fr !important; }
          .wb-how-grid::before { display: none; }
          .wb-cta-box { padding: 40px 20px !important; }
          .wb-hero { padding: 40px 0 32px !important; min-height: auto; }
        }
        @media (max-width: 600px) {
          .wb-cd-box { min-width: 60px; padding: 12px 10px; }
          .wb-cd-val { font-size: 1.4rem; }
          .wb-zero-visual { padding: 24px; }
        }
      `}</style>

      {/* ─── TICKER ─── */}
      <div className="wb-ticker-wrap">
        <TickerBar />
      </div>

      {/* ─── NAV ─── */}
      <nav className="wb-nav">
        <div className="wb-nav-inner">
          <Link to="/main/dashboard" className="wb-logo" aria-label={brandName}>
            <div className="wb-logo-icon">1TM</div>
            <div className="wb-logo-text">
              {brandHead ? (
                <>
                  <em>{brandHead}</em> {brandTail}
                </>
              ) : (
                <em>{brandTail}</em>
              )}
            </div>
          </Link>

          <div className="wb-nav-links">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="wb-nav-link">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="wb-nav-right">
            <div className="wb-nav-right-buttons flex items-center gap-2">
              <Link to="/main/kyc" className="wb-btn-sm wb-btn-accent">
                <span>Sign Up</span>
              </Link>
              <div className="wb-nav-divider" />
              <div
                className="wb-nav-avatar"
                title={
                  user?.first_name
                    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                    : "Account"
                }
              >
                {initials}
              </div>
            </div>
            <button
              type="button"
              className="wb-hamburger"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <XIcon className="h-[1.1rem] w-[1.1rem]" />
              ) : (
                <Menu className="h-[1.1rem] w-[1.1rem]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile drop-down menu */}
        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="wb-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                overflow: "hidden",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(7,8,12,0.96)",
                backdropFilter: "blur(40px)",
              }}
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="wb-nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-2 flex items-center gap-2">
                  <Link
                    to="/main/kyc"
                    className="wb-btn-sm wb-btn-accent"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>Sign Up</span>
                  </Link>
                  <div
                    className="wb-nav-avatar"
                    title={
                      user?.first_name
                        ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                        : "Account"
                    }
                  >
                    {initials}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section className="wb-hero">
        <div className="wb-container">
          <div className="wb-hero-layout">
            {/* Left */}
            <motion.div {...revealProps} className="wb-hero-left-wrap">
              <div className="wb-promo-badge">
                <span className="wb-promo-badge-icon">
                  <Gift className="h-[0.65rem] w-[0.65rem]" />
                </span>
                Limited Time Offer, New Users Only
              </div>
              <h1 className="wb-h1">
                Get up to
                <br />
                <span className="wb-big-num">$5,000</span>
                <br />
                in <span className="wb-highlight">Welcome Bonuses</span>
              </h1>
              <p className="wb-hero-sub">
                Sign up today and enjoy 0% trading fees for your first 30 days,
                plus unlock up to $5,000 in trading bonuses through simple
                deposit and volume milestones.
              </p>

              {/* Countdown */}
              <div className="wb-countdown">
                <div className="wb-cd-box">
                  <div className="wb-cd-val">{cd.days}</div>
                  <div className="wb-cd-lab">Days</div>
                </div>
                <div className="wb-cd-sep">:</div>
                <div className="wb-cd-box">
                  <div className="wb-cd-val">{cd.hours}</div>
                  <div className="wb-cd-lab">Hours</div>
                </div>
                <div className="wb-cd-sep">:</div>
                <div className="wb-cd-box">
                  <div className="wb-cd-val">{cd.mins}</div>
                  <div className="wb-cd-lab">Mins</div>
                </div>
                <div className="wb-cd-sep">:</div>
                <div className="wb-cd-box">
                  <div className="wb-cd-val">{cd.secs}</div>
                  <div className="wb-cd-lab">Secs</div>
                </div>
              </div>

              {/* Signup */}
              <div className="wb-hero-signup">
                <input
                  type="email"
                  placeholder="Enter your email to claim bonus"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Link to="/main/kyc">
                  <span>Claim Now</span>
                </Link>
              </div>
              <div className="wb-signup-note">
                <CircleCheck className="h-[0.75rem] w-[0.75rem]" /> No minimum
                deposit &nbsp;·&nbsp;
                <CircleCheck className="h-[0.75rem] w-[0.75rem]" /> Instant
                activation
              </div>
            </motion.div>

            {/* Right — Bonus Card */}
            <motion.div {...revealProps}>
              <div className="wb-bonus-card">
                <div className="wb-bc-header">
                  <div className="mb-3 flex items-start justify-between">
                    <div
                      className="wb-heading"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: "#00dfa2",
                      }}
                    >
                      Welcome Package
                    </div>
                    <div
                      className="flex items-center gap-1.5"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#00dfa2",
                      }}
                    >
                      <span className="wb-bc-live-dot" />
                      Active
                    </div>
                  </div>
                  <div
                    className="wb-mono relative"
                    style={{
                      fontSize: "3.2rem",
                      fontWeight: 900,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.8rem",
                        color: "#00ffc3",
                        verticalAlign: "top",
                        marginRight: 2,
                      }}
                    >
                      $
                    </span>
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #00dfa2 0%, #00ffc3 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      5,000
                    </span>
                  </div>
                  <div
                    className="relative"
                    style={{ fontSize: "0.85rem", color: "#8b97a8" }}
                  >
                    Maximum welcome bonus for new accounts
                  </div>
                </div>

                <div style={{ padding: "24px 28px" }}>
                  <div className="flex flex-col">
                    {BONUS_STEPS.map((step, i) => {
                      const RIcon = step.reward.icon;
                      return (
                        <div
                          key={step.num}
                          className="flex items-start gap-4"
                          style={{
                            padding: "16px 0",
                            borderBottom:
                              i < BONUS_STEPS.length - 1
                                ? "1px solid rgba(255,255,255,0.08)"
                                : "none",
                          }}
                        >
                          <div
                            className="wb-mono flex flex-shrink-0 items-center justify-center"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.04)",
                              border: "1.5px solid #00dfa2",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#00dfa2",
                              marginTop: 2,
                            }}
                          >
                            {step.num}
                          </div>
                          <div className="flex-1">
                            <div
                              className="wb-heading"
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                marginBottom: 3,
                              }}
                            >
                              {step.title}
                            </div>
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "#8b97a8",
                                lineHeight: 1.5,
                              }}
                            >
                              {step.desc}
                            </div>
                            <span
                              className="wb-mono mt-1.5 inline-flex items-center gap-1"
                              style={{
                                padding: "3px 10px",
                                borderRadius: 4,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                background:
                                  step.reward.tone === "green"
                                    ? "rgba(0,223,162,0.15)"
                                    : "rgba(200,230,78,0.15)",
                                color:
                                  step.reward.tone === "green"
                                    ? "#00dfa2"
                                    : "#c8e64e",
                              }}
                            >
                              <RIcon className="h-[0.7rem] w-[0.7rem]" />
                              {step.reward.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px 28px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="mb-2 flex justify-between"
                    style={{
                      fontSize: "0.72rem",
                      color: "#4a5468",
                      fontWeight: 500,
                    }}
                  >
                    <span>Bonus Unlocked</span>
                    <span>$0 / $5,000</span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "2%" }}
                      transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        background:
                          "linear-gradient(90deg, #00dfa2 0%, #00ffc3 100%)",
                      }}
                    />
                  </div>
                  <div
                    className="mt-2 flex items-center gap-1"
                    style={{ fontSize: "0.7rem", color: "#4a5468" }}
                  >
                    <Info
                      className="h-[0.65rem] w-[0.65rem]"
                      style={{ color: "#00dfa2" }}
                    />
                    Progress updates in real-time after registration
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── REWARDS BREAKDOWN ─── */}
      <section className="wb-sec wb-sec-dark">
        <div className="wb-container">
          <motion.div {...revealProps} className="wb-sec-header">
            <div className="wb-sec-label">Rewards Breakdown</div>
            <div className="wb-sec-title">Three Ways to Earn</div>
            <p className="wb-sec-desc">
              Complete simple tasks to unlock your bonuses. Each reward is
              credited instantly to your trading account.
            </p>
          </motion.div>
          <motion.div {...revealProps} className="wb-rewards-grid">
            {REWARDS.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="wb-reward-card">
                  <div
                    className="mb-4 flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "rgba(0,223,162,0.15)",
                      color: "#00dfa2",
                      fontSize: "1.2rem",
                    }}
                  >
                    <Icon className="h-[1.2rem] w-[1.2rem]" />
                  </div>
                  <div
                    className="wb-mono mb-1"
                    style={{ fontSize: "1.6rem", fontWeight: 800 }}
                  >
                    {r.bonusPre}
                    <span style={{ color: "#00dfa2" }}>{r.bonusAccent}</span>
                    {r.bonusTail}
                  </div>
                  <h3
                    className="wb-heading mb-2"
                    style={{ fontSize: "1rem", fontWeight: 700 }}
                  >
                    {r.title}
                  </h3>
                  <p
                    className="mb-4"
                    style={{ fontSize: "0.83rem", color: "#8b97a8", lineHeight: 1.65 }}
                  >
                    {r.desc}
                  </p>
                  <div
                    className="flex items-center gap-1.5"
                    style={{
                      fontSize: "0.75rem",
                      color: "#4a5468",
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Check
                      className="h-[0.7rem] w-[0.7rem]"
                      style={{ color: "#00dfa2" }}
                    />
                    {r.req}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── 30-DAY ZERO FEE ─── */}
      <section className="wb-sec">
        <div className="wb-container">
          <div className="wb-zero-layout">
            <motion.div {...revealProps}>
              <div className="wb-sec-label">30-Day Zero Fee Trial</div>
              <div className="wb-sec-title">Save Thousands on Every Trade</div>
              <p className="wb-sec-desc">
                While other exchanges charge up to 0.10% per trade, new 1 Trade
                Market users pay nothing for their first 30 days.
              </p>
              <div className="mt-7 flex flex-col gap-5">
                {ZERO_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div
                      className="flex flex-shrink-0 items-center justify-center"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "rgba(0,223,162,0.15)",
                        color: "#00dfa2",
                        fontSize: "0.7rem",
                        marginTop: 2,
                      }}
                    >
                      <Check className="h-[0.7rem] w-[0.7rem]" />
                    </div>
                    <div>
                      <h4
                        className="wb-heading mb-1"
                        style={{ fontSize: "0.92rem", fontWeight: 600 }}
                      >
                        {f.title}
                      </h4>
                      <p style={{ fontSize: "0.83rem", color: "#8b97a8", lineHeight: 1.6 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...revealProps} className="wb-zero-visual">
              <div
                className="mb-1 flex justify-end gap-6"
                style={{
                  paddingBottom: 12,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "#4a5468",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Others
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "#00dfa2",
                    background: "rgba(0,223,162,0.1)",
                    padding: "3px 10px",
                    borderRadius: 4,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  1 Trade Market
                </span>
              </div>
              <div className="relative">
                {FEE_COMPARE.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between"
                      style={{
                        padding: "16px 0",
                        borderBottom:
                          i < FEE_COMPARE.length - 1
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "none",
                      }}
                    >
                      <div
                        className="flex items-center gap-2"
                        style={{ fontSize: "0.88rem", fontWeight: 500, color: "#8b97a8" }}
                      >
                        <Icon className="h-[0.8rem] w-[0.8rem]" style={{ color: "#00dfa2" }} />
                        {row.label}
                      </div>
                      <div className="flex items-center gap-6">
                        <span
                          className="wb-mono"
                          style={{
                            fontSize: "0.88rem",
                            color: "#4a5468",
                            textDecoration: "line-through",
                            opacity: 0.5,
                          }}
                        >
                          {row.other}
                        </span>
                        <span
                          className="wb-mono"
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: "#00dfa2",
                            background: "rgba(0,223,162,0.15)",
                            padding: "4px 12px",
                            borderRadius: 4,
                          }}
                        >
                          {row.ours}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className="text-center"
                style={{
                  marginTop: 24,
                  padding: 20,
                  background: "rgba(0,223,162,0.05)",
                  border: "1px solid rgba(0,223,162,0.1)",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#8b97a8", marginBottom: 4 }}>
                  Estimated 30-day savings on $500K volume
                </div>
                <div
                  className="wb-mono"
                  style={{ fontSize: "1.8rem", fontWeight: 800, color: "#00dfa2" }}
                >
                  $1,000+
                </div>
                <div style={{ fontSize: "0.72rem", color: "#4a5468", marginTop: 2 }}>
                  Compared to industry-average exchange fees
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW TO CLAIM ─── */}
      <section className="wb-sec wb-sec-dark">
        <div className="wb-container">
          <motion.div {...revealProps} className="wb-sec-header">
            <div className="wb-sec-label">How to Claim</div>
            <div className="wb-sec-title">Claim Your Bonus in 4 Steps</div>
          </motion.div>
          <motion.div {...revealProps} className="wb-how-grid">
            {HOW_STEPS.map((s) => (
              <div key={s.num} className="text-center relative z-[1]">
                <div className="wb-how-num">{s.num}</div>
                <h3
                  className="wb-heading mb-1.5"
                  style={{ fontSize: "0.92rem", fontWeight: 700 }}
                >
                  {s.title}
                </h3>
                <p
                  className="mx-auto"
                  style={{
                    fontSize: "0.8rem",
                    color: "#8b97a8",
                    lineHeight: 1.6,
                    maxWidth: 200,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── BONUS TIERS TABLE ─── */}
      <section className="wb-sec">
        <div className="wb-container">
          <motion.div {...revealProps} className="wb-sec-header">
            <div className="wb-sec-label">Bonus Tiers</div>
            <div className="wb-sec-title">Volume-Based Reward Tiers</div>
            <p className="wb-sec-desc">
              The more you trade, the more you earn. All bonuses are credited as
              trading credits to your account.
            </p>
          </motion.div>
          <motion.div {...revealProps} style={{ overflowX: "auto" }}>
            <table className="wb-terms-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Cumulative Volume</th>
                  <th>Bonus Reward</th>
                  <th>Timeframe</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <tr key={i}>
                      <td>
                        <Icon
                          className="inline h-[0.85rem] w-[0.85rem]"
                          style={{ color: "#00dfa2", marginRight: 6, verticalAlign: "-2px" }}
                        />
                        {t.tier}
                      </td>
                      <td className="wb-mono">{t.volume}</td>
                      <td className="wb-mono" style={{ color: "#c8e64e" }}>
                        {t.bonus}
                      </td>
                      <td>{t.timeframe}</td>
                      <td>
                        {t.statusTone === "accent" ? (
                          <span
                            style={{
                              color: "#00dfa2",
                              fontWeight: 600,
                              fontSize: "0.82rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <CircleCheck className="h-[0.78rem] w-[0.78rem]" />
                            {t.status}
                          </span>
                        ) : (
                          <span style={{ color: "#8b97a8", fontSize: "0.82rem" }}>
                            {t.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="wb-sec wb-sec-dark">
        <div className="wb-container">
          <motion.div {...revealProps} className="wb-sec-header">
            <div className="wb-sec-label">FAQ</div>
            <div className="wb-sec-title">Frequently Asked Questions</div>
          </motion.div>
          <motion.div {...revealProps} className="mx-auto" style={{ maxWidth: 780 }}>
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between text-left"
                    style={{
                      padding: "20px 0",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#eef2f7",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    <span>{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{
                        color: "#00dfa2",
                        fontSize: "0.8rem",
                        flexShrink: 0,
                        marginLeft: 16,
                        display: "inline-flex",
                      }}
                    >
                      <Plus className="h-[0.85rem] w-[0.85rem]" />
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
                        <p
                          style={{
                            paddingBottom: 20,
                            fontSize: "0.88rem",
                            color: "#8b97a8",
                            lineHeight: 1.75,
                          }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: "72px 0" }}>
        <div className="wb-container">
          <motion.div {...revealProps} className="wb-cta-box">
            <div className="wb-sec-label relative">Don't Miss Out</div>
            <div className="wb-sec-title relative">
              Claim Your $5,000 Welcome Bonus
            </div>
            <p className="wb-sec-desc mx-auto relative" style={{ marginBottom: 28 }}>
              Limited-time offer for new users. Zero fees + up to $5,000 in
              trading credits. Takes less than 60 seconds to sign up.
            </p>
            <div
              className="flex flex-wrap justify-center relative"
              style={{ gap: 12 }}
            >
              <Link to="/main/kyc" className="wb-btn-xl">
                <span>Create Free Account</span>
                <ArrowRight className="h-[0.85rem] w-[0.85rem]" />
              </Link>
            </div>
            <div
              className="flex flex-wrap justify-center relative"
              style={{ gap: 32, marginTop: 24 }}
            >
              {CTA_TRUST.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-1.5"
                    style={{ fontSize: "0.78rem", color: "#4a5468" }}
                  >
                    <Icon
                      className="h-[0.78rem] w-[0.78rem]"
                      style={{ color: "#00dfa2" }}
                    />
                    {t.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="wb-footer">
        <div className="wb-container">
          <div
            className="flex flex-wrap items-center justify-between gap-4"
            style={{
              paddingBottom: 24,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/main/dashboard" className="wb-logo" aria-label={brandName}>
                <div className="wb-logo-icon">1TM</div>
                <div className="wb-logo-text">
                  {brandHead ? (
                    <>
                      <em>{brandHead}</em> {brandTail}
                    </>
                  ) : (
                    <em>{brandTail}</em>
                  )}
                </div>
              </Link>
              <div className="flex flex-wrap" style={{ gap: 20 }}>
                {FOOTER_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    style={{
                      fontSize: "0.8rem",
                      color: "#4a5468",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00ffc3")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5468")}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex" style={{ gap: 8 }}>
              {FOOTER_SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <span
                    key={s.label}
                    className="wb-ft-social-a"
                    aria-label={s.label}
                    role="img"
                  >
                    <Icon className="h-[0.8rem] w-[0.8rem]" />
                  </span>
                );
              })}
            </div>
          </div>
          <div
            className="flex flex-wrap items-center justify-between"
            style={{ padding: "16px 0", gap: 12 }}
          >
            <div style={{ fontSize: "0.75rem", color: "#4a5468" }}>
              © 2024–2026 1 Trade Market Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap" style={{ gap: 20 }}>
              <span style={{ fontSize: "0.8rem", color: "#4a5468" }}>
                Privacy Policy
              </span>
              <span style={{ fontSize: "0.8rem", color: "#4a5468" }}>
                Terms of Service
              </span>
              <span style={{ fontSize: "0.8rem", color: "#4a5468" }}>
                AML Policy
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── DISCLAIMER BAND ─── */}
      <div
        style={{
          padding: "16px 0",
          background: "#07080c",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="wb-container">
          <p
            className="mx-auto text-center"
            style={{
              fontSize: "0.68rem",
              color: "#4a5468",
              opacity: 0.7,
              lineHeight: 1.7,
              maxWidth: 900,
            }}
          >
            <strong>Risk Disclaimer:</strong> Digital asset trading involves
            significant risk and can result in loss of invested capital. Bonus
            credits are non-withdrawable but profits earned from trading with
            bonus credits can be withdrawn. Offer valid for new accounts only
            during the promotional period. 1 Trade Market does not provide
            financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

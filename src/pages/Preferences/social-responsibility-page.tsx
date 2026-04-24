import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TickerBar } from "@/components/dashboard/TickerBar";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";
import {
  Sprout,
  Crosshair,
  GraduationCap,
  Leaf,
  HandHeart,
  Globe,
  Heart,
  TreePine,
  Banknote,
  UsersRound,
  Zap,
  Sun,
  Droplets,
  Recycle,
  Newspaper,
  ArrowRight,
  Calendar,
  Clock,
  BadgeCheck,
  Handshake,
  School,
  Rocket,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────
// STATIC CONTENT (presentational only — from html_files/social-responsibility.html)
// ───────────────────────────────────────────────────────────────

// Nav content per the reference (Home, Plans, Fund Managers, CSR, Compliance).
// Only real existing routes are used.
const NAV_LINKS = [
  { label: "Home", to: "/main/dashboard" },
  { label: "Plans", to: "/main/trading-plans" },
  { label: "Fund Managers", to: "/main/fund-managers" },
  { label: "CSR", to: "/main/social-responsibility" },
  { label: "Compliance", to: "/main/kyc" },
];

const HERO_STATS = [
  { num: "$4.2M", label: "Donated since 2020" },
  { num: "38,000+", label: "Students Educated" },
  { num: "92", label: "Countries Reached" },
  { num: "Carbon 0", label: "Net Zero by 2028" },
];

type PillarTone = "green" | "gold" | "blue";

const PILLARS: {
  title: string;
  desc: string;
  icon: React.ElementType;
  tone: PillarTone;
}[] = [
  {
    title: "Education",
    desc: "Free financial literacy programs for underserved communities worldwide.",
    icon: GraduationCap,
    tone: "green",
  },
  {
    title: "Environment",
    desc: "Carbon-neutral operations and renewable energy partnerships.",
    icon: Leaf,
    tone: "green",
  },
  {
    title: "Community",
    desc: "Investment in local economies and small business development funds.",
    icon: HandHeart,
    tone: "gold",
  },
  {
    title: "Inclusion",
    desc: "Banking the unbanked through crypto-enabled financial access.",
    icon: Globe,
    tone: "blue",
  },
];

const PILLAR_TONES: Record<PillarTone, { bg: string; color: string }> = {
  green: { bg: "rgba(0,223,162,.1)", color: "#00dfa2" },
  gold: { bg: "rgba(240,180,41,.1)", color: "#F0B429" },
  blue: { bg: "rgba(41,121,255,.08)", color: "#2979FF" },
};

const IMPACT = [
  {
    num: "$4.2M",
    color: "#00dfa2",
    label: "Total Charitable Donations",
    sub: "Since founding in 2019",
    accentBar: "linear-gradient(90deg,#00dfa2,transparent)",
  },
  {
    num: "38K",
    color: "#F0B429",
    label: "Thousand Students Educated",
    sub: "In 47 countries",
    accentBar: "linear-gradient(90deg,#F0B429,transparent)",
  },
  {
    num: "12,500",
    color: "#00dfa2",
    label: "Trees Planted",
    sub: "Through our reforestation program",
    accentBar: "linear-gradient(90deg,#00dfa2,transparent)",
  },
  {
    num: "92",
    color: "#2979FF",
    label: "Countries With Active Programs",
    sub: "Growing every quarter",
    accentBar: "linear-gradient(90deg,#2979FF,transparent)",
  },
];

type InitTone = "green" | "gold" | "blue";

const INITIATIVES: {
  img: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  icon: React.ElementType;
  iconTone: InitTone;
  title: string;
  desc: string;
  stats: { num: string; color: string; label: string }[];
}[] = [
  {
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80&auto=format&fit=crop",
    tag: "Education",
    tagBg: "linear-gradient(135deg, rgba(0,223,162,.9), rgba(0,255,195,.9))",
    tagColor: "#000",
    icon: GraduationCap,
    iconTone: "green",
    title: "CryptoLearn Scholarship Program",
    desc: "Providing free access to blockchain education, financial literacy courses, and mentorship programs to youth in 47 emerging market nations. Our curriculum partners include three globally accredited universities.",
    stats: [
      { num: "38,000+", color: "#00dfa2", label: "Students Enrolled" },
      { num: "47", color: "#F0B429", label: "Countries" },
      { num: "94%", color: "#00dfa2", label: "Completion Rate" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80&auto=format&fit=crop",
    tag: "Environment",
    tagBg: "linear-gradient(135deg, rgba(0,223,162,.9), rgba(0,255,195,.9))",
    tagColor: "#000",
    icon: TreePine,
    iconTone: "green",
    title: "Green Blockchain Initiative",
    desc: "For every $1,000 traded on our platform, we plant a tree in partnership with the Eden Reforestation Projects. Our servers run on 100% renewable energy from Swiss hydroelectric power suppliers.",
    stats: [
      { num: "12,500", color: "#00dfa2", label: "Trees Planted" },
      { num: "100%", color: "#2979FF", label: "Renewable Energy" },
      { num: "-60%", color: "#F0B429", label: "Carbon vs 2021" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&q=80&auto=format&fit=crop",
    tag: "Inclusion",
    tagBg: "rgba(240,180,41,.9)",
    tagColor: "#000",
    icon: Banknote,
    iconTone: "gold",
    title: "Unbanked Access Fund",
    desc: "Partnering with NGOs and mobile money providers across Africa, Southeast Asia, and Latin America to give the 1.4 billion unbanked population access to savings, lending, and crypto investment tools.",
    stats: [
      { num: "1.4B", color: "#F0B429", label: "Target Population" },
      { num: "180K+", color: "#00dfa2", label: "Accounts Opened" },
      { num: "$2.8M", color: "#00dfa2", label: "Micro-loans Issued" },
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1573164574511-73c773193279?w=700&q=80&auto=format&fit=crop",
    tag: "Community",
    tagBg: "rgba(41,121,255,.9)",
    tagColor: "#fff",
    icon: UsersRound,
    iconTone: "blue",
    title: "Women in Web3 Leadership",
    desc: "Dedicated accelerator program for female-led blockchain startups. We provide $50,000 grants, mentorship, and platform access to help close the gender gap in crypto and fintech leadership worldwide.",
    stats: [
      { num: "240", color: "#2979FF", label: "Startups Funded" },
      { num: "$12M", color: "#F0B429", label: "Grants Awarded" },
      { num: "78%", color: "#00dfa2", label: "Still Operating" },
    ],
  },
];

const INIT_ICON_TONES: Record<InitTone, { bg: string; color: string }> = {
  green: { bg: "rgba(0,223,162,.1)", color: "#00dfa2" },
  gold: { bg: "rgba(240,180,41,.1)", color: "#F0B429" },
  blue: { bg: "rgba(41,121,255,.08)", color: "#2979FF" },
};

const ENV_POINTS: {
  icon: React.ElementType;
  tone: InitTone;
  title: string;
  desc: string;
}[] = [
  {
    icon: Sun,
    tone: "green",
    title: "Renewable Energy Transition",
    desc: "All of our server infrastructure has migrated to Swiss hydroelectric power, with solar agreements covering our Zurich headquarters and Geneva offices.",
  },
  {
    icon: Droplets,
    tone: "blue",
    title: "Carbon Offset Purchasing",
    desc: "We purchase verified carbon offsets through Gold Standard certified projects in Brazil and Indonesia to neutralize emissions we cannot yet eliminate.",
  },
  {
    icon: Recycle,
    tone: "gold",
    title: "Hardware Recycling Program",
    desc: "Old servers and hardware are responsibly recycled or donated to schools in developing nations rather than being sent to landfill.",
  },
];

const PROGRESS = [
  { label: "Renewable Energy Usage", value: 100 },
  { label: "Carbon Emission Reduction", value: 61 },
  { label: "Hardware Recycled", value: 89 },
  { label: "Net Zero Target Progress", value: 73 },
];

const BLOGS = [
  {
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80&auto=format&fit=crop",
    cat: "Education",
    catBg: "linear-gradient(135deg, rgba(0,223,162,.9), rgba(0,255,195,.9))",
    catColor: "#000",
    date: "Feb 28, 2026",
    read: "6 min read",
    title: "CryptoLearn Hits 38,000 Students Across Africa and Asia",
    excerpt:
      "Our online blockchain curriculum, translated into 12 languages, is now the leading free financial education resource for youth in emerging markets.",
  },
  {
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80&auto=format&fit=crop",
    cat: "Environment",
    catBg: "linear-gradient(135deg, rgba(0,223,162,.9), rgba(0,255,195,.9))",
    catColor: "#000",
    date: "Feb 14, 2026",
    read: "4 min read",
    title: "We Just Planted Our 12,500th Tree in the Borneo Rainforest",
    excerpt:
      "Our trading-volume-linked reforestation initiative has now covered over 14 hectares of critical rainforest habitat in partnership with the Eden Projects.",
  },
  {
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80&auto=format&fit=crop",
    cat: "Community",
    catBg: "rgba(41,121,255,.9)",
    catColor: "#fff",
    date: "Jan 30, 2026",
    read: "7 min read",
    title: "240 Women-Led Web3 Startups Funded Through Our Accelerator",
    excerpt:
      "The Women in Web3 Leadership accelerator celebrates its third year with $12M in total grants and a 78% business survival rate — far above the industry average.",
  },
  {
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80&auto=format&fit=crop",
    cat: "Report",
    catBg: "rgba(240,180,41,.9)",
    catColor: "#000",
    date: "Jan 15, 2026",
    read: "12 min read",
    title: "2025 Annual Impact Report: A Year in Numbers",
    excerpt:
      "Our full transparency report covering charitable giving, environmental progress, community outcomes, and governance improvements over the past 12 months.",
  },
  {
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80&auto=format&fit=crop",
    cat: "Events",
    catBg: "linear-gradient(135deg, rgba(0,223,162,.9), rgba(0,255,195,.9))",
    catColor: "#000",
    date: "Dec 10, 2025",
    read: "3 min read",
    title: "1 Trade Market at the UN Climate Finance Summit in Davos",
    excerpt:
      "Our CEO Klaus Müller presented the case for blockchain-enabled climate finance instruments at the annual World Economic Forum side event in Davos, Switzerland.",
  },
  {
    img: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?w=500&q=80&auto=format&fit=crop",
    cat: "Community",
    catBg: "linear-gradient(135deg, rgba(0,223,162,.9), rgba(0,255,195,.9))",
    catColor: "#000",
    date: "Nov 22, 2025",
    read: "5 min read",
    title:
      "Building Fintech Literacy in Rural Nigeria Through Mobile-First Education",
    excerpt:
      "Our community partner Kobo360 helped us bring the CryptoLearn curriculum to 4,200 young Nigerians in Kano, Kaduna, and Jos through an innovative SMS-based learning system.",
  },
];

const PARTNERS = [
  { icon: Globe, label: "UN Global Compact" },
  { icon: Leaf, label: "Eden Projects" },
  { icon: BadgeCheck, label: "B Corp Certified" },
  { icon: Handshake, label: "GivingWhat.org" },
  { icon: Sun, label: "RE100 Signatory" },
  { icon: School, label: "Khan Academy Partner" },
];

const FOOTER_COMPANY = [
  { label: "About Us", to: "/main/dashboard" },
  { label: "CSR", to: "/main/social-responsibility" },
  { label: "Compliance", to: "/main/kyc" },
  { label: "Security", to: "/main/security" },
];

const FOOTER_PRODUCTS = [
  { label: "Trading Plans", to: "/main/trading-plans" },
  { label: "Fund Managers", to: "/main/fund-managers" },
  { label: "Welcome Bonus", to: "/main/savings" },
];

// CSR programs in the reference are "#" placeholders — rendered as plain text,
// no invented routes.
const FOOTER_CSR_PROGRAMS = [
  "CryptoLearn",
  "Green Blockchain",
  "Unbanked Access Fund",
  "Women in Web3",
];

const revealProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

// ───────────────────────────────────────────────────────────────
// PAGE
// ───────────────────────────────────────────────────────────────

export default function SocialResponsibilityPage() {
  const user = useUserStore((state) => state.user);
  const settings = useSiteSettingsStore((state) => state.settings);
  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "JD";
  const brandName = settings?.name || "1 Trade Market";

  // Hide MainLayout chrome while this page is mounted — same pattern as
  // fund-protection-page.tsx / trade-access-page.tsx. Scoped to this page only.
  useEffect(() => {
    document.body.classList.add("sr-active");
    return () => {
      document.body.classList.remove("sr-active");
    };
  }, []);

  // Page-scoped font loading (Outfit + Inter + JetBrains Mono).
  useEffect(() => {
    if (document.querySelector<HTMLLinkElement>('link[data-sr-fonts="1"]'))
      return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    link.dataset.srFonts = "1";
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
      className="sr-root w-full"
      style={{
        background: "linear-gradient(135deg, #07080c 0%, #0a0d15 100%)",
        color: "#eef2f7",
        fontFamily: "Inter, -apple-system, 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        /* ─── Hide MainLayout chrome while this page is mounted ───
           Same body-class pattern reused from fund-protection-page.tsx.
           Scope: /main/social-responsibility only. */
        body.sr-active .fixed.top-0.left-0.right-0.z-20,
        body.sr-active .fixed.top-\\[60px\\].left-0.bottom-0 {
          display: none !important;
        }
        body.sr-active .flex.flex-1.pt-\\[90px\\] {
          padding-top: 0 !important;
        }
        body.sr-active .flex-1.md\\:ml-\\[80px\\] {
          margin-left: 0 !important;
        }

        .sr-root { line-height: 1.6; }
        .sr-outfit { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; }
        .sr-mono { font-family: 'JetBrains Mono', monospace; }

        /* ─── TICKER WRAP (reuse of fund-protection visual) ─── */
        .sr-ticker-wrap { position: relative; z-index: 299; }
        .sr-ticker-wrap > div {
          height: 34px !important;
          background: rgba(7,8,12,0.65) !important;
          border-bottom: 1px solid rgba(255,255,255,0.04) !important;
        }

        /* ─── NAV (reuse of fund-protection pattern; CSR links inside) ─── */
        .sr-nav {
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
        .sr-nav-logo {
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
        .sr-nav-logo em {
          color: #00dfa2;
          font-style: normal;
        }
        .sr-logo-box {
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
        .sr-nav-links {
          display: flex;
          gap: 2px;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sr-nav-links::-webkit-scrollbar { display: none; }
        .sr-nav-link {
          white-space: nowrap;
          text-decoration: none;
          color: #8b97a8;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .sr-nav-link:hover {
          color: #eef2f7;
          background: rgba(255,255,255,0.12);
        }
        .sr-nav-link-active {
          color: #00dfa2;
          background: rgba(0,223,162,0.1);
          font-weight: 600;
        }
        .sr-nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .sr-nav-avatar {
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

        /* ─── SECTION CORE ─── */
        .sr-section { padding: 80px 40px; }
        .sr-section-inner { max-width: 1200px; margin: 0 auto; }
        .sr-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          background: rgba(0,223,162,.1);
          border: 1px solid rgba(0,223,162,.2);
          border-radius: 20px;
          font-size: .72rem;
          font-weight: 700;
          color: #00dfa2;
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 14px;
        }
        .sr-section-tag.gold {
          background: rgba(240,180,41,.1);
          border-color: rgba(240,180,41,.3);
          color: #F0B429;
        }
        .sr-section-tag.blue {
          background: rgba(41,121,255,.08);
          border-color: rgba(41,121,255,.2);
          color: #2979FF;
        }
        .sr-section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -.035em;
          line-height: 1.15;
          margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
        }
        .sr-section-sub {
          font-size: 1rem;
          color: #8b97a8;
          line-height: 1.75;
          max-width: 560px;
        }

        /* ─── CARD HOVERS (CSS-only) ─── */
        .sr-card-hover {
          transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .sr-card-hover:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.12);
        }
        .sr-init-card {
          transition: border-color .3s ease, box-shadow .3s ease;
        }
        .sr-init-card:hover {
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 20px 50px rgba(0,223,162,.15);
        }
        .sr-init-card:hover .sr-init-img img {
          transform: scale(1.04);
        }
        .sr-init-img img {
          transition: transform .4s ease;
        }
        .sr-blog-card {
          transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
          cursor: pointer;
        }
        .sr-blog-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 18px 44px rgba(0,223,162,.15);
        }
        .sr-blog-card:hover img {
          transform: scale(1.05);
        }
        .sr-blog-card img { transition: transform .35s ease; }
        .sr-fp-card {
          transition: border-color .3s ease, box-shadow .3s ease;
        }
        .sr-fp-card:hover {
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 20px 50px rgba(0,223,162,.15);
        }
        .sr-fp-card:hover img { transform: scale(1.04); }
        .sr-fp-card img { transition: transform .4s ease; }
        .sr-partner {
          opacity: .45;
          transition: opacity .2s ease;
        }
        .sr-partner:hover { opacity: .85; }

        /* ─── BUTTONS ─── */
        .sr-btn-cta-main {
          padding: 14px 32px;
          background: linear-gradient(135deg, #00dfa2, #00ffc3);
          border: none;
          border-radius: 10px;
          font-size: .95rem;
          font-weight: 800;
          color: #07080c;
          cursor: pointer;
          transition: transform .25s ease, box-shadow .25s ease;
          box-shadow: 0 6px 24px rgba(0,223,162,.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .sr-btn-cta-main:hover {
          box-shadow: 0 10px 32px rgba(0,223,162,.45);
          transform: translateY(-1px);
        }
        .sr-btn-cta-sec {
          padding: 14px 32px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-size: .95rem;
          font-weight: 700;
          color: #8b97a8;
          cursor: pointer;
          transition: border-color .2s ease, color .2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .sr-btn-cta-sec:hover {
          border-color: #00dfa2;
          color: #00dfa2;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .sr-mission-inner { grid-template-columns: 1fr !important; gap: 36px !important; }
          .sr-impact-grid { grid-template-columns: repeat(2,1fr) !important; }
          .sr-env-grid { grid-template-columns: 1fr !important; }
          .sr-blog-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .sr-nav { padding: 0 12px; gap: 12px; }
          .sr-nav-logo { font-size: 0.88rem; }
          .sr-logo-box { width: 34px; height: 34px; font-size: 0.7rem; }
          .sr-section { padding: 64px 20px !important; }
          .sr-hero { padding: 70px 20px 60px !important; }
          .sr-init-grid { grid-template-columns: 1fr !important; }
          .sr-mission-pillars { grid-template-columns: 1fr 1fr !important; }
          .sr-partners-band { padding: 48px 20px !important; }
          .sr-cta-band { padding: 64px 20px !important; }
          .sr-footer { padding: 40px 20px 28px !important; }
        }
        @media (max-width: 800px) {
          .sr-featured-post { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .sr-blog-grid { grid-template-columns: 1fr !important; }
          .sr-hero-stats { gap: 28px !important; }
        }
      `}</style>

      {/* ─── TICKER ─── */}
      <div className="sr-ticker-wrap">
        <TickerBar />
      </div>

      {/* ─── NAV ─── */}
      <nav className="sr-nav">
        <Link
          to="/main/dashboard"
          className="sr-nav-logo"
          aria-label={brandName}
        >
          <div className="sr-logo-box">1TM</div>
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
        <div className="sr-nav-links">
          {NAV_LINKS.map((l) => {
            const active = l.to === "/main/social-responsibility";
            return (
              <Link
                key={l.to + l.label}
                to={l.to}
                className={`sr-nav-link${active ? " sr-nav-link-active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="sr-nav-right">
          <div
            className="sr-nav-avatar"
            title={
              user?.first_name
                ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                : "Account"
            }
          >
            {initials}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <motion.section
        {...revealProps}
        className="sr-hero relative text-center"
        style={{ padding: "100px 40px 80px", overflow: "hidden" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(0,223,162,0.08) 0%, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(0,223,162,0.3), transparent)",
          }}
        />
        <div className="relative mx-auto" style={{ maxWidth: 780 }}>
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-[20px] px-4 py-1.5"
            style={{
              background: "rgba(0,223,162,0.1)",
              border: "1px solid rgba(0,223,162,0.2)",
              color: "#00dfa2",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <Sprout className="h-[0.85rem] w-[0.85rem]" />
            Corporate Social Responsibility
          </div>
          <h1
            className="sr-outfit mb-5"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Finance that{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00ffc3, #00dfa2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Gives Back
            </span>
            <br />
            to the World
          </h1>
          <p
            className="mx-auto mb-10"
            style={{
              fontSize: "1.1rem",
              color: "#8b97a8",
              lineHeight: 1.8,
              maxWidth: 620,
            }}
          >
            At 1 Trade Market, we believe that financial innovation and social
            impact go hand in hand. Our commitment extends beyond trading —
            into communities, education, and our planet.
          </p>
          <div
            className="sr-hero-stats flex flex-wrap justify-center"
            style={{ gap: 48 }}
          >
            {HERO_STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="sr-mono"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#00ffc3",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontSize: "0.78rem",
                    color: "#4a5468",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── MISSION BAND ─── */}
      <motion.div
        {...revealProps}
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(40px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "60px 40px",
        }}
      >
        <div
          className="sr-mission-inner mx-auto grid items-center"
          style={{
            maxWidth: 1200,
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
          }}
        >
          <div>
            <div className="sr-section-tag">
              <Crosshair className="h-[0.72rem] w-[0.72rem]" /> Our Mission
            </div>
            <p
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: "-0.02em",
                color: "#eef2f7",
              }}
            >
              We are building a future where{" "}
              <span style={{ color: "#00dfa2" }}>
                financial freedom is accessible to every person
              </span>{" "}
              on earth, regardless of geography, background, or wealth.
            </p>
            <div className="mt-5 flex items-center gap-3.5">
              <div
                className="flex flex-shrink-0 items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00dfa2, #00b881)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                }}
              >
                KM
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#eef2f7",
                  }}
                >
                  Klaus Müller
                </div>
                <div style={{ fontSize: "0.8rem", color: "#4a5468" }}>
                  CEO &amp; Co-Founder, 1 Trade Market
                </div>
              </div>
            </div>
          </div>
          <div
            className="sr-mission-pillars grid"
            style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              const t = PILLAR_TONES[p.tone];
              return (
                <div
                  key={i}
                  className="sr-card-hover"
                  style={{
                    padding: 20,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    backdropFilter: "blur(40px)",
                  }}
                >
                  <div
                    className="mb-2.5 flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: t.bg,
                      color: t.color,
                      fontSize: "0.95rem",
                    }}
                  >
                    <Icon className="h-[0.95rem] w-[0.95rem]" />
                  </div>
                  <div
                    className="sr-outfit"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#4a5468",
                      lineHeight: 1.6,
                    }}
                  >
                    {p.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── IMPACT COUNTERS ─── */}
      <motion.div
        {...revealProps}
        style={{
          background: "rgba(255,255,255,0.04)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(40px)",
        }}
      >
        <div
          className="sr-impact-grid grid"
          style={{ gridTemplateColumns: "repeat(4,1fr)" }}
        >
          {IMPACT.map((it, i) => (
            <div
              key={i}
              className="relative overflow-hidden text-center"
              style={{
                padding: "48px 32px",
                borderRight:
                  i < IMPACT.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: it.accentBar,
                }}
              />
              <div
                className="sr-mono"
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: 8,
                  color: it.color,
                }}
              >
                {it.num}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#8b97a8",
                  fontWeight: 500,
                }}
              >
                {it.label}
              </div>
              <div
                className="mt-1"
                style={{ fontSize: "0.73rem", color: "#4a5468" }}
              >
                {it.sub}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── KEY INITIATIVES ─── */}
      <motion.section {...revealProps} className="sr-section">
        <div className="sr-section-inner">
          <div className="sr-section-tag">
            <HandHeart className="h-[0.72rem] w-[0.72rem]" /> Key Initiatives
          </div>
          <h2 className="sr-section-title">
            Programs Making
            <br />
            Real Difference
          </h2>
          <p className="sr-section-sub">
            From classrooms in Sub-Saharan Africa to reforestation in Southeast
            Asia, our initiatives create lasting change.
          </p>

          <div
            className="sr-init-grid mt-12 grid"
            style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 28 }}
          >
            {INITIATIVES.map((init, i) => {
              const Icon = init.icon;
              const iconTone = INIT_ICON_TONES[init.iconTone];
              return (
                <div
                  key={i}
                  className="sr-init-card overflow-hidden"
                  style={{
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(40px)",
                  }}
                >
                  <div
                    className="sr-init-img relative overflow-hidden"
                    style={{ height: 220 }}
                  >
                    <img
                      src={init.img}
                      alt={init.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 40%, rgba(7,8,12,.88))",
                      }}
                    />
                    <span
                      className="absolute rounded-[20px]"
                      style={{
                        top: 16,
                        left: 16,
                        padding: "4px 12px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        background: init.tagBg,
                        color: init.tagColor,
                      }}
                    >
                      {init.tag}
                    </span>
                  </div>
                  <div style={{ padding: 28 }}>
                    <div
                      className="mb-3.5 flex items-center justify-center"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: iconTone.bg,
                        color: iconTone.color,
                        fontSize: "1rem",
                      }}
                    >
                      <Icon className="h-[1rem] w-[1rem]" />
                    </div>
                    <div
                      className="sr-outfit mb-2"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {init.title}
                    </div>
                    <div
                      className="mb-4"
                      style={{
                        fontSize: "0.88rem",
                        color: "#8b97a8",
                        lineHeight: 1.75,
                      }}
                    >
                      {init.desc}
                    </div>
                    <div
                      className="flex gap-5 pt-4"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {init.stats.map((s, si) => (
                        <div key={si} className="text-left">
                          <div
                            className="sr-mono"
                            style={{
                              fontSize: "1.3rem",
                              fontWeight: 700,
                              lineHeight: 1,
                              color: s.color,
                            }}
                          >
                            {s.num}
                          </div>
                          <div
                            className="mt-0.5"
                            style={{
                              fontSize: "0.73rem",
                              color: "#4a5468",
                            }}
                          >
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ─── SUSTAINABILITY / NET ZERO ─── */}
      <motion.section
        {...revealProps}
        className="sr-section"
        style={{
          background:
            "linear-gradient(180deg, #07080c 0%, rgba(0,223,162,.02) 100%)",
        }}
      >
        <div className="sr-section-inner">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="sr-section-tag">
                <Leaf className="h-[0.72rem] w-[0.72rem]" /> Sustainability
              </div>
              <h2 className="sr-section-title">
                Our Path to
                <br />
                Net Zero by 2028
              </h2>
              <p className="sr-section-sub">
                We are committed to eliminating our carbon footprint across all
                operations, data centers, and supply chains.
              </p>
            </div>
          </div>

          <div
            className="sr-env-grid mt-12 grid items-start"
            style={{ gridTemplateColumns: "1.2fr 1fr", gap: 56 }}
          >
            <div>
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: 20 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80&auto=format&fit=crop"
                  alt="Renewable Energy"
                  className="w-full object-cover"
                  style={{ height: 380 }}
                  loading="lazy"
                />
                <div
                  className="absolute flex items-center gap-3"
                  style={{
                    bottom: 20,
                    left: 20,
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "14px 18px",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(0,223,162,0.1)",
                      color: "#00dfa2",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Zap className="h-[0.9rem] w-[0.9rem]" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#eef2f7",
                      }}
                    >
                      100% Renewable Energy
                    </div>
                    <div
                      style={{ fontSize: "0.72rem", color: "#4a5468" }}
                    >
                      Swiss Hydroelectric Powered
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-4">
                {ENV_POINTS.map((p, i) => {
                  const Icon = p.icon;
                  const t = INIT_ICON_TONES[p.tone];
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div
                        className="flex flex-shrink-0 items-center justify-center"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: t.bg,
                          color: t.color,
                          fontSize: "0.85rem",
                          marginTop: 2,
                        }}
                      >
                        <Icon className="h-[0.85rem] w-[0.85rem]" />
                      </div>
                      <div>
                        <div
                          className="sr-outfit"
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            marginBottom: 3,
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.83rem",
                            color: "#4a5468",
                            lineHeight: 1.65,
                          }}
                        >
                          {p.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7">
                {PROGRESS.map((pr, i) => (
                  <div key={i} className="mb-3.5">
                    <div
                      className="mb-1.5 flex items-center justify-between"
                      style={{ fontSize: "0.82rem" }}
                    >
                      <span style={{ color: "#8b97a8", fontWeight: 500 }}>
                        {pr.label}
                      </span>
                      <span
                        className="sr-mono"
                        style={{ color: "#00dfa2", fontWeight: 600 }}
                      >
                        {pr.value}%
                      </span>
                    </div>
                    <div
                      className="overflow-hidden"
                      style={{
                        height: 6,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 3,
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pr.value}%` }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          duration: 0.9,
                          ease: "easeOut",
                          delay: i * 0.05,
                        }}
                        style={{
                          height: "100%",
                          borderRadius: 3,
                          background: "linear-gradient(90deg, #00dfa2, #00ffc3)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── CSR NEWSROOM ─── */}
      <motion.section {...revealProps} className="sr-section">
        <div className="sr-section-inner">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="sr-section-tag gold">
                <Newspaper className="h-[0.72rem] w-[0.72rem]" /> CSR Newsroom
              </div>
              <h2 className="sr-section-title">
                Stories of
                <br />
                Our Impact
              </h2>
            </div>
            <span
              className="inline-flex items-center gap-1.5 whitespace-nowrap"
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#00dfa2",
              }}
            >
              View all articles
              <ArrowRight className="h-[0.75rem] w-[0.75rem]" />
            </span>
          </div>

          {/* Featured Post */}
          <div
            className="sr-featured-post sr-fp-card mt-9 grid overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              gridTemplateColumns: "1fr 1fr",
              backdropFilter: "blur(40px)",
              marginBottom: 32,
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ minHeight: 320 }}
            >
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=80"
                alt="Featured Article"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span
                className="absolute rounded-[20px]"
                style={{
                  top: 20,
                  left: 20,
                  padding: "6px 14px",
                  background: "linear-gradient(135deg, #00dfa2, #00ffc3)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#07080c",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Featured
              </span>
            </div>
            <div style={{ padding: 36 }}>
              <div
                className="mb-3 flex items-center gap-1.5"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#00dfa2",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                <Globe className="h-[0.72rem] w-[0.72rem]" />
                Financial Inclusion
              </div>
              <div
                className="sr-outfit mb-3"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  lineHeight: 1.3,
                  letterSpacing: "-0.03em",
                }}
              >
                How Crypto is Banking 180,000 People Who Never Had a Financial
                Account
              </div>
              <p
                className="mb-6"
                style={{
                  fontSize: "0.9rem",
                  color: "#8b97a8",
                  lineHeight: 1.75,
                }}
              >
                In rural Kenya, Mama Wanjiku had never held a bank card. Today,
                through our Unbanked Access Fund partnership with M-Pesa and a
                local NGO in Nairobi, she manages her small textile business
                finances entirely through her mobile phone — earning, saving,
                and micro-investing in stablecoins.
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="overflow-hidden"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80"
                    alt="Sarah Chen"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    Sarah Chen
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#4a5468" }}>
                    Head of Impact — March 15, 2026
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div
            className="sr-blog-grid grid"
            style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}
          >
            {BLOGS.map((b, i) => (
              <div
                key={i}
                className="sr-blog-card overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  backdropFilter: "blur(40px)",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: 200 }}
                >
                  <img
                    src={b.img}
                    alt={b.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span
                    className="absolute rounded-[20px]"
                    style={{
                      top: 12,
                      left: 12,
                      padding: "4px 10px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      background: b.catBg,
                      color: b.catColor,
                    }}
                  >
                    {b.cat}
                  </span>
                </div>
                <div style={{ padding: 22 }}>
                  <div
                    className="mb-2.5 flex items-center gap-2"
                    style={{ fontSize: "0.75rem", color: "#4a5468" }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="h-[0.7rem] w-[0.7rem]" />
                      {b.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-[0.7rem] w-[0.7rem]" />
                      {b.read}
                    </span>
                  </div>
                  <div
                    className="sr-outfit mb-2"
                    style={{
                      fontSize: "0.98rem",
                      fontWeight: 700,
                      lineHeight: 1.4,
                      letterSpacing: "-0.02em",
                      color: "#eef2f7",
                    }}
                  >
                    {b.title}
                  </div>
                  <div
                    className="mb-3.5"
                    style={{
                      fontSize: "0.8rem",
                      color: "#4a5468",
                      lineHeight: 1.7,
                    }}
                  >
                    {b.excerpt}
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#00dfa2",
                    }}
                  >
                    Read More
                    <ArrowRight className="h-[0.68rem] w-[0.68rem]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── PARTNERS / CERTIFICATIONS ─── */}
      <motion.div
        {...revealProps}
        className="sr-partners-band"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "60px 40px",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <p
            className="text-center"
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#4a5468",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 36,
            }}
          >
            CSR Partners &amp; Certifications
          </p>
          <div
            className="flex flex-wrap items-center justify-center"
            style={{ gap: 48 }}
          >
            {PARTNERS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="sr-partner flex items-center gap-2.5"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#8b97a8",
                  }}
                >
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── CTA BAND ─── */}
      <motion.section
        {...revealProps}
        className="sr-cta-band text-center"
        style={{
          padding: "80px 40px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(40px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 640 }}>
          <div className="sr-section-tag mb-4">
            <Heart className="h-[0.72rem] w-[0.72rem]" /> Join the Movement
          </div>
          <h2
            className="sr-outfit mb-3"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
            }}
          >
            Trade with Purpose.
            <br />
            Invest with Conscience.
          </h2>
          <p
            className="mb-8"
            style={{ color: "#8b97a8", lineHeight: 1.75 }}
          >
            Every trade on 1 Trade Market contributes to education,
            environmental restoration, and financial inclusion. Open your
            account today and become part of the change.
          </p>
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: 12 }}
          >
            <Link to="/main/kyc" className="sr-btn-cta-main">
              <Rocket className="h-[0.95rem] w-[0.95rem]" />
              Open Free Account
            </Link>
            <Link to="/main/dashboard" className="sr-btn-cta-sec">
              Learn More
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ─── FOOTER ─── */}
      <footer
        className="sr-footer"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "50px 40px 30px",
          backdropFilter: "blur(40px)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <div
            className="mb-10 flex flex-wrap items-start justify-between"
            style={{ gap: 32 }}
          >
            <div style={{ maxWidth: 300 }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="sr-logo-box"
                  style={{ width: 40, height: 40, fontSize: "0.75rem" }}
                >
                  1TM
                </div>
                <div
                  className="sr-outfit"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {(() => {
                    const parts = brandName.split(" ").filter(Boolean);
                    if (parts.length <= 1) return brandName;
                    const head = parts.slice(0, -1).join(" ");
                    const tail = parts[parts.length - 1];
                    return (
                      <>
                        {head}{" "}
                        <em className="not-italic" style={{ color: "#00dfa2" }}>
                          {tail}
                        </em>
                      </>
                    );
                  })()}
                </div>
              </div>
              <p
                className="mt-2.5"
                style={{
                  fontSize: "0.82rem",
                  color: "#4a5468",
                  lineHeight: 1.75,
                }}
              >
                Swiss-regulated digital asset trading platform committed to
                innovation, transparency, and meaningful social impact.
              </p>
            </div>

            <FooterColumn title="Company" items={FOOTER_COMPANY} />
            <FooterColumn title="Products" items={FOOTER_PRODUCTS} />

            <div>
              <h5
                className="sr-outfit"
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#4a5468",
                  marginBottom: 14,
                }}
              >
                CSR Programs
              </h5>
              <ul
                className="flex flex-col"
                style={{ gap: 9, listStyle: "none" }}
              >
                {FOOTER_CSR_PROGRAMS.map((p) => (
                  <li key={p}>
                    <span style={{ fontSize: "0.83rem", color: "#4a5468" }}>
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.08)",
              marginBottom: 24,
            }}
          />

          <div
            className="flex flex-wrap items-center justify-between"
            style={{
              gap: 12,
              fontSize: "0.78rem",
              color: "#4a5468",
            }}
          >
            <span>
              © 2026 1 Trade Market. Registered in Switzerland. FINMA Licensed.
            </span>
            <span className="flex flex-wrap" style={{ gap: 16 }}>
              <span style={{ color: "#4a5468" }}>Privacy Policy</span>
              <span style={{ color: "#4a5468" }}>Terms of Service</span>
              <span style={{ color: "#4a5468" }}>Cookie Policy</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// LOCAL HELPER COMPONENTS
// ───────────────────────────────────────────────────────────────

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div>
      <h5
        className="sr-outfit"
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#4a5468",
          marginBottom: 14,
        }}
      >
        {title}
      </h5>
      <ul className="flex flex-col" style={{ gap: 9, listStyle: "none" }}>
        {items.map((it) => (
          <li key={it.label}>
            <Link
              to={it.to}
              style={{
                fontSize: "0.83rem",
                color: "#4a5468",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00dfa2")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5468")}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

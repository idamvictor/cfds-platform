import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Menu, X as XIcon } from "lucide-react";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore";

interface NavItem {
  label: string;
  to: string;
  external?: boolean;
}

// Unified nav across all dashboard pages — real workspace routes only.
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/main/dashboard" },
  { label: "Markets", to: "/main/market" },
  { label: "Trade Room", to: "/trading", external: true },
  { label: "Wallet", to: "/main/wallet" },
  { label: "Funds", to: "/main/withdrawal" },
  { label: "Rewards", to: "/main/rewards" },
  { label: "Settings", to: "/main/settings" },
];

// Active-route matching: exact match for top-level, plus path-prefix for sub-paths.
function isActive(currentPath: string, to: string): boolean {
  if (currentPath === to) return true;
  // /main/wallet covers both /main/wallet and ?tab queries handled by router
  // /main/withdrawal covers /main/withdrawal*
  if (to !== "/" && to !== "/main/dashboard" && currentPath.startsWith(to + "/"))
    return true;
  return false;
}

export default function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const settings = useSiteSettingsStore((s) => s.settings);
  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "JD";
  const brandName = settings?.name || "1 Trade Market";
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const renderItem = (item: NavItem, onClick?: () => void) => {
    const active = isActive(location.pathname, item.to);
    const className = `dn-link${active ? " dn-link-active" : ""}`;
    if (item.external) {
      return (
        <a
          key={item.label}
          href={item.to}
          className={className}
          onClick={onClick}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link
        key={item.label}
        to={item.to}
        className={className}
        onClick={onClick}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <div className="dn-root">
      <style>{`
        .dn-root {
          position: relative;
          z-index: 190;
          background: #111217;
          border-bottom: 1px solid #1a1b22;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #e4e4e7;
        }
        .dn-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 52px;
          gap: 16px;
        }
        .dn-left {
          display: flex;
          align-items: center;
          gap: 28px;
          min-width: 0;
          flex: 1;
        }
        .dn-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          text-decoration: none;
          color: #ffffff;
        }
        .dn-brand-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          display: block;
        }
        .dn-brand-name {
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
        .dn-brand-name em { font-style: normal; color: #00dfa2; }

        .dn-links {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 13px;
        }
        .dn-link {
          color: #9ca3af;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          line-height: 1.2;
          transition: color 0.15s ease;
          white-space: nowrap;
        }
        .dn-link:hover { color: #ffffff; }
        .dn-link-active { color: #00dfa2; }
        .dn-link-active:hover { color: #00dfa2; }

        .dn-right {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #9ca3af;
          flex-shrink: 0;
        }
        .dn-icon-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dn-icon-btn:hover { color: #ffffff; }
        .dn-icon-btn.search { width: 16px; height: 16px; }
        .dn-icon-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #1f2028;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          position: relative;
          padding: 0;
        }
        .dn-icon-circle:hover {
          background: #2a2b34;
          color: #ffffff;
        }
        .dn-avatar-text {
          font-size: 11px;
          font-weight: 700;
          color: #00dfa2;
          letter-spacing: 0.2px;
        }
        .dn-bell-dot {
          position: absolute;
          top: 4px;
          right: 6px;
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
        }
        .dn-hamburger {
          display: none;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #1f2028;
          border: 1px solid #1a1b22;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.15s ease, background 0.15s ease;
          padding: 0;
        }
        .dn-hamburger:hover { color: #ffffff; background: #2a2b34; }

        /* Drawer */
        .dn-drawer {
          background: #0f1015;
          border-bottom: 1px solid #1a1b22;
          padding: 8px 20px 16px;
        }
        .dn-drawer .dn-link {
          display: block;
          padding: 12px 4px;
          width: 100%;
          text-align: left;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .dn-drawer .dn-link:last-child { border-bottom: none; }

        /* Responsive: hamburger threshold = <1280px (xl) */
        @media (max-width: 1279px) {
          .dn-links { display: none; }
          .dn-hamburger { display: inline-flex; }
        }
        @media (max-width: 640px) {
          .dn-brand-name { display: none; }
          .dn-inner { padding: 0 14px; gap: 10px; }
          .dn-right { gap: 10px; }
        }
      `}</style>

      <div className="dn-inner">
        {/* LEFT: brand + nav links */}
        <div className="dn-left">
          <Link to="/main/dashboard" className="dn-brand" aria-label={brandName}>
            <svg
              className="dn-brand-icon"
              viewBox="0 0 22 22"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="11,1 20,6 20,16 11,21 2,16 2,6"
                fill="#00dfa2"
                opacity="0.95"
              />
              <text
                x="11"
                y="14"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#0d0e12"
              >
                1
              </text>
            </svg>
            <span className="dn-brand-name">{brandName}</span>
          </Link>

          <nav className="dn-links" aria-label="Primary">
            {NAV_ITEMS.map((item) => renderItem(item))}
          </nav>
        </div>

        {/* RIGHT: search + avatar + bell + hamburger */}
        <div className="dn-right">
          <button
            type="button"
            className="dn-icon-btn search"
            aria-label="Markets"
            onClick={() => navigate("/main/market")}
          >
            <Search className="h-4 w-4" />
          </button>
          <Link to="/main/personal" className="dn-icon-circle" aria-label="Profile">
            {user ? (
              <span className="dn-avatar-text">{initials}</span>
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
          </Link>
          <Link to="/main/chat" className="dn-icon-circle" aria-label="Notifications">
            <Bell className="h-3.5 w-3.5" />
            <span className="dn-bell-dot" />
          </Link>
          <button
            type="button"
            className="dn-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <XIcon className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="dn-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="dn-drawer">
              {NAV_ITEMS.map((item) => renderItem(item, () => setMenuOpen(false)))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

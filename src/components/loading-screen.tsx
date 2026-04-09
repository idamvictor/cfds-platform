import { useEffect, useRef, useState, useCallback } from "react";
import useSiteSettingsStore from "@/store/siteSettingStore";

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const { settings } = useSiteSettingsStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Animation sequencing phases (internal timing for animation only)
  const [ringCollapsing, setRingCollapsing] = useState(false);
  const [ringHidden, setRingHidden] = useState(false);
  const [logoRevealed, setLogoRevealed] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);

  const brandName = settings?.name || "1 Trade Market";

  // Split brand name into main + accent. If the name contains "Market", accent it.
  const brandParts = (() => {
    const idx = brandName.lastIndexOf(" ");
    if (idx > 0) {
      return { main: brandName.slice(0, idx) + " ", accent: brandName.slice(idx + 1) };
    }
    return { main: brandName, accent: "" };
  })();

  // Phase sequencing: rings → collapse → logo → brand text
  // These are animation-sequencing timers only — they do NOT control when loading finishes.
  useEffect(() => {
    // After mount, start collapse after rings have spun briefly
    const t1 = setTimeout(() => setRingCollapsing(true), 1200);
    // After collapse animation (800ms), hide rings and reveal logo
    const t2 = setTimeout(() => {
      setRingHidden(true);
      setLogoRevealed(true);
    }, 2000);
    // After logo settles (600ms), reveal brand text
    const t3 = setTimeout(() => setBrandVisible(true), 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Fire onLoaded when provided (preserves the original interface contract)
  useEffect(() => {
    if (brandVisible && onLoaded) {
      onLoaded();
    }
  }, [brandVisible, onLoaded]);

  // Particle canvas
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const pts: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 50; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,223,162,${p.a})`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const dx = p.x - pts[j].x;
          const dy = p.y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,223,162,${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const cleanup = initParticles();
    return cleanup;
  }, [initParticles]);

  const dataFragments = [
    { text: "0x7f3a...c2d1", style: { top: "15%", left: "8%" } },
    { text: "SHA256:OK", style: { top: "72%", left: "12%" } },
    { text: "TLS 1.3", style: { top: "25%", right: "10%" } },
    { text: "AES 256", style: { top: "68%", right: "8%" } },
    { text: "WSS://LIVE", style: { top: "45%", left: "5%" } },
    { text: "NODE:SYNC", style: { top: "82%", right: "15%" } },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #07080c 0%, #10131a 100%)" }}
    >
      {/* Background layers */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="ls-dot-grid" />
      <div className="ls-orb ls-orb-1" />
      <div className="ls-orb ls-orb-2" />
      <div className="ls-orb ls-orb-3" />
      <div className="ls-scan-line" />

      {/* Corner accents */}
      <div className="ls-corner ls-corner-tl" />
      <div className="ls-corner ls-corner-tr" />
      <div className="ls-corner ls-corner-bl" />
      <div className="ls-corner ls-corner-br" />

      {/* Data fragments */}
      {dataFragments.map((frag) => (
        <div key={frag.text} className="ls-data-frag" style={frag.style}>
          {frag.text}
        </div>
      ))}

      {/* Main loader */}
      <div className="ls-wrap relative z-[2] flex flex-col items-center gap-0">
        {/* Phase 1: Spinning Rings */}
        {!ringHidden && (
          <div className={`ls-ring-phase ${ringCollapsing ? "collapsing" : ""}`}>
            <div className="ls-spin-ring ls-spin-ring-1" />
            <div className="ls-spin-ring ls-spin-ring-2" />
            <div className="ls-spin-ring ls-spin-ring-3" />
            <div className="ls-spin-ring ls-spin-ring-4" />
            <div className="ls-ring-core" />
          </div>
        )}

        {/* Phase 2: Logo + Brand Text */}
        <div className={`ls-logo-phase ${logoRevealed ? "revealed" : ""}`}>
          <div className="ls-logo-stage">
            <div className="ls-logo-rotator">
              <div className="ls-logo-vol-glow" />
              <div className="ls-logo-box">
                <div className="ls-logo-rim" />
                <div className="ls-logo-depth" />
                <div className="ls-logo-depth-left" />
                <div className="ls-logo-depth-right" />
                <span className="ls-logo-1">1</span>
                <span className="ls-logo-tm">TM</span>
              </div>
              <div className="ls-logo-reflection" />
            </div>
          </div>
          <div className={`ls-brand-text ${brandVisible ? "visible" : ""}`}>
            <h1>
              {brandParts.main}
              <em>{brandParts.accent}</em>
            </h1>
            <div className="ls-tagline">One Click to All Markets</div>
          </div>
        </div>
      </div>
    </div>
  );
}

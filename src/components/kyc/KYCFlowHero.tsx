interface KYCFlowHeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function KYCFlowHero({
  eyebrow = "Account Management",
  title = "Identity Verification",
  subtitle = "Complete KYC to unlock full trading limits and premium features",
}: KYCFlowHeroProps) {
  return (
    <div
      className="border-b border-[rgba(255,255,255,0.06)] px-4 py-10 md:px-12"
      style={{
        background:
          "linear-gradient(145deg,rgba(0,223,162,0.06),rgba(255,255,255,0.01))",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-3 inline-flex items-center gap-2.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#00dfa2]">
          <span className="h-px w-6 bg-[rgba(0,223,162,0.5)]" />
          {eyebrow}
          <span className="h-px w-6 bg-[rgba(0,223,162,0.5)]" />
        </div>
        <h1 className="font-[Outfit,sans-serif] text-[1.8rem] font-extrabold tracking-[-0.03em] text-[#eef2f7] sm:text-[2.1rem]">
          {title}
        </h1>
        <p className="mt-2 text-[0.92rem] text-[#8b97a8]">{subtitle}</p>
      </div>
    </div>
  );
}

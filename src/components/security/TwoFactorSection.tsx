import { Shield, Smartphone, Mail, XCircle } from "lucide-react";

interface MethodCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function MethodCard({ title, description, icon: Icon }: MethodCardProps) {
  return (
    <div
      className="rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[10px]"
            style={{ background: "rgba(0,223,162,0.1)", color: "#00dfa2" }}
          >
            <Icon className="h-[0.88rem] w-[0.88rem]" />
          </div>
          <div className="text-[0.92rem] font-extrabold text-[#eef2f7]">
            {title}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(244,63,94,0.25)] bg-[rgba(244,63,94,0.08)] px-2.5 py-1 text-[0.65rem] font-bold text-[#f43f5e]">
          <XCircle className="h-3 w-3" />
          Off
        </span>
      </div>
      <p className="mb-4 text-[0.8rem] leading-[1.6] text-[#4a5468]">
        {description}
      </p>
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-[0.78rem] font-bold text-[#3a4556]"
      >
        Coming Soon
      </button>
    </div>
  );
}

export function TwoFactorSection() {
  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: "rgba(0,223,162,0.1)", color: "#00dfa2" }}
        >
          <Shield className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
          Two-Factor Authentication
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <MethodCard
          title="Google Authenticator"
          description="Use Google Authenticator app for time-based one-time passwords (TOTP). Most secure 2FA method."
          icon={Shield}
        />
        <MethodCard
          title="SMS Authentication"
          description="Receive verification codes via SMS to your registered phone number."
          icon={Smartphone}
        />
        <MethodCard
          title="Email Authentication"
          description="Receive verification codes by email when signing in."
          icon={Mail}
        />
      </div>
    </section>
  );
}

import { ShieldCheck, Clock, CircleHelp, LifeBuoy } from "lucide-react";

interface SidebarCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}

function SidebarCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
}: SidebarCardProps) {
  return (
    <div
      className="rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
      }}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <div className="text-[0.88rem] font-extrabold text-[#eef2f7]">
          {title}
        </div>
      </div>
      <div className="text-[0.78rem] leading-[1.6] text-[#8b97a8]">
        {children}
      </div>
    </div>
  );
}

export function KYCFlowSidebar() {
  return (
    <aside className="flex flex-col gap-4">
      <SidebarCard
        icon={ShieldCheck}
        iconBg="rgba(30,215,96,0.1)"
        iconColor="#1ED760"
        title="Security & Privacy"
      >
        <p>
          Your documents are encrypted in transit and at rest. We never share
          your personal information with third parties without explicit consent.
        </p>
      </SidebarCard>

      <SidebarCard
        icon={Clock}
        iconBg="rgba(240,180,41,0.1)"
        iconColor="#F0B429"
        title="Review Timeline"
      >
        <p>
          Most submissions are reviewed within 24 hours. You'll be notified by
          email once a decision is made.
        </p>
      </SidebarCard>

      <SidebarCard
        icon={CircleHelp}
        iconBg="rgba(74,144,226,0.1)"
        iconColor="#4A90E2"
        title="FAQ"
      >
        <p>
          Wondering what documents you need or how long verification takes? Our
          help center has step-by-step guides.
        </p>
      </SidebarCard>

      <SidebarCard
        icon={LifeBuoy}
        iconBg="rgba(0,223,162,0.1)"
        iconColor="#00dfa2"
        title="Need Help?"
      >
        <p>
          Our support team is available around the clock to help you complete
          verification.
        </p>
      </SidebarCard>
    </aside>
  );
}

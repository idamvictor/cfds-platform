import { CircleAlert, Snowflake, Ban, Download } from "lucide-react";

interface ActionRowProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  title: string;
  description: string;
  buttonLabel: string;
}

function ActionRow({
  icon: Icon,
  iconColor,
  title,
  description,
  buttonLabel,
}: ActionRowProps) {
  return (
    <div
      className="flex flex-col items-start justify-between gap-3 rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5 sm:flex-row sm:items-center"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
      }}
    >
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2 text-[0.92rem] font-extrabold text-[#eef2f7]">
          <Icon className="h-[0.92rem] w-[0.92rem]" style={{ color: iconColor }} />
          {title}
        </div>
        <p className="text-[0.78rem] leading-[1.6] text-[#4a5468]">
          {description}
        </p>
      </div>
      <button
        type="button"
        disabled
        className="cursor-not-allowed whitespace-nowrap rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-[0.78rem] font-bold text-[#3a4556]"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export function AccountActionsCard() {
  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: "rgba(0,223,162,0.1)", color: "#00dfa2" }}
        >
          <CircleAlert className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
          Account Actions
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <ActionRow
          icon={Snowflake}
          iconColor="#00ffc3"
          title="Freeze Account"
          description="Temporarily freeze your account to prevent all trading and withdrawals."
          buttonLabel="Coming Soon"
        />
        <ActionRow
          icon={Ban}
          iconColor="#f43f5e"
          title="Disable Account"
          description="Permanently disable your account. This action cannot be undone."
          buttonLabel="Coming Soon"
        />
        <ActionRow
          icon={Download}
          iconColor="#c8e64e"
          title="Export Account Data"
          description="Download your complete account data in compliance with data protection regulations."
          buttonLabel="Coming Soon"
        />
      </div>
    </section>
  );
}

import { Laptop, Inbox } from "lucide-react";

export function DeviceManagementCard() {
  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: "rgba(0,223,162,0.1)", color: "#00dfa2" }}
        >
          <Laptop className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
          Device Management
        </h2>
      </div>

      <div
        className="rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5"
        style={{
          background:
            "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
        }}
      >
        <div className="mb-4 text-[0.92rem] font-extrabold text-[#eef2f7]">
          Active Devices
        </div>
        <div className="rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[rgba(0,0,0,0.2)] p-8">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(0,223,162,0.25)]"
              style={{ background: "rgba(0,223,162,0.08)" }}
            >
              <Inbox className="h-4 w-4 text-[#00dfa2]" />
            </div>
            <div className="text-[0.85rem] font-bold text-[#eef2f7]">
              No active device sessions available
            </div>
            <div className="max-w-[320px] text-[0.75rem] text-[#4a5468]">
              Active sessions and connected devices will appear here when this
              feature becomes available.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

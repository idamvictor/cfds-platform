import { History, Inbox } from "lucide-react";

export function LoginActivityCard() {
  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: "rgba(0,223,162,0.1)", color: "#00dfa2" }}
        >
          <History className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
          Login Activity Log
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
          Recent Login Activity
        </div>

        <div className="overflow-x-auto rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[rgba(0,0,0,0.2)]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Date", "IP Address", "Device", "Status"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#3a4556]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(0,223,162,0.25)]"
                      style={{ background: "rgba(0,223,162,0.08)" }}
                    >
                      <Inbox className="h-4 w-4 text-[#00dfa2]" />
                    </div>
                    <div className="text-[0.85rem] font-bold text-[#eef2f7]">
                      No login activity available
                    </div>
                    <div className="max-w-[320px] text-[0.75rem] text-[#4a5468]">
                      Recent sign-in events will appear here when this feature
                      becomes available.
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

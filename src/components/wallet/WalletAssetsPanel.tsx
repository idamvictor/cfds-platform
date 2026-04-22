import { Coins, Inbox } from "lucide-react";

export function WalletAssetsPanel() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.08)] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[40px]"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04),rgba(0,223,162,0.02))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(175deg,rgba(255,255,255,0.04),transparent 40%)",
        }}
      />
      <div className="relative">
        <div className="mb-5 flex items-center gap-2.5 border-b border-[rgba(255,255,255,0.06)] pb-4 text-[0.95rem] font-extrabold text-[#eef2f7]">
          <Coins className="h-4 w-4 text-[#00dfa2]" />
          Portfolio Holdings
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {[
                  "Asset",
                  "Balance",
                  "Value (USD)",
                  "Price",
                  "24h Change",
                  "Allocation",
                ].map((h, i, arr) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-[14px] py-[10px] text-left text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#4a5468] ${
                      i === 0
                        ? "rounded-tl-[10px]"
                        : i === arr.length - 1
                          ? "rounded-tr-[10px]"
                          : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,223,162,0.25)]"
                      style={{ background: "rgba(0,223,162,0.08)" }}
                    >
                      <Inbox className="h-5 w-5 text-[#00dfa2]" />
                    </div>
                    <div className="text-[0.95rem] font-extrabold text-[#eef2f7]">
                      No assets yet
                    </div>
                    <div className="max-w-[360px] text-[0.78rem] leading-[1.6] text-[#4a5468]">
                      Your portfolio holdings will appear here once you start
                      trading or making deposits.
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

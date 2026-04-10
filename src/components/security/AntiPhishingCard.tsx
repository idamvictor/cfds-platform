import { Fish } from "lucide-react";

export function AntiPhishingCard() {
  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: "rgba(0,223,162,0.1)", color: "#00dfa2" }}
        >
          <Fish className="h-[0.88rem] w-[0.88rem]" />
        </div>
        <h2 className="text-[1.05rem] font-extrabold text-[#eef2f7]">
          Anti-Phishing Code
        </h2>
      </div>

      <div
        className="rounded-[14px] border border-[rgba(255,255,255,0.06)] p-5"
        style={{
          background:
            "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
        }}
      >
        <div className="mb-2 text-[0.92rem] font-extrabold text-[#eef2f7]">
          Set Your Anti-Phishing Code
        </div>
        <p className="mb-4 text-[0.8rem] leading-[1.6] text-[#4a5468]">
          A unique code that will appear in all official emails from us, helping
          you identify legitimate communications.
        </p>
        <div className="mb-4">
          <label className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
            Your Code
          </label>
          <input
            type="text"
            disabled
            placeholder="Coming soon"
            className="w-full cursor-not-allowed rounded-[10px] border-[1.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3.5 py-2.5 text-[0.85rem] text-[#3a4556] placeholder:text-[#3a4556]"
          />
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-[0.78rem] font-bold text-[#3a4556]"
        >
          Coming Soon
        </button>
      </div>
    </section>
  );
}

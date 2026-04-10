import { Clock, X } from "lucide-react";

interface VerifyLaterModalProps {
  open: boolean;
  onClose: () => void;
  onStartNow: () => void;
  onLater: () => void;
}

export function VerifyLaterModal({
  open,
  onClose,
  onStartNow,
  onLater,
}: VerifyLaterModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.08)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        style={{
          background:
            "linear-gradient(145deg,rgba(20,25,40,0.98),rgba(10,13,21,0.98))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#4a5468] transition-colors hover:bg-white/[0.06] hover:text-[#eef2f7]"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "rgba(240,180,41,0.1)", color: "#F0B429" }}
        >
          <Clock className="h-5 w-5" />
        </div>

        <h3 className="text-center text-[1.1rem] font-extrabold text-[#eef2f7]">
          Complete verification later?
        </h3>
        <p className="mt-2 text-center text-[0.82rem] leading-[1.6] text-[#8b97a8]">
          To unlock full trading features, you can complete the remaining
          verification steps at any time from your dashboard.
        </p>

        <div className="my-5 flex flex-col gap-2">
          {[
            { num: 1, text: "Provide identity document" },
            { num: 2, text: "Complete verification" },
          ].map((s) => (
            <div
              key={s.num}
              className="flex items-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-3"
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[0.72rem] font-bold"
                style={{
                  background: "rgba(0,223,162,0.1)",
                  color: "#00dfa2",
                }}
              >
                {s.num}
              </div>
              <span className="text-[0.82rem] font-semibold text-[#8b97a8]">
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onStartNow}
          className="w-full rounded-[10px] bg-gradient-to-br from-[#00dfa2] to-[#00b881] py-3 text-[0.88rem] font-extrabold text-[#07080c] shadow-[0_4px_16px_rgba(0,223,162,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,223,162,0.4)] active:scale-[0.98]"
        >
          Start verification now
        </button>
        <button
          onClick={onLater}
          className="mt-2 w-full rounded-[10px] border border-white/[0.08] bg-white/[0.03] py-3 text-[0.84rem] font-bold text-[#8b97a8] transition-all hover:bg-white/[0.06] hover:text-[#eef2f7] active:scale-[0.98]"
        >
          I'll do it later
        </button>
      </div>
    </div>
  );
}

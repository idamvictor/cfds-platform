import useUserStore from "@/store/userStore";

export function SecurityScoreCard() {
  const user = useUserStore((state) => state.user);
  const isVerified = user?.verification_status === "approved";

  // Score derived only from real, verifiable user state.
  // Each item contributes a fixed weight when satisfied. No fake numbers.
  const items = [
    {
      label: "Account Verification",
      satisfied: isVerified,
      weight: 50,
      hint: "Complete KYC verification",
    },
    {
      label: "Strong Password",
      satisfied: false, // no backend signal — neutral state
      weight: 50,
      hint: "Change your password regularly",
    },
  ];

  const score = items.reduce((sum, i) => (i.satisfied ? sum + i.weight : sum), 0);
  const percent = score; // total weights = 100
  const status =
    score >= 80 ? "Excellent" : score >= 50 ? "Good" : score > 0 ? "Fair" : "—";
  const statusColor =
    score >= 80
      ? "#00dfa2"
      : score >= 50
        ? "#00dfa2"
        : score > 0
          ? "#FF9800"
          : "#4a5468";

  // SVG circle math
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const recommendations = items.filter((i) => !i.satisfied).map((i) => i.hint);

  return (
    <div
      className="mb-6 flex flex-col gap-6 rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.08)] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] sm:flex-row sm:items-center"
      style={{
        background:
          "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
      }}
    >
      {/* Score circle */}
      <div className="relative flex h-[180px] w-[180px] shrink-0 items-center justify-center self-center">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset .8s ease" }}
          />
        </svg>
        <div className="relative text-center">
          <div className="font-mono text-[2.4rem] font-extrabold leading-none text-[#eef2f7]">
            {score}
          </div>
          <div className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#4a5468]">
            Score
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1">
        <div className="text-[0.85rem] font-semibold text-[#8b97a8]">
          Your account is{" "}
          <span className="font-extrabold" style={{ color: statusColor }}>
            {status}
          </span>
        </div>
        <p className="mt-2 text-[0.83rem] leading-[1.6] text-[#4a5468]">
          Strengthen your account by following the recommendations below.
        </p>
        <div className="mt-4">
          <div className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#3a4556]">
            Recommendations
          </div>
          {recommendations.length === 0 ? (
            <div className="text-[0.78rem] text-[#4a5468]">
              No outstanding recommendations.
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {recommendations.map((rec) => (
                <li
                  key={rec}
                  className="flex items-center gap-2 text-[0.8rem] text-[#8b97a8]"
                >
                  <span className="text-[#00dfa2]">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

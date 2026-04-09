import { AlertCircle } from "lucide-react";

const GUIDELINES = [
  "Photos of an explicitly sexual or pornographic nature",
  "Images aimed at inciting ethnic or racial hatred or aggression",
  "Photos involving persons under 18 years of age",
  "Third-party copyright protected photos",
  "Images larger than 5 MB and in a format other than JPG, GIF or PNG",
];

export function PhotoGuidelines() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FF9800]/10">
          <AlertCircle className="h-3.5 w-3.5 text-[#FF9800]" />
        </div>
        <h3 className="text-[13px] font-bold text-[#eef2f7]">
          It is not allowed to publish:
        </h3>
      </div>

      <ul className="space-y-2.5 mb-5">
        {GUIDELINES.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF9800]/60" />
            <span className="text-xs leading-relaxed text-[#8b97a8]">
              {item}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 border-t border-white/[0.06]">
        <p className="text-[11px] leading-relaxed text-[#4a5468]">
          Your face must be clearly visible on the photo. All photos and videos
          uploaded by you must comply with these requirements, otherwise they can
          be removed.
        </p>
      </div>
    </div>
  );
}

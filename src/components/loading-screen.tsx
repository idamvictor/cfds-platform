import type React from "react";

import { useEffect, useState } from "react";
import { BarChart3, LineChart, TrendingUp } from "lucide-react";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  const { settings } = useSiteSettingsStore()

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onLoaded?.(); // Notify parent when loading is complete
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background text-white">
      <div className="mb-8 flex items-center gap-2">
        <TrendingUp className="h-8 w-8 text-emerald-500" />
        <h1 className="text-3xl font-bold">{ settings?.name }</h1>
      </div>

      <div className="mb-12 flex items-center gap-6">
        <IconPulse
          icon={<BarChart3 className="h-6 w-6 text-emerald-400" />}
          delay={0}
        />
        <IconPulse
          icon={<LineChart className="h-6 w-6 text-emerald-400" />}
          delay={0.2}
        />
        <IconPulse
          icon={<TrendingUp className="h-6 w-6 text-emerald-400" />}
          delay={0.4}
        />
      </div>

      <div className="mb-2 w-64 overflow-hidden rounded-full bg-zinc-800 sm:w-80">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-zinc-400">Loading market data...</p>
    </div>
  );
}

interface IconPulseProps {
  icon: React.ReactNode;
  delay: number;
}

function IconPulse({ icon, delay }: IconPulseProps) {
  return (
    <div
      className="animate-pulse"
      style={{
        animationDuration: "1.5s",
        animationDelay: `${delay}s`,
        animationIterationCount: "infinite",
      }}
    >
      {icon}
    </div>
  );
}

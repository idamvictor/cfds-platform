import { Button } from "@/components/ui/button";
import { Minimize2, Square, X, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { useNavigate } from "react-router-dom";
import useDarkModeStore from "@/store/darkModeStore";

export function TitleBar() {
  const settings = useSiteSettingsStore((state) => state.settings);
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  const navigate = useNavigate();

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-slate-800 border-slate-600"
          : "bg-white border-slate-400"
      } border-b px-4 py-1 flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">📊</span>
        </div>
        <span
          className={`${
            isDarkMode ? "text-slate-200" : "text-slate-800"
          } text-xs font-medium`}
        >
          {settings?.name || "Demo Account"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Sun
          className={`h-4 w-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
        />
        <Switch
          checked={isDarkMode}
          onCheckedChange={() => useDarkModeStore.getState().toggleDarkMode()}
          className="data-[state=checked]:bg-slate-600"
        />
        <Moon
          className={`h-4 w-4 ${isDarkMode ? "text-slate-300" : "text-slate-400"}`}
        />

        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 ${
            isDarkMode
              ? "hover:bg-slate-700 text-slate-300"
              : "hover:bg-slate-300 text-slate-600"
          }`}
        >
          <Minimize2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 ${
            isDarkMode
              ? "hover:bg-slate-700 text-slate-300"
              : "hover:bg-slate-300 text-slate-600"
          }`}
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 hover:bg-red-500 hover:text-white ${
            isDarkMode ? "text-slate-300" : "text-slate-600"
          }`}
          onClick={() => navigate("/main/dashboard")}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

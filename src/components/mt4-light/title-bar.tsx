import { Button } from "@/components/ui/button";
import { Minimize2, Square, X } from "lucide-react";
import useSiteSettingsStore from "@/store/siteSettingStore";
import useAssetStore from "@/store/assetStore";
import { useNavigate } from "react-router-dom";

export function TitleBar() {
  const settings = useSiteSettingsStore((state) => state.settings);
  const activeAsset = useAssetStore((state) => state.activeAsset);
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-400 px-4 py-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">📊</span>
        </div>
        <span className="text-slate-800 text-xs font-medium">
          {settings?.name || "Demo Account"}
        </span>
        <span className="text-slate-800 text-xs font-medium">
          - [ {activeAsset?.symbol_display || "BTC/USD"},M1 ]
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-slate-300 text-slate-600"
        >
          <Minimize2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-slate-300 text-slate-600"
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white text-slate-600"
          onClick={() => navigate("/main/dashboard")}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

import useSiteSettingsStore from "@/store/siteSettingStore";
import React from "react";

const Logo: React.FC = () => {
  const settings = useSiteSettingsStore((state) => state.settings);

  return (
    <div className="flex items-center gap-1">
      <img
        src={settings?.logo}
        alt="Logo"
        className="w-20 h-15 rounded flex items-center justify-center"
      />
    </div>
  );
};

export default Logo;

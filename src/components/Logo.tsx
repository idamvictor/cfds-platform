import useSiteSettingsStore from "@/store/siteSettingStore";
import React from "react";

const Logo: React.FC = () => {
  const settings = useSiteSettingsStore((state) => state.settings);

  return (
    <a href={settings?.website_url} target='_blank' className="flex items-center gap-1">
      <img
        src={settings?.logo}
        alt="Logo"
        className="w-auto h-12 rounded flex items-center justify-center"
      />
    </a>
  );
};

export default Logo;

import useSiteSettingsStore from "@/store/siteSettingStore";
import React from "react";

const Logo: React.FC = () => {
  const settings = useSiteSettingsStore((state) => state.settings);

  return (
    <a href={settings?.website_url} target='_blank' className="flex items-center py-2 gap-1">

        <img
            src={settings?.logo}
            alt="Logo"
            className="hidden md:block w-auto h-10 rounded"
        />
        {/* Small logo - visible on small screens, hidden on md screens and up */}
        <img
            src={settings?.logo_sm || settings?.logo}
            alt="Logo"
            className="block md:hidden w-auto h-8 rounded"
        />
     </a>
  );
};

export default Logo;

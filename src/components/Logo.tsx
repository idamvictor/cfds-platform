import useSiteSettingsStore from "@/store/siteSettingStore";
import React from "react";

const Logo: React.FC = () => {
  const settings = useSiteSettingsStore((state) => state.settings);


  const v_code =  localStorage.getItem('v_license');

  const baseUrl = settings?.website_url?.replace(/\/$/, '');

  const websiteUrl = `${baseUrl}?q=${v_code}`;


  return (
    <a href={websiteUrl} target='_blank' className="flex items-center gap-1">
      <img
        src={settings?.logo}
        alt="Logo"
        className="w-auto h-12 rounded flex items-center justify-center"
      />
    </a>
  );
};

export default Logo;

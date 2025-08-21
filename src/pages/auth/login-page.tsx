import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore";
import LoginBasic from "@/pages/auth/themes/LoginBasic.tsx";
import ICMarketLogin from "@/pages/auth/themes/ICMarketLogin.tsx";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";
import LoginTradeNation from "@/pages/auth/themes/LoginTradeNation.tsx";
import ICMarketLoginLight from "@/pages/auth/themes/ICMarketLoginLight.tsx";


export default function LoginPage() {
  const settings = useSiteSettingsStore((state) => state.settings);

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);


  const loginType = settings?.l_page ?? "basic";

  useEffect(() => {
    if (user && token) {
      navigate("/main");
    }
  }, [user, token, navigate]);

  if (loginType === "basic") {
    return <LoginBasic />;
  }

  if (loginType === "td") {
    return <LoginTradeNation />;
  }

  if (loginType === "ic") {
    return <ICMarketLoginLight />;
  }

  return <ICMarketLogin />;
}

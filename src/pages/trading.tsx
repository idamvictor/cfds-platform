import TradingPlatform from "@/components/trading/trading-interface-components/trading-platform";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";

import MT4Layout from "@/layouts/MT4Layout.tsx";

export default function Trading() {

  const settings = useSiteSettingsStore((state) => state.settings);

  const is_mt4 = settings?.is_mt4 ?? false;


  if (is_mt4){
    return <MT4Layout />
  }

  return <TradingPlatform />;
}

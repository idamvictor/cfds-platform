import { Routes, Route } from "react-router-dom";
import useSiteSettingsStore from "@/store/siteSettingStore";
import TradingPlatform from "@/components/trading/trading-interface-components/trading-platform";
import MT4Layout from "@/layouts/MT4Layout";
import MainContent from "@/components/mt4/main-content";

const TradingRouter = () => {
    const settings = useSiteSettingsStore((state) => state.settings);
    const is_mt4 = settings?.is_mt4 ?? false;

    if (is_mt4) {
        return (
            <Routes>
                <Route path="/" element={<MT4Layout />}>
                    <Route index element={<MainContent />} />
                </Route>
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<TradingPlatform />} />
        </Routes>
    );
};

export default TradingRouter;

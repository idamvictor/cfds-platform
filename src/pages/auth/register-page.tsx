import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore";
import useSiteSettingsStore from "@/store/siteSettingStore.ts";
import RegisterBasic from "@/pages/auth/themes/RegisterBasic.tsx";
import RegisterTDPage from "@/pages/auth/themes/RegisterTDPage.tsx";

export default function RegisterPage() {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const settings = useSiteSettingsStore((state) => state.settings);
    const register_page = settings?.r_page ?? "basic";

    useEffect(() => {
        if (user && token) {
            navigate("/main");
        }
    }, [user, token, navigate]);

    if (register_page === "td") {
        return <RegisterTDPage />;
    }

    return <RegisterBasic />;
}

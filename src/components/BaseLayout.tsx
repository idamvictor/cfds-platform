import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useDataStore from "@/store/dataStore";
import useUserStore from "@/store/userStore";

export function BaseLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const fetchSiteData = useDataStore(state => state.fetchData);
    const token = useUserStore(state => state.token);
    const [isStoreHydrated, setIsStoreHydrated] = useState(false);

    const authRoutes = ["/", "/login", "/register", "/forgot-password"];
    const isAuthRoute = authRoutes.some(route => location.pathname === route);

    useEffect(() => {
        const hydrateTimer = setTimeout(() => {
            setIsStoreHydrated(true);
        }, 100);

        return () => clearTimeout(hydrateTimer);
    }, []);

    useEffect(() => {
        if (!isStoreHydrated) return;

        const isAuthenticated = !!token;

        if (isAuthenticated && !isAuthRoute) {
            const fetchData = async () => {
                try {
                    await fetchSiteData();
                } catch (error) {
                    console.error("Error fetching site data:", error);
                }
            };

            fetchData();
        }
    }, [fetchSiteData, token, isAuthRoute, location.pathname, isStoreHydrated]);

    return <>{children}</>;
}

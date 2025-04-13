import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useDataStore from "@/store/dataStore";
import useUserStore from "@/store/userStore";

export function BaseLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const fetchSiteData = useDataStore(state => state.fetchData);
    const isAuthenticated = useUserStore(state => !!state.token);

    const authRoutes = ["/", "/login", "/register", "/forgot-password"];
    const isAuthRoute = authRoutes.some(route => location.pathname === route);

    useEffect(() => {
        if (isAuthenticated && !isAuthRoute) {
            fetchSiteData();
        }
    }, [fetchSiteData, isAuthenticated, isAuthRoute, location.pathname]);

    return <>{children}</>;
}

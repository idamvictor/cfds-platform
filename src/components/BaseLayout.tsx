import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import useDataStore from "@/store/dataStore";
import useUserStore from "@/store/userStore";
import {AccountDisabled} from "@/components/site/AccountDisabled.tsx";

export function BaseLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const fetchSiteData = useDataStore(state => state.fetchData);
    const token = useUserStore(state => state.token);
    const user = useUserStore(state => state.user);
    const getCurrentUser = useUserStore(state => state.getCurrentUser);
    const [isStoreHydrated, setIsStoreHydrated] = useState(false);
    const dataFetchedRef = useRef(false);

    const authRoutes = ["/register/country-residence","/signup","/", "/login", "/auto-login", "/register", "/forgot-password"];
    const isAuthRoute = authRoutes.some(route => location.pathname === route);

    // Wait for store hydration
    useEffect(() => {
        const hydrateTimer = setTimeout(() => {
            setIsStoreHydrated(true);
        }, 100);

        return () => clearTimeout(hydrateTimer);
    }, []);

    // Fetch data only once when authenticated and not on auth routes
    useEffect(() => {
        if (!isStoreHydrated) return;

        const isAuthenticated = !!token;

        // Only fetch data if authenticated, not on auth route, and data hasn't been fetched yet
        if (isAuthenticated && !isAuthRoute && !dataFetchedRef.current) {
            const fetchUserAndSiteData = async () => {
                try {
                    console.log("BaseLayout - Fetching initial data");
                    await getCurrentUser();
                    await fetchSiteData();
                    dataFetchedRef.current = true;
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchUserAndSiteData();
        }

        // Reset the fetch flag when logging out
        if (!isAuthenticated) {
            dataFetchedRef.current = false;
        }
    }, [token, isAuthRoute, getCurrentUser, fetchSiteData, isStoreHydrated]);

    // Handle transitions between auth and non-auth routes
    useEffect(() => {
        if (!isStoreHydrated) return;

        const isAuthenticated = !!token;

        // If user logs in (transitions from auth route to non-auth route)
        // and data hasn't been fetched, fetch the data
        if (isAuthenticated && !isAuthRoute && !dataFetchedRef.current) {
            const fetchUserAndSiteData = async () => {
                try {
                    console.log("BaseLayout - Fetching data after auth state change");
                    await getCurrentUser();
                    await fetchSiteData();
                    dataFetchedRef.current = true;
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchUserAndSiteData();
        }
    }, [isAuthRoute, token, getCurrentUser, fetchSiteData, isStoreHydrated]);


    if (user?.status === "deactivated" && !authRoutes) {
        return <AccountDisabled />;
    }


    return <>{children}</>;
}

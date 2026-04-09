import { useEffect, useState } from "react";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { setApiBaseUrl } from "@/lib/axios";
import { getApiBaseUrlFromWindowLocation } from "@/lib/api-base-url";

import {SiteUnreachable} from "@/components/site/SiteUnreachable.tsx";
import {SiteDisabled} from "@/components/site/SiteDisabled.tsx";
import LoadingScreen from "@/components/loading-screen.tsx";

interface SiteProviderProps {
    children: React.ReactNode;
}

export function SiteProvider({ children }: SiteProviderProps) {
    const {
        settings,
        isLoading,
        error,
        baseUrl,
        initialized,
        fetchSettings,
        setBaseUrl,
    } = useSiteSettingsStore();

    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    // Minimum display duration for the loading screen (3s)
    useEffect(() => {
        const timer = setTimeout(() => setMinTimeElapsed(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const apiUrl = getApiBaseUrlFromWindowLocation();
            setBaseUrl(apiUrl);
            setApiBaseUrl(apiUrl);
        }
    }, [setBaseUrl]);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                await fetchSettings();
            } catch (error) {
                console.error("SiteProvider - Error fetching settings:", error);
            } finally {
                setInitialLoadComplete(true);
            }
        };

        // If baseUrl is set, load settings
        if (baseUrl && !initialLoadComplete) {
            loadSettings();
        }
    }, [baseUrl, fetchSettings, initialLoadComplete]);

    // App is ready when settings have loaded (or failed)
    const appReady = initialLoadComplete || initialized || !isLoading;

    // Show loader until BOTH the app is ready AND minimum time has elapsed
    if (!appReady || !minTimeElapsed) {
        return <LoadingScreen />;
    }

    // If there's an error, show unreachable screen
    if (error) {
        return <SiteUnreachable />;
    }

    if (settings?.status === "disabled") {
        return <SiteDisabled />;
    }

    if (!settings && initialLoadComplete) {
        return <SiteUnreachable />;
    }

    if (initialized && settings?.status) {
        return <>{children}</>;
    }

    return null;
}

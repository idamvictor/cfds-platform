import { useEffect, useState } from "react";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { setApiBaseUrl } from "@/lib/axios";

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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            const hostname = window.location.hostname;
            let apiUrl = "";
            // Special handling for localhost environments
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                apiUrl = "https://demo.13i7.com/api/v1";
            }
            // Special handling for tradenation-cfd.com domains
            else if (hostname.includes('cfds-platform.vercel.app')) {
                apiUrl = 'https://demo.13i7.com/api/v1';
            }
            else {
                apiUrl = `${origin}/api/v1`;
            }
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

    if (!initialLoadComplete && isLoading && !initialized) {
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

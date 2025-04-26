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

            // Add debugging
            console.log('SiteProvider - Current origin:', origin);
            console.log('SiteProvider - Current hostname:', hostname);

            // Special handling for localhost environments
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('cfds-platform.vercel.app')) {
                apiUrl = "https://cfd.surdonline.com/api/v1";
                console.log("SiteProvider - Development environment detected. Using:", apiUrl);
            }
            // Special handling for tradenation-cfd.com domains
            else if (hostname === 'tradenation-cfd.com' || hostname.endsWith('.tradenation-cfd.com')) {
                apiUrl = 'https://online.tradenation-cfd.com/api/v1';
                console.log("SiteProvider - Trade Nation CFD domain detected. Using:");
            }
            else {
                apiUrl = `${origin}/api/v1`;
                console.log("SiteProvider - Using default URL:", apiUrl);
            }

            console.log(`SiteProvider - Setting API base URL to: ${apiUrl}`);
            setBaseUrl(apiUrl);
            setApiBaseUrl(apiUrl);
        }
    }, [setBaseUrl]);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                console.log('SiteProvider - Fetching settings with baseUrl:', baseUrl);
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

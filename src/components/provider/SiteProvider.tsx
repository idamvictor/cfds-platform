import { useEffect, useState } from "react";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { setApiBaseUrl } from "@/lib/axios";
import {LoadingScreen} from "@/components/site/LoadingScreen.tsx";
import {SiteUnreachable} from "@/components/site/SiteUnreachable.tsx";
import {SiteDisabled} from "@/components/site/SiteDisabled.tsx";


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
            let apiUrl = "";

            // Special handling for localhost environments
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                apiUrl = "https://cfd.surdonline.com/api/v1";
                console.log("Development environment detected. Using production API URL.");
            } else {
                apiUrl = `${origin}/api/v1`;
            }

            console.log(`Setting API base URL to: ${apiUrl}`);
            setBaseUrl(apiUrl);
            setApiBaseUrl(apiUrl);
        }
    }, []);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                await fetchSettings();
            } catch (error) {
                console.error("Error fetching settings:", error);
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

    return;
}

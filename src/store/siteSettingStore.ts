import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";


export interface SiteSettings {
    status: "active" | "disabled";
    name: string;
    logo?: string;
    r_page?: string;
    l_page?: string;
    logo_sm?: string;
    favicon?: string;
    theme?: string;
    contactEmail?: string;
    website_url?: string;
    privacy_url?: string;
    terms_url?: string;
    help_url?: string;
    risk_url?: string;
    login_page_header?: string;
    login_page_footer?: string;
    register_page_header?: string;
    register_page_footer?: string;
    maintenanceMessage?: string;
    // Add other settings as needed
    lastFetched: number;
    is_mt4: boolean;
    must_verify_account: boolean;
    has_marketplace: boolean;
}

interface SiteSettingsState {
    settings: SiteSettings | null;
    isLoading: boolean;
    error: string | null;
    baseUrl: string;
    initialized: boolean;
    setBaseUrl: (url: string) => void;
    fetchSettings: () => Promise<void>;
    clearSettings: () => void;
    setInitialized: (value: boolean) => void;
}


const useSiteSettingsStore = create<SiteSettingsState>()(
    persist(
        (set, get) => ({
            settings: null,
            isLoading: false,
            error: null,
            baseUrl: "",
            initialized: false,

            setBaseUrl: (url: string) => {
                set({ baseUrl: url });
            },

            setInitialized: (value: boolean) => {
                set({ initialized: value });
            },

            clearSettings: () => {
                set({ settings: null });
            },

            fetchSettings: async () => {
                const { baseUrl } = get();

                if (!baseUrl) {
                    set({ error: "No base URL configured", settings: null });
                    return;
                }

                // Only set loading to true if we don't have settings yet
                set({ isLoading: true, error: null });

                try {
                    // Make the request to get settings using the existing axios instance
                    const response = await axiosInstance.get("/settings");

                    // Update the store with the fetched settings
                    set({
                        settings: {
                            ...response?.data?.data,
                            lastFetched: Date.now()
                        },
                        isLoading: false,
                        error: null,
                        initialized: true
                    });

                    return response.data;
                } catch (error) {
                    console.error("Failed to fetch site settings:", error);

                    // IMPORTANT: Clear settings when API call fails
                    set({
                        settings: null,
                        error: "Failed to fetch site settings. The site might be unreachable.",
                        isLoading: false,
                        initialized: true
                    });

                    throw error;
                }
            },
        }),
        {
            name: "site-settings-storage",
            // Only persist settings, not baseUrl
            partialize: (state) => ({
                settings: state.settings,
                error: state.error,
                initialized: state.initialized,
            }),
        }
    )
);

export default useSiteSettingsStore;

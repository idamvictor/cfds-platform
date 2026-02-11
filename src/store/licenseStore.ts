import { create } from "zustand";
import { persist } from "zustand/middleware";

const VALIDATION_TTL = 5 * 60 * 1000; // 5 minutes

interface LicenseState {
    isValid: boolean;
    licenseCode: string | null;
    lastValidatedAt: number | null;
    setLicense: (code: string, isValid: boolean) => void;
    clearLicense: () => void;
    shouldRevalidate: () => boolean;
}

const useLicenseStore = create<LicenseState>()(
    persist(
        (set, get) => ({
            isValid: false,
            licenseCode: null,
            lastValidatedAt: null,
            setLicense: (code: string, isValid: boolean) =>
                set({
                    licenseCode: code,
                    isValid,
                    lastValidatedAt: isValid ? Date.now() : null
                }),
            clearLicense: () =>
                set({
                    licenseCode: null,
                    isValid: false,
                    lastValidatedAt: null
                }),
            shouldRevalidate: () => {
                const { lastValidatedAt, licenseCode } = get();

                // Always validate if no license code or never validated
                if (!licenseCode || !lastValidatedAt) {
                    return true;
                }

                // Check if TTL has expired
                const now = Date.now();
                const elapsed = now - lastValidatedAt;

                return elapsed > VALIDATION_TTL;
            },
        }),
        {
            name: "license-storage",
        }
    )
);

export default useLicenseStore;

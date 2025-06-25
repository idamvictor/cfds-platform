import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LicenseState {
    isValid: boolean;
    licenseCode: string | null;
    setLicense: (code: string, isValid: boolean) => void;
    clearLicense: () => void;
}

const useLicenseStore = create<LicenseState>()(
    persist(
        (set) => ({
            isValid: false,
            licenseCode: null,
            setLicense: (code: string, isValid: boolean) =>
                set({ licenseCode: code, isValid }),
            clearLicense: () =>
                set({ licenseCode: null, isValid: false }),
        }),
        {
            name: "license-storage",
        }
    )
);

export default useLicenseStore;

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import useLicenseStore from "@/store/licenseStore";

interface LicenseProviderProps {
    children: React.ReactNode;
}

export function LicenseProvider({ children }: LicenseProviderProps) {
    const [isValidating, setIsValidating] = useState(true);
    const { isValid, licenseCode, setLicense, clearLicense } = useLicenseStore();

    useEffect(() => {
        const validateLicense = async () => {
            // Check if validation is enabled
            const metaTag = document.querySelector('meta[name="check-valid-code"]');
            const checkValidCode = metaTag?.getAttribute('content') === 'true';

            if (!checkValidCode) {
                setLicense('disabled', true);
                return;
            }

            // // TTL cache check - uncomment to re-enable caching
            // if (!shouldRevalidate()) {
            //     return;
            // }

            setIsValidating(true);

            try {
                // Get license from URL or localStorage
                const urlParams = new URLSearchParams(window.location.search);
                const qParam = urlParams.get('q');
                const storedLicense = localStorage.getItem('v_license');

                // Fall back to Zustand persisted licenseCode if localStorage was wiped
                const licenseToCheck = qParam || storedLicense || licenseCode;

                if (!licenseToCheck || licenseToCheck.length <= 5) {
                    clearLicense();
                    return;
                }

                // Validate with API (X-Device-Id header added automatically by axios interceptor)
                const response = await axiosInstance.get('/get/s', {
                    headers: { 'X-License': licenseToCheck }
                });

                const isValidLicense = response.data === true || response.data?.success === true;

                if (isValidLicense) {
                    setLicense(licenseToCheck, true);
                    localStorage.setItem('v_license', licenseToCheck);
                } else {
                    clearLicense();
                }
            } catch (error) {
                console.error('License validation failed:', error);
                clearLicense();
            } finally {
                setIsValidating(false);
            }
        };

        validateLicense();
    }, [licenseCode, setLicense, clearLicense]);

    // Check if validation is enabled for UI rendering
    const metaTag = document.querySelector('meta[name="check-valid-code"]');
    const checkValidCode = metaTag?.getAttribute('content') === 'true';

    // Show blank page if validating or validation failed
    if (checkValidCode && (isValidating || !isValid)) {
        return <div className="min-h-screen bg-white"></div>;
    }

    // Render children if validation passed or is disabled
    return <>{children}</>;
}

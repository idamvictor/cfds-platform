import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface LicenseProviderProps {
    children: React.ReactNode;
}

export function LicenseProvider({ children }: LicenseProviderProps) {
    const [isValidating, setIsValidating] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validateLicense = async () => {
            // Read validation setting from meta tag
            const metaTag = document.querySelector('meta[name="check-valid-code"]');
            const checkValidCode = metaTag?.getAttribute('content') === 'true';

            // If validation is disabled, allow access
            if (!checkValidCode) {
                setIsValid(true);
                return;
            }

            // setIsValidating(true);

            try {
                // Check if license exists in localStorage
                const storedLicense = localStorage.getItem('v_license');
                if (storedLicense) {
                    setIsValid(true);
                    setIsValidating(false);
                    return;
                }

                // Get q parameter from URL
                const urlParams = new URLSearchParams(window.location.search);
                const qParam = urlParams.get('q');

                // Check if q parameter exists and has length > 5
                if (!qParam || qParam.length <= 5) {
                    setIsValid(false);
                    setIsValidating(false);
                    return;
                }

                // Make API request to validate license
                const response = await axiosInstance.get('/get/s', {
                    headers: {
                        'X-License': qParam
                    }
                });

                // Check if validation was successful
                if (response.data === true || response.data?.success === true) {
                    // Save license to localStorage
                    localStorage.setItem('v_license', qParam);
                    setIsValid(true);
                } else {
                    setIsValid(false);
                }
            } catch (error) {
                console.error('License validation failed:', error);
                setIsValid(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateLicense();
    }, []);

    // Read validation setting from meta tag for UI rendering
    const metaTag = document.querySelector('meta[name="check-valid-code"]');
    const checkValidCode = metaTag?.getAttribute('content') === 'true';

    // Show loading while validating
    if (checkValidCode && isValidating) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Validating license...</p>
                </div>
            </div>
        );
    }

    // Show blank page if validation failed
    if (checkValidCode && !isValid) {
        return <div className="min-h-screen bg-white"></div>;
    }

    // Render children if validation passed or is disabled
    return <>{children}</>;
}

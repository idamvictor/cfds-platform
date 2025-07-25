import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Extend Window interface to include Google Translate patch function
declare global {
  interface Window {
    patchReactDOMForTranslate?: () => void;
  }
}

/**
 * Component that ensures Google Translate patches are applied
 * after route changes and component mounts/updates
 */
export const TranslatePatches = () => {
  const location = useLocation();

  // Apply patches when route changes
  useEffect(() => {
    // Ensure the patch is applied after route changes
    const applyPatches = () => {
      if (window.patchReactDOMForTranslate) {
        console.log('Reapplying Google Translate patches after route change to:', location.pathname);
        window.patchReactDOMForTranslate();
      }
    };

    // Apply immediately
    applyPatches();

    // Also apply after a short delay to ensure components have mounted
    const timeoutId = setTimeout(() => {
      applyPatches();
    }, 500);

    // Apply again after potential async operations
    const longTimeoutId = setTimeout(() => {
      applyPatches();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(longTimeoutId);
    };
  }, [location.pathname]);

  // No UI to render
  return null;
};

export default TranslatePatches;

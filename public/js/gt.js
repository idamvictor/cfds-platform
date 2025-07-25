/**
 * Google Translate Integration
 * This file handles all the functionality related to the Google Translate integration.
 */

// Add a MutationObserver to handle Google Translate DOM modifications
// This helps prevent conflicts with React's virtual DOM
(function setupMutationObserver() {
    // Create a MutationObserver instance to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // If nodes are being removed, ensure they still exist in the DOM
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                // This is just for monitoring - the actual fix is in the try/catch blocks
                // in React's DOM operations
                if (window.gtDebug) {
                    console.log('Google Translate DOM modification detected', mutation);
                }
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Store the observer in window for potential cleanup
    window.gtObserver = observer;
})();

// Set up translation cookies before Google Translate fully loads
(function initTranslationCookies() {
    // Read saved language from localStorage
    var savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && savedLang !== 'en') {
        // Set a session cookie (will be overwritten by Google Translate later)
        document.cookie = "googtrans=/en/" + savedLang + "; path=/;";

        // Also set domain-specific cookie for broader compatibility
        var hostnameParts = window.location.hostname.split('.');
        if (hostnameParts.length > 1) {
            var domain = hostnameParts.slice(-2).join('.');
            document.cookie = "googtrans=/en/" + savedLang + "; path=/; domain=." + domain + ";";
        }

        // For localhost or development environments
        document.cookie = "googtrans=/en/" + savedLang + "; path=/; domain=" + window.location.hostname + ";";
    }
})();

/**
 * Callback for Google Translate to initialize the translation element
 */
function googleTranslateElementInit2() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false,
        includedLanguages: 'ar,de,en,es,fr,hi,it,ja,ko,pt,ru,zh-CN',
    }, 'google_translate_element2');
}

/**
 * Changes the current translation to the specified language pair
 * @param {string} lang_pair - Language pair in format "source|target" (e.g. "en|fr")
 */
function doGTranslate(lang_pair) {
    if (lang_pair.value) lang_pair = lang_pair.value;

    // Handle English case - reset all translations
    if (lang_pair == 'en|en') {
        // Clear translations and cookies for English
        var cookieName = 'googtrans';
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + document.domain + ";";

        // Clear from root domain if applicable
        var hostnameParts = window.location.hostname.split('.');
        if (hostnameParts.length > 1) {
            var domain = hostnameParts.slice(-2).join('.');
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + domain + ";";
        }

        localStorage.setItem('selectedLanguage', 'en');
        window.location.reload();
        return;
    }

    // Return if already in the target language
    if (GTranslateGetCurrentLang() == lang_pair.split('|')[1]) return;

    // Store the selection in localStorage
    const targetLang = lang_pair.split('|')[1];
    localStorage.setItem('selectedLanguage', targetLang);

    try {
        // Primary method: Use Google's select element
        var teCombo = document.querySelector('.goog-te-combo');
        if (teCombo) {
            teCombo.value = targetLang;
            if (document.createEvent) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, true);
                teCombo.dispatchEvent(event);
            } else {
                teCombo.fireEvent('onchange');
            }
        } else {
            // Fallback to direct cookie manipulation with multiple domain variations
            var now = new Date();
            var expTime = now.getTime() + 31536000000; // 1 year
            now.setTime(expTime);

            // Set path cookies
            document.cookie = "googtrans=/en/" + targetLang + "; expires=" + now.toGMTString() + "; path=/;";

            // Set domain specific cookies (important for cross-subdomain support)
            var hostnameParts = window.location.hostname.split('.');
            if (hostnameParts.length > 1) {
                var domain = hostnameParts.slice(-2).join('.');
                document.cookie = "googtrans=/en/" + targetLang + "; expires=" + now.toGMTString() + "; path=/; domain=." + domain + ";";
            }

            // For development on localhost
            document.cookie = "googtrans=/en/" + targetLang + "; expires=" + now.toGMTString() + "; path=/; domain=" + window.location.hostname + ";";

            // Reload to apply translation
            window.location.reload();
        }
    } catch (error) {
        console.error("Translation error:", error);
        // Last resort fallback
        document.cookie = "googtrans=/en/" + targetLang;
        window.location.reload();
    }
}

/**
 * Gets the current language from the googtrans cookie
 * @returns {string|null} The current target language or null if not set
 */
function GTranslateGetCurrentLang() {
    var keyValue = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
    return keyValue ? keyValue[2].split('/')[2] : null;
}

// Apply saved language on page load with a retry mechanism
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && savedLang !== 'en') {
        // First check if translation is already active
        const currentLang = GTranslateGetCurrentLang();

        // If not active or not matching saved preference, apply it
        if (currentLang !== savedLang) {
            // Wait for translation element to be fully initialized
            setTimeout(function() {
                doGTranslate('en|' + savedLang);

                // Double-check after a delay and retry if needed
                setTimeout(function() {
                    const checkLang = GTranslateGetCurrentLang();
                    if (checkLang !== savedLang) {
                        console.log("Translation retry needed");
                        doGTranslate('en|' + savedLang);
                    }
                }, 1500);
            }, 1000);
        }
    }
});

// Patch React's DOM operations to handle Google Translate modifications
(function patchReactDOM() {
    // This function will be called when the Google Translate script is loaded
    window.patchReactDOMForTranslate = function() {
        try {
            // Check if ReactDOM is available
            if (!window.ReactDOM) {
                console.warn('ReactDOM not found, cannot apply Google Translate patch');
                return;
            }

            // Different versions of React might have different internal structures
            const internals = window.ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
            if (!internals) {
                console.warn('React internals not found, cannot apply Google Translate patch');
                return;
            }

            // Find the Events object - it might be directly in internals or nested
            let Events = internals.Events;

            // If Events is not directly available, try to find it in other common locations
            if (!Events) {
                if (internals.HostConfig) {
                    Events = internals.HostConfig;
                } else if (internals.Renderer && internals.Renderer.hostConfig) {
                    Events = internals.Renderer.hostConfig;
                }
            }

            if (!Events) {
                console.warn('React DOM Events not found, cannot apply Google Translate patch');
                return;
            }

            // List of DOM operations to patch - these are the most common operations
            // that might be affected by Google Translate
            const operationsToWrap = [
                'removeChild',
                'insertBefore',
                'appendChild',
                'replaceChild',
                'insertInContainerBefore',
                'removeChildFromContainer',
                'appendChildToContainer',
                'clearContainer',
                'hideInstance',
                'unhideInstance',
                'commitMount',
                'commitUpdate'
            ];

            // Create a wrapper function that adds try/catch to any DOM operation
            const wrapDOMOperation = function(originalFn, operationName) {
                if (typeof originalFn !== 'function') {
                    return originalFn; // Not a function, can't wrap
                }

                return function() {
                    try {
                        return originalFn.apply(this, arguments);
                    } catch (error) {
                        // Handle specific DOM errors that might be caused by Google Translate
                        if (error && error.message && (
                            error.message.includes('The node to be removed is not a child of this node') ||
                            error.message.includes('Failed to execute') ||
                            error.message.includes('is not a child of') ||
                            error.message.includes('Unable to get property') ||
                            error.message.includes('Cannot read property') ||
                            error.message.includes('null') ||
                            error.message.includes('undefined') ||
                            error.message.includes('Cannot set property') ||
                            error.message.includes('Cannot assign to read only property')
                        )) {
                            console.warn(`Google Translate DOM conflict detected and handled in ${operationName}:`, error.message);
                            // Return a harmless value to prevent further errors
                            return null;
                        } else {
                            // For other errors, rethrow
                            throw error;
                        }
                    }
                };
            };

            // Patch each operation
            let patchedCount = 0;
            operationsToWrap.forEach(operation => {
                if (Events[operation] && typeof Events[operation] === 'function') {
                    const original = Events[operation];
                    Events[operation] = wrapDOMOperation(original, operation);
                    patchedCount++;
                }
            });

            if (patchedCount > 0) {
                console.log(`React DOM patched for Google Translate compatibility (enhanced version) - ${patchedCount} operations patched`);
            } else {
                console.warn('No React DOM operations were patched');
            }

            // Set a flag to indicate the patch was applied
            window.reactDOMPatched = true;
        } catch (error) {
            console.error('Error applying Google Translate patch:', error);
        }
    };

    // Try to patch immediately if ReactDOM is already available
    if (window.ReactDOM) {
        window.patchReactDOMForTranslate();
    }

    // Also patch when the DOM is fully loaded (backup)
    document.addEventListener('DOMContentLoaded', function() {
        if (window.patchReactDOMForTranslate) {
            window.patchReactDOMForTranslate();
        }
    });

    // Add a MutationObserver to detect when the Google Translate widget is added to the DOM
    // and reapply the patch
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.classList &&
                        (node.classList.contains('goog-te-menu-frame') ||
                         node.classList.contains('goog-te-banner-frame'))) {
                        // Google Translate widget detected, reapply patch
                        if (window.patchReactDOMForTranslate) {
                            console.log('Google Translate widget detected, reapplying patch');
                            window.patchReactDOMForTranslate();
                        }
                    }
                }
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });
})();

// Make functions globally available
window.doGTranslate = doGTranslate;
window.GTranslateGetCurrentLang = GTranslateGetCurrentLang;
window.googleTranslateElementInit2 = googleTranslateElementInit2;

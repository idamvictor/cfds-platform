/**
 * Google Translate Integration
 * This file handles all the functionality related to the Google Translate integration.
 */

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

// Make functions globally available
window.doGTranslate = doGTranslate;
window.GTranslateGetCurrentLang = GTranslateGetCurrentLang;
window.googleTranslateElementInit2 = googleTranslateElementInit2;

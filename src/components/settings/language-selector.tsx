import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function LanguageSelector() {
  // Get initial language from localStorage if available
  const [language, setLanguage] = React.useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });

  // Languages supported by Google Translate with their codes
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh-CN", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" }
  ];

  // Initialize component with correct language on mount
  React.useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    // Update the component state
    setLanguage(langCode);

    // Save to localStorage (for persistence)
    localStorage.setItem('selectedLanguage', langCode);

    console.log('langCode',langCode)
    try {

      // Skip translation if selecting English
      if (langCode === 'en') {
        // Create a cookie to remember the language preference
        document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname}`;
        window.location.reload();
        return;
      }

      // Set Google Translate cookie for the selected language
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;

      // Reload the page to apply the translation
      window.location.reload();

    } catch (e) {
      console.log('language error', e)
      // Silent error handling in production
    }
  };

  return (
      <RadioGroup
          value={language}
          onValueChange={changeLanguage}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
      >
        {languages.map((lang) => (
            <div key={lang.code} className="flex items-center space-x-2">
              <RadioGroupItem
                  value={lang.code}
                  id={`language-${lang.code}`}
                  className="border-primary/20"
              />
              <Label
                  htmlFor={`language-${lang.code}`}
                  className="flex items-center gap-1 cursor-pointer"
              >
                <span className="w-5">{lang.flag}</span>
                <span>{lang.name}</span>
              </Label>
            </div>
        ))}
      </RadioGroup>
  );
}

// Add this to the global Window interface
declare global {
  interface Window {
    doGTranslate?: (lang_pair: string) => void;
  }
}

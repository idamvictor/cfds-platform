
import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Language {
  code: string;
  name: string;
  flag: string;
}

export function LanguageSelector() {
  const [language, setLanguage] = React.useState("en");

  const languages: Language[] = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  ];

  return (
    <RadioGroup
      value={language}
      onValueChange={setLanguage}
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

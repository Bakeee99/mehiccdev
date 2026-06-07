/**
 * components/ui/LanguageProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * React Context that holds the current language and exposes:
 *   • lang      — current language ("bs" | "en")
 *   • t         — the translation object for the current language
 *   • toggleLang / setLang — change language
 *
 * Default language is Bosnian ("bs"). Language is persisted in localStorage
 * so the visitor's choice is remembered between visits.
 */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Language, type Translation } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Language;
  t: Translation;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // On mount, read saved language preference (if any)
  useEffect(() => {
    const saved = localStorage.getItem("mehiccdev-lang") as Language | null;
    if (saved === "bs" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    localStorage.setItem("mehiccdev-lang", next);
    document.documentElement.lang = next;
  };

  const toggleLang = () => setLang(lang === "bs" ? "en" : "bs");

  const value: LanguageContextValue = {
    lang,
    t: translations[lang] as Translation,
    setLang,
    toggleLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to consume the language context
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

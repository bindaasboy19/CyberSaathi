"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import { useAuth } from "./auth-provider";
import type { Language, LocalizedString } from "@/types";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  pick: (value: LocalizedString) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const ALLOWED_LANGUAGES: Language[] = ["en", "hi", "bn", "ta", "te", "mr"];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, updatePreferences } = useAuth();
  
  // Read initial language from local storage
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = window.localStorage.getItem("CyberSaathi-language") as Language | null;
      if (savedLanguage && ALLOWED_LANGUAGES.includes(savedLanguage)) {
        return savedLanguage;
      }
    }
    return "en";
  });

  // Sync from profile preferred language when it changes
  useEffect(() => {
    if (profile?.preferredLanguage && ALLOWED_LANGUAGES.includes(profile.preferredLanguage) && profile.preferredLanguage !== language) {
      setLanguageState(profile.preferredLanguage);
    }
  }, [profile?.preferredLanguage, language]);

  // Sync html tag lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("CyberSaathi-language", language);
  }, [language]);

  const changeLanguage = useCallback(async (newLang: Language) => {
    if (!ALLOWED_LANGUAGES.includes(newLang)) return;
    setLanguageState(newLang);
    if (profile) {
      try {
        await updatePreferences({ preferredLanguage: newLang });
      } catch (err) {
        console.error("Failed to sync language preference to Firestore:", err);
      }
    }
  }, [profile, updatePreferences]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (lang) => {
        void changeLanguage(lang);
      },
      toggleLanguage: () => {
        // Cycle to next language
        setLanguageState((current) => {
          const idx = ALLOWED_LANGUAGES.indexOf(current);
          const nextLang = ALLOWED_LANGUAGES[(idx + 1) % ALLOWED_LANGUAGES.length];
          if (profile) {
            void updatePreferences({ preferredLanguage: nextLang });
          }
          return nextLang;
        });
      },
      pick: (value) => value[language] ?? value.en,
    }),
    [language, profile, updatePreferences, changeLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}

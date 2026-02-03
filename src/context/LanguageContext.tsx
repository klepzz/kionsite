"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import tr from "../translations/tr.json";
import en from "../translations/en.json";

type Language = "tr" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = { tr, en };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        document.documentElement.lang = "en";
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        document.documentElement.lang = lang;
    };

    const t = (path: string) => {
        const keys = path.split(".");
        let result: Record<string, unknown> | string = translations[language];
        for (const key of keys) {
            if (typeof result === "object" && result !== null && key in result) {
                result = (result as Record<string, unknown>)[key] as Record<string, unknown> | string;
            } else {
                return path; // Fallback to path if key not found
            }
        }
        return result as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CURRENCIES } from './pricing-data';

type LanguageCode = 'en' | 'es' | 'pt';

interface GlobalContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    language: LanguageCode;
    setLanguage: (code: LanguageCode) => void;
    formatPrice: (amount: number) => string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>('USD');
    const [language, setLanguage] = useState<LanguageCode>('en');

    // Persist to localStorage (optional, for better UX)
    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency') as CurrencyCode;
        const savedLanguage = localStorage.getItem('language') as LanguageCode;
        if (savedCurrency && CURRENCIES[savedCurrency]) setCurrency(savedCurrency);
        if (savedLanguage) setLanguage(savedLanguage);
    }, []);

    useEffect(() => {
        localStorage.setItem('currency', currency);
        localStorage.setItem('language', language);
    }, [currency, language]);

    const formatPrice = (amount: number) => {
        const { locale, symbol } = CURRENCIES[currency];
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'COP' || currency === 'BRL' ? 0 : 2,
            maximumFractionDigits: currency === 'COP' || currency === 'BRL' ? 0 : 2,
        }).format(amount);
    };

    return (
        <GlobalContext.Provider value={{ currency, setCurrency, language, setLanguage, formatPrice }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}

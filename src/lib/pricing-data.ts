// export type CurrencyCode = 'USD' | 'EUR' | 'COP' | 'BRL' | 'MXN' | 'GBP';
export type CurrencyCode = 'USD' | 'EUR' | 'COP' | 'BRL' | 'MXN' | 'GBP';

export interface PricingData {
    [denomination: number]: {
        [currency in CurrencyCode]: number;
    };
}

export const CURRENCIES: { [key in CurrencyCode]: { symbol: string; name: string; locale: string } } = {
    USD: { symbol: '$', name: 'USD', locale: 'en-US' },
    EUR: { symbol: '€', name: 'EUR', locale: 'de-DE' },
    COP: { symbol: '$', name: 'COP', locale: 'es-CO' },
    BRL: { symbol: 'R$', name: 'BRL', locale: 'pt-BR' },
    MXN: { symbol: '$', name: 'MXN', locale: 'es-MX' },
    GBP: { symbol: '£', name: 'GBP', locale: 'en-GB' },
};

// Base prices in USD, converted to other currencies (approximate rates for demo)
export const PLAYSTATION_PRICING: PricingData = {
    5: {
        USD: 5.00,
        EUR: 4.50,
        COP: 20000,
        BRL: 25.00,
        MXN: 85.00,
        GBP: 4.00
    },
    10: {
        USD: 10.00,
        EUR: 9.00,
        COP: 40000,
        BRL: 50.00,
        MXN: 170.00,
        GBP: 8.00
    },
    25: {
        USD: 25.00,
        EUR: 23.00,
        COP: 100000,
        BRL: 125.00,
        MXN: 425.00,
        GBP: 20.00
    },
    50: {
        USD: 50.00,
        EUR: 46.00,
        COP: 200000,
        BRL: 250.00,
        MXN: 850.00,
        GBP: 40.00
    },
    75: {
        USD: 75.00,
        EUR: 69.00,
        COP: 300000,
        BRL: 375.00,
        MXN: 1275.00,
        GBP: 60.00
    },
    100: {
        USD: 100.00,
        EUR: 92.00,
        COP: 400000,
        BRL: 500.00,
        MXN: 1700.00,
        GBP: 80.00
    },
    150: {
        USD: 150.00,
        EUR: 138.00,
        COP: 600000,
        BRL: 750.00,
        MXN: 2550.00,
        GBP: 120.00
    },
    250: {
        USD: 250.00,
        EUR: 230.00,
        COP: 1000000,
        BRL: 1250.00,
        MXN: 4250.00,
        GBP: 200.00
    }
};

// Exchange rates relative to COP (1 Unit = X COP)
export const EXCHANGE_RATES: Record<string, number> = {
    USD: 3800,
    EUR: 4300,
    COP: 1,
    BRL: 800,
    MXN: 230,
    GBP: 5000,
    CAD: 2800, // Estimated
    SAR: 1000, // Estimated
    ARS: 4,    // Estimated
    CLP: 4.5,  // Estimated
    PEN: 1000, // Estimated
    COP_PSN: 4600 // Special rate for Colombia PSN cards
};

export const FIAT_CURRENCIES = ['CLP', 'PEN', 'COP'] as const;

export type FiatCurrency = typeof FIAT_CURRENCIES[number];

export type Portfolio = Record<string, number>;
export const FIAT_CURRENCIES = ['CLP', 'PEN', 'COP'] as const;

export type FiatCurrency = typeof FIAT_CURRENCIES[number];

export type Portfolio = Record<string, number>;

export interface OrderBook {
    asks: [string, string][];
    bids: [string, string][];
}

export interface OrderBookResponse {
    order_book: OrderBook;
}

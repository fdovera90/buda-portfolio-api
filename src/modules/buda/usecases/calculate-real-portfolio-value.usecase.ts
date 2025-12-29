import { BudaHttpService } from '@modules/buda/services/buda-http.service';
import { Portfolio } from '@modules/buda/types/buda.types';
import { Logger } from '@shared/logger/logger';
import { HttpError } from '@shared/http/error-handler';

export class CalculateRealPortfolioValueUseCase {
    constructor(
        private readonly budaHttpService: BudaHttpService
    ) { }

    async execute(portfolio: Portfolio, fiatCurrency: string): Promise<{ total: number; details: any[] }> {
        Logger.info('Calculating real portfolio value using order book depth', { portfolio, fiatCurrency });

        const results = [];
        let totalPortfolioValue = 0;

        for (const [symbol, amount] of Object.entries(portfolio)) {
            if (symbol === fiatCurrency) {
                totalPortfolioValue += amount;
                results.push({ symbol, amount, value: amount, note: 'Fiat currency' });
                continue;
            }

            const marketId = `${symbol}-${fiatCurrency}`.toLowerCase();
            let amountLeftToSell = amount;
            let symbolValue = 0;

            try {
                const orderBookResponse = await this.budaHttpService.getOrderBook(marketId);
                const bids = orderBookResponse.order_book.bids; // [price, amount]

                for (const [priceStr, amountStr] of bids) {
                    if (amountLeftToSell <= 0) break;

                    const price = parseFloat(priceStr);
                    const bidAmount = parseFloat(amountStr);

                    const amountToSell = Math.min(amountLeftToSell, bidAmount);

                    const value = amountToSell * price;

                    symbolValue += value;
                    amountLeftToSell -= amountToSell;
                }

                if (amountLeftToSell > 0) {
                    Logger.warn(`Insufficient market depth for ${symbol}`, { amountLeft: amountLeftToSell });
                    // Optionally handle this case (e.g., set incomplete flag)
                }

                totalPortfolioValue += symbolValue;
                results.push({ symbol, amount, real_value: symbolValue, depth_exhausted: amountLeftToSell > 0 });

            } catch (error) {
                Logger.error(`Error calculating value for ${symbol}`, { error });
                throw new HttpError(502, `Could not calculate value for ${symbol}`);
            }
        }

        return {
            total: totalPortfolioValue,
            details: results
        };
    }
}

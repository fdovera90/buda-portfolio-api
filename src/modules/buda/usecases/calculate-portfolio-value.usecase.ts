import { HttpError } from '@shared/http/error-handler';
import { BudaHttpService } from '@modules/buda/services/buda-http.service';
import { Portfolio } from '@modules/buda/types/buda.types';
import { Logger } from '@shared/logger/logger';

export class CalculatePortfolioValueUseCase {
    constructor(
        private readonly budaHttpService: BudaHttpService
    ) { }

    async execute(
        portfolio: Portfolio,
        fiatCurrency: string
    ): Promise<number> {
        Logger.info('Starting portfolio value calculation', {
            fiatCurrency,
            portfolio
        });

        const entries = Object.entries(portfolio);

        if (entries.length === 0) {
            Logger.warn('Portfolio is empty, returning 0');
            return 0;
        }

        const tickers = await Promise.all(
            entries.map(([symbol]) => {
                const marketId = `${symbol}-${fiatCurrency}`.toLowerCase();
                Logger.info('Fetching ticker from Buda API', { marketId });
                return this.budaHttpService.getTicker(marketId);
            })
        );

        const total = entries.reduce((acc, [symbol, amount], index) => {
            const { ticker } = tickers[index];

            if (!ticker?.last_price?.[0]) {
                Logger.error('Invalid ticker response', { symbol, fiatCurrency });
                throw new HttpError(
                    502,
                    'Invalid response from Buda API'
                );
            }

            const price = Number(ticker.last_price[0]);
            Logger.info('Price retrieved', { symbol, price, amount });

            return acc + amount * price;
        }, 0);

        Logger.info('Portfolio value calculated successfully', {
            fiatCurrency,
            total
        });

        return total;
    }
}

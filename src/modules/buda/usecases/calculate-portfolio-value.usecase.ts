import { HttpError } from '@shared/http/error-handler';
import { BudaHttpService } from '@modules/buda/services/buda-http.service';
import { Portfolio } from '@modules/buda/types/buda.types';

export class CalculatePortfolioValueUseCase {
    constructor(
        private readonly budaHttpService: BudaHttpService
    ) { }

    async execute(
        portfolio: Portfolio,
        fiatCurrency: string
    ): Promise<number> {
        const entries = Object.entries(portfolio);

        if (entries.length === 0) {
            return 0;
        }

        const tickers = await Promise.all(
            entries.map(([symbol]) => {
                const marketId = `${symbol}-${fiatCurrency}`.toLowerCase();
                return this.budaHttpService.getTicker(marketId);
            })
        );

        const total = entries.reduce((acc, [, amount], index) => {
            const { ticker } = tickers[index];

            if (!ticker?.last_price?.[0]) {
                throw new HttpError(
                    502,
                    'Invalid response from Buda API'
                );
            }

            const price = Number(ticker.last_price[0]);

            return acc + amount * price;
        }, 0);

        return total;
    }
}

import { NextFunction, Request, Response } from 'express';
import { CalculatePortfolioValueUseCase } from '@modules/buda/usecases/calculate-portfolio-value.usecase';
import { HttpError } from '@shared/http/error-handler';
import { FIAT_CURRENCIES, FiatCurrency } from '@modules/buda/types/buda.types';
import { Logger } from '@shared/logger/logger';

export class PortfolioController {
    constructor(
        private readonly calculatePortfolioValueUseCase: CalculatePortfolioValueUseCase
    ) { }

    calculateValue = async (req: Request, res: Response, next: NextFunction) => {
        Logger.info('Request received to calculate portfolio value', { body: req.body });

        try {
            const { portfolio, fiat_currency: fiatCurrency } = req.body;

            if (!portfolio || typeof portfolio !== 'object') {
                Logger.warn('Invalid portfolio payload', { portfolio });
                throw new HttpError(400, 'portfolio is required');
              }
        
            if (!fiatCurrency || typeof fiatCurrency !== 'string') {
                Logger.warn('Invalid fiatCurrency payload', { fiatCurrency });
                throw new HttpError(400, 'fiatCurrency is required');
            }

            if (!FIAT_CURRENCIES.includes(fiatCurrency.toUpperCase() as FiatCurrency)) {
                Logger.warn('Unsupported fiat currency', { fiatCurrency, allowed: FIAT_CURRENCIES });
                throw new HttpError(
                  400,
                  `fiat_currency must be one of: ${FIAT_CURRENCIES.join(', ')}`
                );
              }

            const total = await this.calculatePortfolioValueUseCase.execute(
                portfolio,
                fiatCurrency
            );

            Logger.info('Portfolio value', { fiatCurrency, total });

            res.status(200).json({
                fiat: fiatCurrency,
                total
            });

        } catch (error: any) {
            Logger.error('Error calculating portfolio value', { message: error.message, stack: error.stack });
            next(error);
        }
    };
}

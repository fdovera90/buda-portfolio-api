import { NextFunction, Request, Response } from 'express';
import { CalculatePortfolioValueUseCase } from '@modules/buda/usecases/calculate-portfolio-value.usecase';
import { HttpError } from '@shared/http/error-handler';
import { FIAT_CURRENCIES, FiatCurrency } from '@modules/buda/types/buda.types';

export class PortfolioController {
    constructor(
        private readonly calculatePortfolioValueUseCase: CalculatePortfolioValueUseCase
    ) { }

    calculateValue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { portfolio, fiat_currency: fiatCurrency } = req.body;

            if (!portfolio || typeof portfolio !== 'object') {
                throw new HttpError(400, 'portfolio is required');
              }
        
            if (!fiatCurrency || typeof fiatCurrency !== 'string') {
                throw new HttpError(400, 'fiatCurrency is required');
            }

            if (!FIAT_CURRENCIES.includes(fiatCurrency.toUpperCase() as FiatCurrency)) {
                throw new HttpError(
                  400,
                  `fiat_currency must be one of: ${FIAT_CURRENCIES.join(', ')}`
                );
              }

            const total = await this.calculatePortfolioValueUseCase.execute(
                portfolio,
                fiatCurrency
            );

            res.status(200).json({
                fiat: fiatCurrency,
                total
            });

        } catch (error) {
            next(error);
        }
    };
}

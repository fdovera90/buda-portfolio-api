import { NextFunction, Request, Response } from 'express';
import { CalculateRealPortfolioValueUseCase } from '@modules/buda/usecases/calculate-real-portfolio-value.usecase';
import { Logger } from '@shared/logger/logger';
import { HttpError } from '@shared/http/error-handler';

export class RealPortfolioController {
    constructor(
        private readonly calculateRealPortfolioValueUseCase: CalculateRealPortfolioValueUseCase
    ) { }

    calculateRealValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { portfolio, fiat_currency } = req.body;

            if (!portfolio || !fiat_currency) {
                throw new HttpError(400, 'Portfolio and fiat_currency are required');
            }

            const result = await this.calculateRealPortfolioValueUseCase.execute(portfolio, fiat_currency);

            res.status(200).json({
                fiat_currency,
                total_real_value: result.total,
                details: result.details
            });

        } catch (error: any) {
            Logger.error('Error calculating real portfolio value', { message: error.message });
            next(error);
        }
    };
}

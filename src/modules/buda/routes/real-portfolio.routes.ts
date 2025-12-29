import { Router } from 'express';
import { RealPortfolioController } from '@modules/buda/controllers/real-portfolio.controller';

export const realPortfolioRoutes = (
    controller: RealPortfolioController
): Router => {
    const router = Router();

    router.post('/portfolio/real-value', controller.calculateRealValue);

    return router;
};

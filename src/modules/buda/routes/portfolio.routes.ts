import { Router } from 'express';
import { PortfolioController } from '@modules/buda/controllers/portfolio.controller';

export const portfolioRoutes = (
  controller: PortfolioController
): Router => {
  const router = Router();

  router.post('/portfolio/value', controller.calculateValue);

  return router;
};

import { HttpService } from '@shared/http/http.service';
import { Router } from 'express';
import { BudaHttpService } from '@modules/buda/services/buda-http.service';
import { CalculatePortfolioValueUseCase } from '@modules/buda/usecases/calculate-portfolio-value.usecase';
import { PortfolioController } from '@modules/buda/controllers/portfolio.controller';
import { portfolioRoutes } from './portfolio.routes';
import { CalculateRealPortfolioValueUseCase } from '@modules/buda/usecases/calculate-real-portfolio-value.usecase';
import { RealPortfolioController } from '@modules/buda/controllers/real-portfolio.controller';
import { realPortfolioRoutes } from './real-portfolio.routes';

export const budaRoutes = (): Router => {
    const router = Router();

    const httpService = new HttpService();
    const budaHttpService = new BudaHttpService(httpService);
    const useCase = new CalculatePortfolioValueUseCase(budaHttpService);
    const controller = new PortfolioController(useCase);

    router.use(portfolioRoutes(controller));

    const calculateRealPortfolioValueUseCase = new CalculateRealPortfolioValueUseCase(budaHttpService);
    const realPortfolioController = new RealPortfolioController(calculateRealPortfolioValueUseCase);

    router.use(realPortfolioRoutes(realPortfolioController));

    return router;
};

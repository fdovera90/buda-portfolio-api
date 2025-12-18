import { HttpService } from '@shared/http/http.service';
import { Router } from 'express';
import { BudaHttpService } from '@modules/buda/services/buda-http.service';
import { CalculatePortfolioValueUseCase } from '@modules/buda/usecases/calculate-portfolio-value.usecase';
import { PortfolioController } from '@modules/buda/controllers/portfolio.controller';
import { portfolioRoutes } from './portfolio.routes';

export const budaRoutes = (): Router => {
    const router = Router();

    const httpService = new HttpService();
    const budaHttpService = new BudaHttpService(httpService);
    const useCase = new CalculatePortfolioValueUseCase(budaHttpService);
    const controller = new PortfolioController(useCase);
  
    router.use(portfolioRoutes(controller));
  
    return router;
};

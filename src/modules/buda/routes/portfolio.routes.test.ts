import { Router } from 'express';
import { portfolioRoutes } from './portfolio.routes';
import { PortfolioController } from '../controllers/portfolio.controller';

describe('portfolioRoutes', () => {
    let controller: PortfolioController;
    let router: Router;

    beforeEach(() => {
        controller = {
            calculateValue: jest.fn()
        } as any;

        router = portfolioRoutes(controller);
    });

    it('should return a Router instance', () => {
        expect(router).toBeInstanceOf(Router);
    });

    it('should register routes', () => {
        const routes = router.stack;
        expect(routes.length).toBeGreaterThan(0);
    });

    it('should accept a controller parameter', () => {
        const newController = {
            calculateValue: jest.fn()
        } as any;

        const newRouter = portfolioRoutes(newController);
        expect(newRouter).toBeInstanceOf(Router);
    });
});


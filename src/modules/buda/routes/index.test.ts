import { Router } from 'express';
import { budaRoutes } from './index';

describe('budaRoutes', () => {
    let router: Router;

    beforeEach(() => {
        router = budaRoutes();
    });

    it('should return a Router instance', () => {
        expect(router).toBeInstanceOf(Router);
    });

    it('should have routes registered', () => {
        const routes = router.stack;
        expect(routes.length).toBeGreaterThan(0);
    });
});


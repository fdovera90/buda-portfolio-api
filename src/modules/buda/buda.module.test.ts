import { Router } from 'express';
import { budaModule } from './buda.module';

describe('budaModule', () => {
    let router: Router;

    beforeEach(() => {
        router = budaModule();
    });

    it('should return a Router instance', () => {
        expect(router).toHaveProperty('stack');
        expect(typeof router.use).toBe('function');
    });

    it('should have routes registered', () => {
        const routes = router.stack;
        expect(routes.length).toBeGreaterThan(0);
    });
});


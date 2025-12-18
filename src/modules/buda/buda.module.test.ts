import { Router } from 'express';
import { budaModule } from './buda.module';

describe('budaModule', () => {
    let router: Router;

    beforeEach(() => {
        router = budaModule();
    });

    it('should return a Router instance', () => {
        expect(router).toBeInstanceOf(Router);
    });

    it('should have routes registered', () => {
        const routes = router.stack;
        expect(routes.length).toBeGreaterThan(0);
    });
});


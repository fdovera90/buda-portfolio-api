import { Router } from 'express';
import { HttpService } from '@shared/http/http.service';
import { BudaHttpService } from '@modules/buda/services/buda-http.service';
import { budaRoutes } from '@modules/buda/routes';

export const budaModule = (): Router => {
  const router = Router();

  const httpService = new HttpService();
  const budaHttpService = new BudaHttpService(httpService);

  router.use('/buda', budaRoutes());

  return router;
};

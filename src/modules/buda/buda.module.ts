import { Router } from 'express';
import { budaRoutes } from '@modules/buda/routes';

export const budaModule = (): Router => {
  const router = Router();

  router.use('/buda', budaRoutes());

  return router;
};

import express from 'express';
import { errorHandler } from '@shared/http/error-handler';
import { budaModule } from '@modules/buda/buda.module';

export const createApp = () => {
    const app = express();

    app.use(express.json());

    app.use(budaModule());

    app.use(errorHandler);

    return app;
};

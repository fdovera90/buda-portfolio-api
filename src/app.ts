import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { errorHandler } from '@shared/http/error-handler';
import { budaModule } from '@modules/buda/buda.module';

const swaggerDocument = YAML.load(path.join(process.cwd(), 'openapi.yaml'));

export const createApp = () => {
    const app = express();

    app.use(express.json());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(budaModule());

    app.use(errorHandler);

    return app;
};

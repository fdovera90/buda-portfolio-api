import express from 'express';
import { errorHandler } from '@shared/http/error-handler';

const app = express();

app.use(express.json());

// Endpoint de prueba para verificar que el server funciona
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;

import express from 'express';

const app = express();

app.use(express.json());

// Endpoint de prueba para verificar que el server funciona
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;

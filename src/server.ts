import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const isLocal = process.env.NODE_ENV !== 'production';

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (isLocal) {
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  } else {
    console.log(`Swagger UI available at /api-docs (use your Cloud Run URL)`);
  }
});
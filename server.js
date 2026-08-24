import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createEdgeStoreExpressHandler } from '@edgestore/server/adapters/express';
import { edgeStoreRouter } from './src/services/edgestoreRouter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// EdgeStore Cloud Bucket Handler
const edgeStoreHandler = createEdgeStoreExpressHandler({
  router: edgeStoreRouter,
});

app.get('/api/edgestore/*', edgeStoreHandler);
app.post('/api/edgestore/*', edgeStoreHandler);

// Backend Health & Info API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CivicBloom & FoundHub Backend',
    timestamp: new Date().toISOString(),
    services: {
      edgestore: Boolean(process.env.EDGE_STORE_ACCESS_KEY && process.env.EDGE_STORE_SECRET_KEY),
      firestore: Boolean(process.env.VITE_FIREBASE_PROJECT_ID),
    },
  });
});

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🌸 CivicBloom Node.js Backend Server running on http://localhost:${PORT}`);
});

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

// Check if static dist folder exists to serve SPA
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If dist is not yet built, provide a helpful dev page
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>CivicBloom & FoundHub Backend</title><meta charset="utf-8"/></head>
        <body style="font-family:system-ui;padding:40px;text-align:center;background:#0b0d13;color:#fff;">
          <h2>🌸 CivicBloom Backend API Server (Port ${PORT})</h2>
          <p style="color:#aaa;">Frontend Vite development server is running at: <a style="color:#6ee7b7;" href="http://localhost:3000">http://localhost:3000</a></p>
          <p><a style="color:#38bdf8;" href="/api/health">Check API Health (/api/health)</a></p>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, () => {
  console.log(`🌸 CivicBloom Backend Server running on http://localhost:${PORT}`);
});

export default app;

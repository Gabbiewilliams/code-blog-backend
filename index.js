// backend/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import connectDB from './src/db.js';

// Routers
import authRoutes from './src/routes/auth.routes.js';
import postsRoutes from './src/routes/posts.routes.js';
import commentsRoutes from './src/routes/comments.routes.js';
import favoritesRoutes from './src/routes/favorites.routes.js';

// Controllers / middleware
import { listComments, addComment } from './src/controllers/comments.controller.js';
import { requireAuth } from './src/middleware/auth.js';

dotenv.config();

const app = express();

// So secure cookies work behind App Engine's proxy
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

/**
 * CORS — only needed for local development now that prod will be same-origin.
 */
if (process.env.NODE_ENV !== 'production') {
  const devOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true); // same-origin or curl
        cb(null, devOrigins.includes(origin));
      },
      credentials: true,
    })
  );
}

// ---------- API routes ----------
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/posts/:id/comments', listComments);
app.post('/api/posts/:id/comments', requireAuth, addComment);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/favorites', favoritesRoutes);

// ---------- Serve React build (same host) ----------
const __dirname = path.resolve();

// Try CRA build first, fall back to Vite dist
let reactBuildDir = path.join(__dirname, '../frontend/build'); // CRA
if (!fs.existsSync(reactBuildDir)) {
  reactBuildDir = path.join(__dirname, '../frontend/dist');   // Vite
}

app.use(express.static(reactBuildDir));

// SPA fallback for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'not found' });
  }
  res.sendFile(path.join(reactBuildDir, 'index.html'));
});

// ---------- Start server + connect DB ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`[server] listening on ${PORT}`);
  } catch (err) {
    console.error('[db] initial connect error:', err.message);
  }
});

export default app;


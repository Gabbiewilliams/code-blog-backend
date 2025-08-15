import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

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

/**
 * CORS — allow local dev + the deployed frontend service.
 * Keep using credentials so cookies flow cross-subdomain.
 */
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:3000',
  process.env.WEB_ORIGIN || 'https://web-dot-code-blog-12345.uw.r.appspot.com',
];

app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin / server-to-server (no Origin header)
      if (!origin) return cb(null, true);
      cb(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health endpoint must always work
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Comments list/add nested under a post
app.get('/api/posts/:id/comments', listComments);
app.post('/api/posts/:id/comments', requireAuth, addComment);

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/favorites', favoritesRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: 'not found' }));

// ---- Connect to Mongo WITHOUT blocking startup
(async () => {
  try {
    await connectDB();
    console.log('[db] connected');
  } catch (err) {
    console.error('[db] initial connect error:', err.message);
    // App still starts so /api/health works and logs are visible.
  }
})();

export default app;

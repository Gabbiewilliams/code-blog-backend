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

// trust proxy so "secure" cookies work on App Engine
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

/** CORS: allow your deployed frontend + local dev */
const allowed = new Set([
  'https://web-dot-code-blog-12345.uw.r.appspot.com',
  'http://localhost:3000',
  'http://localhost:5173'
]);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);            // server-to-server, curl, healthchecks
    cb(null, allowed.has(origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// ---- API routes (under /api) ----
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/posts/:id/comments', listComments);
app.post('/api/posts/:id/comments', requireAuth, addComment);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/favorites', favoritesRoutes);

// 404 for anything else
app.use((_req, res) => res.status(404).json({ error: 'not found' }));

// ---- Start + DB ----
const PORT = process.env.PORT || 8080;   // App Engine sets PORT
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`[api] listening on ${PORT}`);
  } catch (e) {
    console.error('[db] initial connect error:', e.message);
  }
});

export default app;

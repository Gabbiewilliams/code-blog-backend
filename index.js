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


import { listComments, addComment } from './src/controllers/comments.controller.js';
import { requireAuth } from './src/middleware/auth.js';


dotenv.config();
await connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Comments list/add nested under a post
app.get('/api/posts/:id/comments', listComments);
app.post('/api/posts/:id/comments', requireAuth, addComment);

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);   // DELETE /api/comments/:id
app.use('/api/favorites', favoritesRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: 'not found' }));

export default app;


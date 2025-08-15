import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favorites.controller.js';

const router = express.Router();

// GET /api/favorites  -> list my favorites
router.get('/', requireAuth, getFavorites);

// POST /api/favorites/:postId   -> add a favorite
router.post('/:postId', requireAuth, addFavorite);

// DELETE /api/favorites/:postId -> remove a favorite
router.delete('/:postId', requireAuth, removeFavorite);

export default router;


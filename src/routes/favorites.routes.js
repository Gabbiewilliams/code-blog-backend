import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favorites.controller.js';

const r = Router();

r.get('/', requireAuth, getFavorites);
r.post('/:postId', requireAuth, addFavorite);
r.delete('/:postId', requireAuth, removeFavorite);

export default r;

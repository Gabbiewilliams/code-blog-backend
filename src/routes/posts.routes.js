import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Post from '../models/Post.js';
import {
  listAll,
  listMine,
  createPost,
  getOne,
} from '../controllers/posts.controller.js';

const router = Router();

/** PUBLIC: list all posts (latest first) */
router.get('/', listAll);

/** PUBLIC: total number of posts */
router.get('/count', async (_req, res) => {
  const n = await Post.countDocuments();
  res.json({ count: n });
});

/** AUTH’D: current user’s posts */
router.get('/mine', requireAuth, listMine);

/** AUTH’D: create post */
router.post('/', requireAuth, createPost);

/**
 * PUBLIC: single post by id
 * NOTE: keep this LAST so it doesn't swallow /count or /mine
 */
router.get('/:id', getOne);

export default router;

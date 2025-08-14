import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/posts.controller.js';

const r = Router();

r.get('/', listPosts);
r.get('/:id', getPost);
r.post('/', requireAuth, createPost);
r.put('/:id', requireAuth, updatePost);
r.delete('/:id', requireAuth, deletePost);

export default r;

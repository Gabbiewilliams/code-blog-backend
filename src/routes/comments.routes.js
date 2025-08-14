import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { deleteComment } from '../controllers/comments.controller.js';

const r = Router();

// DELETE /api/comments/:id  (delete own comment)
r.delete('/:id', requireAuth, deleteComment);

export default r;

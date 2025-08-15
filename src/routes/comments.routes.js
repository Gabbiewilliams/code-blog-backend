// backend/src/routes/comments.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  deleteComment, // if you have it
} from '../controllers/comments.controller.js';

const router = express.Router();

// example: DELETE /api/comments/:id
router.delete('/:id', requireAuth, deleteComment);

export default router;


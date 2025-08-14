import { Router } from 'express';
import { googleLogin, logout, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

r.post('/google', googleLogin);
r.post('/logout', logout);
r.get('/me', requireAuth, me);

export default r;

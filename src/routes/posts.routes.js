import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Post from '../models/Post.js';

const router = Router();

/** PUBLIC: list all posts (latest first) */
router.get('/', async (_req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .select('title tags createdAt author') // lightweight list
    .populate('author', 'name');           // show author name
  res.json(posts);
});

/** PUBLIC: total number of posts */
router.get('/count', async (_req, res) => {
  const n = await Post.countDocuments();
  res.json({ count: n });
});

/** AUTH’D: current user’s posts */
router.get('/mine', requireAuth, async (req, res) => {
  const mine = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .select('title tags createdAt');
  res.json(mine);
});

/** AUTH’D: create post */
router.post('/', requireAuth, async (req, res) => {
  const { title, body, tags } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }
  const post = await Post.create({
    title,
    body,
    tags: (tags || []).map(t => t.trim()).filter(Boolean),
    author: req.user._id,
  });
  res.status(201).json(post);
});

export default router;




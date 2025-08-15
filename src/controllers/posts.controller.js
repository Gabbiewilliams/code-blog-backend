// backend/src/controllers/posts.controller.js
import Post from '../models/Post.js';

/** POST /api/posts  { title, body, tags?: string[] } */
export async function createPost(req, res) {
  try {
    const { title, body, tags = [] } = req.body || {};
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json('Title and body are required');
    }
    const post = await Post.create({
      title: title.trim(),
      body,
      tags,
      author: req.user._id, // set by requireAuth
    });
    res.status(201).json(post);
  } catch (err) {
    console.error('[posts] createPost error:', err);
    res.status(500).json('Server error');
  }
}

/** GET /api/posts/mine  (requires auth) */
export async function listMine(req, res) {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .select('_id title tags createdAt');
    res.json(posts);
  } catch (err) {
    console.error('[posts] listMine error:', err);
    res.status(500).json('Server error');
  }
}

/** GET /api/posts  (public) */
export async function listAll(_req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .select('_id title tags author createdAt') // list view (no body here)
      .populate('author', '_id name');
    res.json(posts);
  } catch (err) {
    console.error('[posts] listAll error:', err);
    res.status(500).json('Server error');
  }
}

/** GET /api/posts/:id  (public) – include body */
export async function getOne(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .select('_id title body tags author createdAt') // <- body included
      .populate('author', '_id name');
    if (!post) return res.status(404).json({ error: 'not found' });
    res.json(post);
  } catch (err) {
    console.error('[posts] getOne error:', err);
    res.status(404).json({ error: 'not found' });
  }
}

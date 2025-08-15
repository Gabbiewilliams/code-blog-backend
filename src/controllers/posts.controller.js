import Post from '../models/Post.js';

/**
 * POST /api/posts
 * body: { title: string, body: string, tags?: string[] }
 */
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

/**
 * GET /api/posts/mine
 */
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

/**
 * GET /api/posts
 */
export async function listAll(_req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .select('_id title tags author createdAt')
      .populate('author', '_id name');
    res.json(posts);
  } catch (err) {
    console.error('[posts] listAll error:', err);
    res.status(500).json('Server error');
  }
}

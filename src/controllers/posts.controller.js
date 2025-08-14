import Post from '../models/Post.js';

export async function listPosts(req, res) {
  const { q, tag } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (tag) filter.tags = tag;
  const posts = await Post.find(filter).sort({ createdAt: -1 });
  res.json(posts);
}

export async function getPost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
}

export async function createPost(req, res) {
  const { title, contentMd, tags = [] } = req.body || {};
  const post = await Post.create({
    title, contentMd, tags,
    author: { _id: req.user._id, name: req.user.name }
  });
  res.status(201).json(post);
}

export async function updatePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (String(post.author._id) !== req.user._id) return res.status(403).json({ error: 'Not owner' });
  const { title, contentMd, tags } = req.body || {};
  if (title) post.title = title;
  if (contentMd) post.contentMd = contentMd;
  if (tags) post.tags = tags;
  await post.save();
  res.json(post);
}

export async function deletePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (String(post.author._id) !== req.user._id) return res.status(403).json({ error: 'Not owner' });
  await post.deleteOne();
  res.status(204).end();
}

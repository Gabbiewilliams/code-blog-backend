import Comment from '../models/Comment.js';

export async function listComments(req, res) {
  const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
  res.json(comments);
}

export async function addComment(req, res) {
  const c = await Comment.create({
    postId: req.params.id,
    userId: req.user._id,
    userName: req.user.name,
    text: req.body.text
  });
  res.status(201).json(c);
}

export async function deleteComment(req, res) {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  if (String(c.userId) !== req.user._id) return res.status(403).json({ error: 'Not owner' });
  await c.deleteOne();
  res.status(204).end();
}

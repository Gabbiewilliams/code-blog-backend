import User from '../models/User.js';

export async function getFavorites(req, res) {
  const u = await User.findById(req.user._id).populate('favorites');
  res.json(u?.favorites ?? []);
}

export async function addFavorite(req, res) {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: req.params.postId } });
  res.status(204).end();
}

export async function removeFavorite(req, res) {
  await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.params.postId } });
  res.status(204).end();
}

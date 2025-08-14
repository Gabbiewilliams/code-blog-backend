import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.cookies?.shortstack_jwt;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { _id, name }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

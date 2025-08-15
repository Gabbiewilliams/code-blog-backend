// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  
  console.log('[auth] raw Cookie header:', req.headers.cookie || '(none)');

  
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload._id, name: payload.name, email: payload.email };
    return next();
  } catch (e) {
    console.error('[auth] JWT verify failed:', e.message);
    return res.status(401).json({ error: 'Not authenticated' });
  }
}

import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    //  debug logs:
    console.log('[auth] cookies:', req.cookies);
    console.log('[auth] auth header:', req.get('authorization'));

    const auth = req.get('authorization') || '';
    const bearer = auth.toLowerCase().startsWith('bearer ')
      ? auth.slice(7)
      : null;

    // change token name
    const token = req.cookies?.token || bearer;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload._id, name: payload.name };
    next();
  } catch (err) {
    console.error('[auth] verify error:', err.message);
    return res.status(401).json({ error: 'Not authenticated' });
  }
}

// backend/src/controllers/auth.controller.js
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: 'Missing Google credential' });

    // Check token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, name, email, picture } = ticket.getPayload();

    
    const user = await User.findOneAndUpdate(
      { googleId },
      { googleId, name, email, picture },
      { new: true, upsert: true }
    );

    // Issue our session JWT
    const token = jwt.sign(
      { _id: user._id.toString(), name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Same-origin cookie (works once dispatch.yaml routes /api to backend)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,     // HTTPS on App Engine
      sameSite: 'lax',  // same-origin is fine
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (e) {
    console.error('[auth] googleLogin error:', e.message);
    return res.status(401).json({ error: 'Auth failed' });
  }
}

export function logout(_req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });
  return res.status(204).end();
}

export async function me(req, res) {
  if (!req.user?._id) return res.status(401).json({ error: 'No session' });
  const user = await User.findById(req.user._id).select('_id name email picture');
  return res.json(user);
}

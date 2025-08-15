import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body || {};
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

    const token = jwt.sign(
      { _id: user._id.toString(), name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Cross-subdomain cookie for App Engine subdomains
    const isProd = process.env.NODE_ENV === 'production';
    const cookieDomain =
      isProd
        ? (process.env.COOKIE_DOMAIN || '.code-blog-12345.uw.r.appspot.com')
        : undefined;

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,                 // required on HTTPS
      sameSite: isProd ? 'none' : 'lax',
      domain: cookieDomain,           // leading dot enables subdomains
      path: '/',
      maxAge: 7 * 24 * 3600 * 1000,   // 7 days
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token,
    });
  } catch (e) {
    console.error('[auth] googleLogin error:', e.message);
    res.status(401).json({ error: 'Auth failed' });
  }
}

export function logout(_req, res) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieDomain =
    isProd
      ? (process.env.COOKIE_DOMAIN || '.code-blog-12345.uw.r.appspot.com')
      : undefined;

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    domain: cookieDomain,
    path: '/',
  });
  res.status(204).end();
}

export async function me(req, res) {
  const user = await User.findById(req.user._id).select('_id name email picture');
  res.json(user);
}

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

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,           // set true when on HTTPS in prod
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({ _id: user._id, name: user.name, email: user.email, picture: user.picture, token });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Auth failed' });
  }
}

export function logout(_req, res) {
  res.clearCookie('shortstack_jwt');
  res.status(204).end();
}

export async function me(req, res) {
  const user = await User.findById(req.user._id).select('_id name email picture');
  res.json(user);
}

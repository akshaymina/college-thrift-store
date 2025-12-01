import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const COOKIE_NAME = 'token';

function setTokenCookie (res, token) {
  const secure = String(process.env.COOKIE_SECURE) === 'true';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: 1000 * 60 * 60 * 24
  });
}

export async function signup (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const passHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passHash });

  const token = signToken({ id: user._id, role: user.role });
  setTokenCookie(res, token);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
}

export async function login (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user._id, role: user.role });
  setTokenCookie(res, token);

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
}

export async function me (req, res) {
  res.json({ user: req.user });
}

export async function logout (req, res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
}

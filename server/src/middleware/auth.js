import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export async function requireAuth (req, res, next) {
  try {
    const auth = req.headers.authorization;
    let token = auth?.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    if (!token && req.cookies?.token) token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-passHash');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin (req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}

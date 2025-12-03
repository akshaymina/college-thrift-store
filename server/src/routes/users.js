import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = Router();

// GET /api/users/me
router.get('/me', requireAuth, async (req, res) => {
  const u = await User.findById(req.user._id).select('-passHash').lean();
  res.json({ user: u });
});

// PATCH /api/users/me (multipart: avatar)
router.patch('/me', requireAuth, uploadAvatar.single('avatar'), async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.body.name) user.name = String(req.body.name).trim();
  if (req.file) {
    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
  }

  await user.save();
  const out = await User.findById(user._id).select('-passHash').lean();
  res.json({ user: out });
});

// PATCH /api/users/me/password
router.patch('/me/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'currentPassword and newPassword required' });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const ok = await bcrypt.compare(currentPassword, user.passHash);
  if (!ok) return res.status(401).json({ message: 'Current password incorrect' });
  const hash = await bcrypt.hash(newPassword, 10);
  user.passHash = hash;
  await user.save();
  res.json({ message: 'Password updated' });
});

export default router;

import User from '../models/User.js';
import Item from '../models/Item.js';
import AuditLog from '../models/AuditLog.js';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

// Helper to log admin actions
async function logAction(admin, action, targetType, targetId, targetDetails, reason = '') {
  try {
    await AuditLog.create({
      admin: admin._id,
      action,
      targetType,
      targetId,
      targetDetails,
      reason
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

// Helper to delete image files
function deleteImageFiles(images = []) {
  images.forEach(img => {
    const file = path.join(UPLOAD_DIR, path.basename(img));
    fs.unlink(file, (err) => {
      if (err) console.warn(`Could not delete image ${img}:`, err.message);
    });
  });
}

export async function listUsers(req, res) {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(pageSize);
  const limit = Math.max(1, Math.min(100, parseInt(pageSize)));

  // Query for active users: either deleted is false or deleted field doesn't exist
  const query = { $or: [{ deleted: false }, { deleted: { $exists: false } }] };
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({
    users,
    pagination: { page: parseInt(page), pageSize: limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const { reason = '' } = req.body || {};
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.deleted) return res.status(410).json({ message: 'User already deleted' });

  const targetDetails = { name: user.name, email: user.email, role: user.role };
  user.deleted = true;
  user.deletedAt = new Date();
  user.deletedBy = req.user._id;
  user.deletionReason = reason;
  await user.save();

  await logAction(req.user, 'delete-user', 'user', user._id, targetDetails, reason);
  res.json({ message: 'User soft-deleted', user: { _id: user._id, name: user.name } });
}

export async function restoreUser(req, res) {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.deleted) return res.status(400).json({ message: 'User is not deleted' });

  const targetDetails = { name: user.name, email: user.email };
  user.deleted = false;
  user.deletedAt = null;
  user.deletedBy = null;
  user.deletionReason = null;
  await user.save();

  await logAction(req.user, 'restore-user', 'user', user._id, targetDetails);
  res.json({ message: 'User restored', user: { _id: user._id, name: user.name } });
}

export async function listDeletedUsers(req, res) {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(pageSize);
  const limit = Math.max(1, Math.min(100, parseInt(pageSize)));

  const query = { deleted: true };
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('name email role deletedAt deletionReason')
    .sort({ deletedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({
    users,
    pagination: { page: parseInt(page), pageSize: limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function listItems(req, res) {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(pageSize);
  const limit = Math.max(1, Math.min(100, parseInt(pageSize)));

  // Query for active items: either deleted is false or deleted field doesn't exist
  const query = { $or: [{ deleted: false }, { deleted: { $exists: false } }] };
  const total = await Item.countDocuments(query);
  const items = await Item.find(query)
    .select('title sellerId status createdAt')
    .populate('sellerId', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const mapped = items.map(i => ({
    id: i._id,
    title: i.title,
    status: i.status,
    seller: i.sellerId ? { id: i.sellerId._id, name: i.sellerId.name } : null,
    createdAt: i.createdAt
  }));

  res.json({
    items: mapped,
    pagination: { page: parseInt(page), pageSize: limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function deleteItem(req, res) {
  const { id } = req.params;
  const { reason = '' } = req.body || {};
  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.deleted) return res.status(410).json({ message: 'Item already deleted' });

  const targetDetails = { title: item.title, price: item.price, seller: item.sellerId };
  item.deleted = true;
  item.deletedAt = new Date();
  item.deletedBy = req.user._id;
  item.deletionReason = reason;
  await item.save();

  // Clean up images asynchronously
  if (item.images && item.images.length > 0) {
    deleteImageFiles(item.images);
  }

  await logAction(req.user, 'delete-item', 'item', item._id, targetDetails, reason);
  res.json({ message: 'Item soft-deleted', item: { _id: item._id, title: item.title } });
}

export async function restoreItem(req, res) {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (!item.deleted) return res.status(400).json({ message: 'Item is not deleted' });

  const targetDetails = { title: item.title };
  item.deleted = false;
  item.deletedAt = null;
  item.deletedBy = null;
  item.deletionReason = null;
  await item.save();

  await logAction(req.user, 'restore-item', 'item', item._id, targetDetails);
  res.json({ message: 'Item restored', item: { _id: item._id, title: item.title } });
}

export async function listDeletedItems(req, res) {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(pageSize);
  const limit = Math.max(1, Math.min(100, parseInt(pageSize)));

  const query = { deleted: true };
  const total = await Item.countDocuments(query);
  const items = await Item.find(query)
    .select('title sellerId status deletedAt deletionReason')
    .populate('sellerId', 'name')
    .sort({ deletedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const mapped = items.map(i => ({
    id: i._id,
    title: i.title,
    status: i.status,
    seller: i.sellerId ? { id: i.sellerId._id, name: i.sellerId.name } : null,
    deletedAt: i.deletedAt,
    deletionReason: i.deletionReason
  }));

  res.json({
    items: mapped,
    pagination: { page: parseInt(page), pageSize: limit, total, pages: Math.ceil(total / limit) }
  });
}

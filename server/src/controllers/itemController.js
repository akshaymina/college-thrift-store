import { validationResult } from 'express-validator';
import Item from '../models/Item.js';

function buildQuery (params) {
  const { search, category, status, campus, seller, minPrice, maxPrice } = params;
  const q = {};
  if (category) q.category = category;
  if (status) q.status = status;
  if (campus) q.campus = campus;
  if (seller) q.sellerId = seller;
  if (minPrice || maxPrice) q.price = {
    ...(minPrice ? { $gte: Number(minPrice) } : {}),
    ...(maxPrice ? { $lte: Number(maxPrice) } : {})
  };
  if (search) {
    const rx = new RegExp(search, 'i');
    q.$or = [{ title: rx }, { description: rx }];
  }
  return q;
}


// GET /api/items
export async function listItems (req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const q = buildQuery(req.query || {});

  const [total, items] = await Promise.all([
    Item.countDocuments(q),
    Item.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  res.json({ items, page, limit, total, totalPages });
}


// GET /api/items/:id
export async function getItem (req, res) {
  const item = await Item.findById(req.params.id)
    .populate('sellerId', 'name email avatarUrl')
    .lean();
  if (!item) return res.status(404).json({ message: 'Item not found' });

  // Attach seller alias for frontend convenience
  const seller = item.sellerId ? { id: item.sellerId._id, name: item.sellerId.name, email: item.sellerId.email, avatarUrl: item.sellerId.avatarUrl } : null;
  res.json({ ...item, seller });
}


// POST /api/items
export async function createItem (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


  const { title, description = '', price, category, condition = 'good', campus = 'Main' } = req.body;
  
  const files = (req.files || []).map(f => `/uploads/${f.filename}`);
  const item = await Item.create({ title, description, price, category, condition, campus, images: files, sellerId: req.user._id });
  res.status(201).json(item);
}


// PATCH /api/items/:id
export async function updateItem (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (String(item.sellerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }


  const allowed = ['title', 'description', 'price', 'category', 'condition', 'campus'];
  for (const k of allowed) if (k in req.body) item[k] = req.body[k];

 
  // images handling
  const newFiles = (req.files || []).map(f => `/uploads/${f.filename}`);
  const replace = String(req.body.replaceImages || 'false') === 'true';
  const toRemove = Array.isArray(req.body.remove) ? req.body.remove : [];
 
  if (replace) {
  item.images = newFiles;
  } else {
  // remove any listed paths, then append new files
  if (toRemove.length) item.images = item.images.filter(p => !toRemove.includes(p));
  if (newFiles.length) item.images.push(...newFiles);
  }
  
  await item.save();
  res.json(item);
}


// PATCH /api/items/:id/status
export async function updateStatus (req, res) {
  const { status } = req.body; // 'available'|'reserved'|'sold'
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (String(item.sellerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (!['available', 'reserved', 'sold'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  item.status = status;
  await item.save();
  res.json(item);
}


// DELETE /api/items/:id
export async function deleteItem (req, res) {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (String(item.sellerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await item.deleteOne();
  res.json({ message: 'Deleted' });
}

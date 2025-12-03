import Wishlist from '../models/Wishlist.js';
import Item from '../models/Item.js';

export async function addToWishlist(req, res) {
  const { itemId } = req.body || {};
  if (!itemId) return res.status(400).json({ message: 'itemId required' });

  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  try {
    const wish = await Wishlist.create({ userId: req.user._id, itemId });
    res.status(201).json({ message: 'Added to wishlist', wishlist: wish });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }
    throw err;
  }
}

export async function removeFromWishlist(req, res) {
  const { itemId } = req.params;
  const result = await Wishlist.deleteOne({ userId: req.user._id, itemId });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Not in wishlist' });
  }
  res.json({ message: 'Removed from wishlist' });
}

export async function getWishlist(req, res) {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(pageSize);
  const limit = Math.max(1, Math.min(100, parseInt(pageSize)));

  const total = await Wishlist.countDocuments({ userId: req.user._id });
  const wishes = await Wishlist.find({ userId: req.user._id })
    .populate({
      path: 'itemId',
      select: 'title price category condition campus images sellerId',
      populate: { path: 'sellerId', select: 'name avatarUrl' }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const mapped = wishes.map(w => ({
    id: w._id,
    item: {
      _id: w.itemId._id,
      title: w.itemId.title,
      price: w.itemId.price,
      category: w.itemId.category,
      condition: w.itemId.condition,
      campus: w.itemId.campus,
      images: w.itemId.images,
      seller: w.itemId.sellerId
    },
    addedAt: w.createdAt
  }));

  res.json({
    wishlist: mapped,
    pagination: { page: parseInt(page), pageSize: limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function checkWishlist(req, res) {
  const { itemId } = req.params;
  const wish = await Wishlist.findOne({ userId: req.user._id, itemId });
  res.json({ inWishlist: !!wish });
}

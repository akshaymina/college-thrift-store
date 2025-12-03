import ViewHistory from '../models/ViewHistory.js';
import Item from '../models/Item.js';

export async function trackView(req, res) {
  const { itemId } = req.body || {};
  if (!itemId) return res.status(400).json({ message: 'itemId required' });

  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  try {
    // For logged-in users, track view; for guests, just count incrementally
    const filter = req.user ? { userId: req.user._id, itemId } : { userId: null, itemId };
    const view = await ViewHistory.findOneAndUpdate(
      filter,
      { $inc: { viewCount: 1 } },
      { upsert: true, new: true, lean: true }
    );
    res.json({ message: 'View tracked', view });
  } catch (err) {
    console.error('View tracking error:', err);
    res.status(500).json({ message: 'Failed to track view' });
  }
}

export async function getViewHistory(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Login required' });

  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(pageSize);
  const limit = Math.max(1, Math.min(100, parseInt(pageSize)));

  const total = await ViewHistory.countDocuments({ userId: req.user._id });
  const views = await ViewHistory.find({ userId: req.user._id })
    .populate({
      path: 'itemId',
      select: 'title price category condition campus images sellerId',
      populate: { path: 'sellerId', select: 'name avatarUrl' }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const mapped = views.map(v => ({
    id: v._id,
    item: {
      _id: v.itemId._id,
      title: v.itemId.title,
      price: v.itemId.price,
      category: v.itemId.category,
      condition: v.itemId.condition,
      campus: v.itemId.campus,
      images: v.itemId.images,
      seller: v.itemId.sellerId
    },
    viewCount: v.viewCount,
    lastViewed: v.createdAt
  }));

  res.json({
    history: mapped,
    pagination: { page: parseInt(page), pageSize: limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function getTrendingItems(req, res) {
  const { limit = 10 } = req.query;
  const maxLimit = Math.min(parseInt(limit), 50);

  // Get most viewed items in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const trending = await ViewHistory.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: '$itemId', totalViews: { $sum: '$viewCount' } } },
    { $sort: { totalViews: -1 } },
    { $limit: maxLimit },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'itemData'
      }
    },
    { $unwind: '$itemData' },
    { $match: { 'itemData.deleted': { $in: [false, null] } } }
  ]);

  const items = trending.map(t => ({
    _id: t.itemData._id,
    title: t.itemData.title,
    price: t.itemData.price,
    category: t.itemData.category,
    condition: t.itemData.condition,
    campus: t.itemData.campus,
    images: t.itemData.images,
    sellerId: t.itemData.sellerId,
    totalViews: t.totalViews
  }));

  res.json({ items });
}

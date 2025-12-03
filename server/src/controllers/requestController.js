import { validationResult } from 'express-validator';
import BuyRequest from '../models/BuyRequest.js';
import Item from '../models/Item.js';

// POST /api/items/:id/requests
export async function createRequest (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

	const itemId = req.params.id;

	const item = await Item.findById(itemId);
	if (!item) return res.status(404).json({ message: 'Item not found' });
	if (String(item.sellerId) === String(req.user._id)) {
		return res.status(400).json({ message: 'You cannot request your own item' });
	}
	if (item.status === 'sold') return res.status(400).json({ message: 'Item already sold' });

	// Prevent new requests if one is already accepted for this item
	const accepted = await BuyRequest.findOne({ itemId, status: 'accepted' });
	if (accepted) return res.status(400).json({ message: 'Item already reserved' });

	// Ensure a single request per buyer per item (model has unique index, but surface a friendlier error)
	const exists = await BuyRequest.findOne({ itemId, buyerId: req.user._id });
	if (exists) return res.status(400).json({ message: 'You have already requested this item' });

	const reqDoc = await BuyRequest.create({ itemId, buyerId: req.user._id });

  // Return the newly created request populated so clients can display it immediately
  const populated = await BuyRequest.findById(reqDoc._id)
    .populate({
      path: 'itemId',
      select: 'title description price category condition campus images sellerId',
      populate: { path: 'sellerId', select: 'name email' }
    })
    .populate('buyerId', 'name email')
    .lean();

  // also provide backward-compatible aliases
  const normalized = {
    ...populated,
    item: populated.itemId,
    seller: populated.itemId?.sellerId,
    buyer: populated.buyerId
  };

  res.status(201).json(normalized);
}


// GET /api/requests/mine (buyer)
export async function listMyRequests (req, res) {
  const requests = await BuyRequest.find({ buyerId: req.user._id })
    .populate({
      path: 'itemId',
      select: 'title description price category condition campus images sellerId',
      populate: { path: 'sellerId', select: 'name email' }
    })
    .populate('buyerId', 'name email')
    .sort('-createdAt')
    .lean();
  // provide backward-compatible aliases for older frontends
  const normalized = requests.map(r => ({
    ...r,
    item: r.itemId,
    seller: r.itemId?.sellerId,
    buyer: r.buyerId
  }));

  res.json({ data: normalized });
}


// GET /api/requests/received (seller)
export async function listReceived (req, res) {
  // find items owned by seller, then requests for those items
  const myItemIds = await Item.find({ sellerId: req.user._id }).distinct('_id');
  const requests = await BuyRequest.find({ itemId: { $in: myItemIds } })
    .populate({
      path: 'itemId',
      select: 'title description price category condition campus images sellerId',
      populate: { path: 'sellerId', select: 'name email' }
    })
    .populate('buyerId', 'name email')
    .sort('-createdAt')
    .lean();
  const normalized = requests.map(r => ({
    ...r,
    item: r.itemId,
    seller: r.itemId?.sellerId,
    buyer: r.buyerId
  }));

  res.json({ data: normalized });
}


// PATCH /api/requests/:id (seller-only action)
export async function updateRequest (req, res) {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { status } = req.body; // 'accepted' | 'rejected'
const br = await BuyRequest.findById(req.params.id);
if (!br) return res.status(404).json({ message: 'Request not found' });


const item = await Item.findById(br.itemId);
if (!item) return res.status(404).json({ message: 'Item not found' });
if (String(item.sellerId) !== String(req.user._id) && req.user.role !== 'admin') {
return res.status(403).json({ message: 'Forbidden' });
}
if (br.status !== 'pending') return res.status(400).json({ message: 'Only pending requests can be updated' });


if (status === 'accepted') {
// Ensure no other accepted request exists
const otherAccepted = await BuyRequest.findOne({ itemId: br.itemId, status: 'accepted' });
if (otherAccepted) return res.status(400).json({ message: 'Another request already accepted' });


br.status = 'accepted';
await br.save();


// Mark item reserved
item.status = 'reserved';
await item.save();


// Optionally auto-reject all other pending requests for the item
await BuyRequest.updateMany({ itemId: br.itemId, _id: { $ne: br._id }, status: 'pending' }, { $set: { status: 'rejected' } });
} else if (status === 'rejected') {
br.status = 'rejected';
await br.save();
} else {
return res.status(400).json({ message: 'Invalid status' });
}


res.json(br);
}
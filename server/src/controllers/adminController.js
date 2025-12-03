import User from '../models/User.js';
import Item from '../models/Item.js';

export async function listUsers(req, res) {
  const users = await User.find({}).select('name email role createdAt').sort('-createdAt').lean();
  res.json({ users });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // Option: soft-delete or remove; for now remove
  await user.deleteOne();
  // Optionally remove user's items? Keep for now.
  res.json({ message: 'Deleted' });
}

export async function listItems(req, res) {
  const items = await Item.find({}).select('title sellerId status createdAt').populate('sellerId', 'name').sort('-createdAt').lean();
  const mapped = items.map(i => ({ id: i._id, title: i.title, status: i.status, seller: i.sellerId ? { id: i.sellerId._id, name: i.sellerId.name } : null, createdAt: i.createdAt }));
  res.json({ items: mapped });
}

export async function deleteItem(req, res) {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  await item.deleteOne();
  res.json({ message: 'Deleted' });
}

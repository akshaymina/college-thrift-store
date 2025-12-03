import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true }
}, { timestamps: true });

// Unique wishlist entry per user-item pair
wishlistSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);

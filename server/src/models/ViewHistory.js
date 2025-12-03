import mongoose from 'mongoose';

const viewHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
  viewCount: { type: Number, default: 1 }
}, { timestamps: true });

// Index for finding user's view history
viewHistorySchema.index({ userId: 1, createdAt: -1 });
// Index for finding trending (most viewed items)
viewHistorySchema.index({ itemId: 1, createdAt: -1 });

export default mongoose.model('ViewHistory', viewHistorySchema);

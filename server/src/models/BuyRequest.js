import mongoose from 'mongoose';


const buyRequestSchema = new mongoose.Schema({
itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending', index: true }
}, { timestamps: true });


buyRequestSchema.index({ itemId: 1, buyerId: 1 }, { unique: true }); // one request per buyer per item


export default mongoose.model('BuyRequest', buyRequestSchema);
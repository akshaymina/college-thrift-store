import mongoose from 'mongoose';


const itemSchema = new mongoose.Schema({
title: { type: String, required: true, trim: true },
description: { type: String, trim: true, default: '' },
price: { type: Number, required: true, min: 0 },
category: { type: String, required: true, trim: true },
condition: { type: String, enum: ['new', 'like-new', 'good', 'fair'], default: 'good' },
sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available', index: true },
campus: { type: String, default: 'Main', index: true },
images: { type: [String], default: [] },
deleted: { type: Boolean, default: false, index: true },
deletedAt: { type: Date },
deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
deletionReason: { type: String }
}, { timestamps: true });


// Text index supports simple search; we also do regex fallback in controller
itemSchema.index({ title: 'text', description: 'text' });

// Compound index to find active items efficiently
itemSchema.index({ deleted: 1, createdAt: -1 });

export default mongoose.model('Item', itemSchema);
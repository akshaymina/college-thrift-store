import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, enum: ['delete-user', 'restore-user', 'delete-item', 'restore-item'] },
  targetType: { type: String, enum: ['user', 'item'] },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  targetDetails: { type: Object }, // snapshot of name/email/title etc
  reason: { type: String },
  metadata: { type: Object }
}, { timestamps: true });

auditLogSchema.index({ admin: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

export default mongoose.model('AuditLog', auditLogSchema);

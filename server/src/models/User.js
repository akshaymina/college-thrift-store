import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatarUrl: { type: String },
  deleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletionReason: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

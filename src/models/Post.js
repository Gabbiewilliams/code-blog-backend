import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body:  { type: String, required: true },     // <— name must match controller/frontend
    tags:  [{ type: String, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);

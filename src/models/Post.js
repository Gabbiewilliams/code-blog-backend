import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    contentMd: { type: String, required: true },
    tags: [{ type: String, index: true }],
    author: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: String
    }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;

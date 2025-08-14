import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, index: true },
    name: String,
    email: { type: String, index: true },
    picture: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;

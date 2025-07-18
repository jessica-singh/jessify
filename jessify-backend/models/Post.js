import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;

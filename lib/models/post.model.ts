import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  media: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Circle",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  editedAt: { type: Date, default: null },
  parentId: { type: String },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  onboarded: { type: Boolean, required: true },
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;

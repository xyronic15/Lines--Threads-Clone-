import mongoose from "mongoose";

const circleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const Circle = mongoose.models.Circle || mongoose.model("Circle", circleSchema);

export default Circle;

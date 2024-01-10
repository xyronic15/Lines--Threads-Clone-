import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
});

const Follow = mongoose.models.Follow || mongoose.model("Follow", followSchema);

export default Follow;

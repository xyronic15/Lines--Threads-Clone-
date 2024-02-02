import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //the person who is being followed
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // the user that is following the above
    date: { type: Date, default: Date.now },
});

const Follow = mongoose.models.Follow || mongoose.model("Follow", followSchema);

export default Follow;

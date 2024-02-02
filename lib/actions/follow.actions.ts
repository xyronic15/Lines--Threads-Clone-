"use server";

import { revalidatePath } from "next/cache";
import Follow from "../models/follow.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

// interface params for a follow
interface Params {
  followerId: string;
  followingId: string;
  path: string;
}

// function to add a follower
export async function addFollower({ followerId, followingId, path }: Params) {
  // connect to the database
  try {
    connectToDB();

    // console.log(followerId);
    // console.log(followingId);

    // find the users in the database
    const follower = await User.findOne({ id: followerId }).select("_id");
    const following = await User.findOne({ id: followingId }).select("_id");

    // console.log(following);
    // console.log(follower);

    // create a new follow object
    const newFollow = await Follow.create({
      following: following._id,
      follower: follower._id,
    });

    // revalidate the path
    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to add follower: ${e.message}`);
  }
}

// function to remove a follower
export async function removeFollower({
  followerId,
  followingId,
  path,
}: Params) {
  // connect to the database
  try {
    connectToDB();

    // find the users in the database
    const follower = await User.findOne({ id: followerId });
    const following = await User.findOne({ id: followingId });

    // find the follow in the database and delete it
    const follow = await Follow.findOneAndDelete({
      following: following._id,
      follower: follower._id,
    });

    // revalidate the path
    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to remove follower: ${e.message}`);
  }
}

// get the followers of a user
export async function getFollowers(userId: string) {
  // connect to the database
  try {
    connectToDB();

    // find the user in the database
    const following = await User.findOne({ id: userId });

    // find the followers of the user
    const followers = await Follow.find({ following: following._id })
      .select("-following")
      .populate({
        path: "follower",
        model: "User",
        select: "_id id username name image",
      });

    // return the followers
    return followers;
  } catch (e: any) {
    throw new Error(`Failed to get followers: ${e.message}`);
  }
}

// get the users that the user is following
export async function getFollowing(userId: string) {
  // connect to the database
  try {
    connectToDB();

    // find the user in the database
    const follower = await User.findOne({ id: userId });

    // find the users that the user is following
    const following = await Follow.find({ follower: follower._id })
      .select("-follower")
      .populate({
        path: "following",
        model: "User",
        select: "_id id username name image",
      });

    // return the following
    return following;
  } catch (e: any) {
    throw new Error(`Failed to get following: ${e.message}`);
  }
}

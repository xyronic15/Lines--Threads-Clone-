"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Post from "../models/post.model";
import Follow from "../models/follow.model";
import { connectToDB } from "../mongoose";
import Circle from "../models/circle.model";
import { Children } from "react";

interface UserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

// function to onboard/update the user in mongodb
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UserParams): Promise<void> {
  // connect to the database
  try {
    connectToDB();

    // find the user and update their information
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (e: any) {
    throw new Error(`Failed to onboard/update user: $(e.message)`);
  }
}

// function to retrieve the user from mongodb given a userId string
export async function fetchUser(userId: string) {
  try {
    connectToDB();

    // find the user in the database
    const user = await User.findOne({ id: userId });

    return user;
  } catch (e: any) {
    throw new Error(`Failed to fetch user: $(e.message)`);
  }
}

// fetch a user's posts given an id string
export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // find the user in the database
    const result = await User.findOne({ id: userId }).populate({
      path: "posts",
      model: Post,
      populate: [
        {
          path: "circle",
          model: Circle,
          select: "_id username name image",
        }, // populate the circleId field with the circle's mongoid, name and PFP]
        {
          path: "likes",
          model: User,
          select: "id -_id",
        }, // populate the likes field with the user's id from clerk
        {
          path: "children",
          model: Post,
          populate: {
            path: "author",
            model: User,
            select: "id name image", // populate the author field with the user's  clerkid, name and PFP
          },
        },
      ],
      options: { sort: { createdAt: -1 } },
    });

    return result;
  } catch (e: any) {
    throw new Error(`Failed to fetch user posts: $(e.message)`);
  }
}

// function to get all of the replies to all of a user's posts
export async function getReplies(userId: string) {
  try {
    connectToDB();

    // get the user's object id
    const id = await User.findOne({ id: userId }).select("_id");

    // get all the posts made by the user
    const posts = await Post.find({ author: id._id.toString() });

    // get all the children ids to the posts
    const children = posts.reduce((acc: any, post: any) => {
      return acc.concat(post.children);
    }, []);

    // find the children posts excluding the ones made by the given user
    const replies = await Post.find({
      _id: { $in: children },
      author: { $ne: id._id.toString() },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image", // populate the author field with the user's clerkid, name and PFP
    });

    return replies;
  } catch (e: any) {
    throw new Error(`Failed to get replies: ${e.message}`);
  }
}

// function to get the activity of the user (all of the replies and the follows made to the user's account)
export async function getActivity(userId: string) {
  try {
    connectToDB();

    // get the user's object id
    const id = await User.findOne({ id: userId }).select("_id");

    // get all the posts made by the user
    const posts = await Post.find({ author: id._id.toString() });

    // get all the children ids to the posts
    const children = posts.reduce((acc: any, post: any) => {
      return acc.concat(post.children);
    }, []);

    // find the children posts excluding the ones made by the given user
    const repliesQuery = await Post.find({
      _id: { $in: children },
      author: { $ne: id._id.toString() },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image", // populate the author field with the user's clerkid, name and PFP
    });

    // rename the "createdAt" property to just "date" and a new field called "type" and set it to comment
    const replies = repliesQuery.map((reply: any) => {
      return { date: reply.createdAt, type: "comment", reply };
    });

    // replies.slice(0, 5).forEach((reply: any) => {
    //   console.log(reply);
    // });

    // get all the follows made to the user sorted by the most recent
    const followsQuery = await Follow.find({
      following: id._id.toString(),
    }).populate({
      path: "follower",
      model: User,
      select: "_id id name username bio image", // populate the author field with the user's clerkid, name and PFP
    });

    // add a field "type" and set it to follow
    const follows = followsQuery.map((follow: any) => {
      return { date: follow.date, type: "follow", follow };
    });

    // follows.slice(0, 5).forEach((follow: any) => {
    //   console.log(follow);
    // });

    // combine the arrays and sort them by date property descending
    const activity = [...replies, ...follows].sort((a: any, b: any) => {
      return b.date - a.date;
    });

    return activity;
  } catch (e: any) {
    throw new Error(`Failed to get activity: ${e.message}`);
  }
}

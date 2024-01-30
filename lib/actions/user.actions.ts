"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Post from "../models/post.model";
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
          select: "_id name image",
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
    });

    return result;
  } catch (e: any) {
    throw new Error(`Failed to fetch user posts: $(e.message)`);
  }
}

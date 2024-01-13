"use server";

import { revalidatePath } from "next/cache";
import Post from "../models/post.model";
import User from "../models/user.model";
import Circle from "../models/circle.model";
import { connectToDB } from "../mongoose";

// interface params for a post
interface PostParams {
  id: string | null;
  text: string;
  media: string[];
  author: string;
  circleId: string | null;
  path: string;
}

// function to create a post
export async function createPost({
  text,
  media,
  author,
  circleId,
  path,
}: PostParams) {
  console.log(author);

  // connect to the database
  try {
    connectToDB();

    // create a new post
    const createdPost = await Post.create({ text, media, author, circleId });

    // update the user's posts
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    // if circle provided, update it's posts
    if (circleId) {
      await Circle.findByIdAndUpdate(circleId, {
        $push: { posts: createdPost._id },
      });
    }

    // revalidate the path
    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to create post: ${e.message}`);
  }
}

// function to retrieve a post given a postId string
export async function fetchPostById(postId: string) {
  try {
    connectToDB();

    // find the post in the database
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // populate the author field with the user's mongoid, clerkid, name and PFP
      .populate({
        path: "circle",
        model: Circle,
        select: "_id name image",
      }) // populate the circleId field with the circle's mongoid, name and PFP
      .populate({
        path: "children", //populate the children field
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children", //populate the children field within children
            model: Post, // the model of the nested children
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return post;
  } catch (e: any) {
    throw new Error(`Failed to fetch post: ${e.message}`);
  }
}

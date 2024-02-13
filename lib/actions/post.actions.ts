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
  // console.log(author);

  // connect to the database
  try {
    connectToDB();

    // create a new post
    const createdPost = await Post.create({
      text,
      media,
      author,
      circle: circleId,
    });

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
        select: "_id username name image",
      }) // populate the circleId field with the circle's mongoid, name and PFP
      .populate({
        path: "likes",
        model: User,
        select: "id -_id",
      }) // populate the likes field with the user's id from clerk
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
      // .select("-likes")
      .exec();

    post.adjustedLikes = post.likes.map((like: any) => like.id); // convert the likes array to an array of strings

    return post;
  } catch (e: any) {
    throw new Error(`Failed to fetch post: ${e.message}`);
  }
}

// function to edit a post
export async function editPostById({
  id,
  text,
  media,
  path,
}: PostParams): Promise<void> {
  try {
    connectToDB();

    // find the post in the database and update the post's text and media
    const post = await Post.findById(id);
    const updatedPost = await Post.findByIdAndUpdate(id, {
      text: text,
      media: media,
      editedAt: new Date(),
      createdAt: post.createdAt,
    });

    // console.log(updatedPost);

    // revalidate the path
    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to edit post: ${e.message}`);
  }
}

// function deletes post given an id string
export async function deletePostById(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // update the post so that it has deleted text, no media, and set active as false
    await Post.findByIdAndUpdate(id, {
      text: "This post has been deleted",
      media: [],
      active: false,
    });

    // revalidate the path
    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to delete post: ${e.message}`);
  }
}

// function that toggles the like of a post
export async function toggleLike(
  postId: string,
  userId: string,
  like: boolean
): Promise<void> {
  try {
    connectToDB();

    // find the user in the database
    const user = await User.findOne({ id: userId });

    // find the post in the database and update the post's likes array with the userId or remove the userId from the likes array
    const updateOperation = like
      ? { $addToSet: { likes: user._id } } // Add userId to likes array
      : { $pull: { likes: user._id } }; // Remove userId from likes array

    await Post.findByIdAndUpdate(postId, updateOperation);
  } catch (e: any) {
    throw new Error(`Failed to toggle like: ${e.message}`);
  }
}

//function that adds a comment to a post
export async function addComment(
  userId: string,
  postId: string,
  text: string,
  media: string[],
  path: string
) {
  try {
    connectToDB();

    // create a new post
    const createdPost = await Post.create({
      text: text,
      media: media,
      author: userId,
      parentId: postId,
    });

    // update the user's posts
    await User.findByIdAndUpdate(userId, {
      $push: { posts: createdPost._id },
    });

    // find the post in the database and update the post's comments array with the userId and text
    await Post.findByIdAndUpdate(postId, {
      $push: { children: createdPost._id },
    });

    // revalidate the path
    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to add comment: ${e.message}`);
  }
}

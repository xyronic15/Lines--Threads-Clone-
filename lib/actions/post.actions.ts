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

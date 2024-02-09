"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Post from "../models/post.model";
import Follow from "../models/follow.model";
import { connectToDB } from "../mongoose";
import Circle from "../models/circle.model";

interface CircleParams {
  userId?: string;
  circleId?: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path?: string;
}

// function to create a circle's details in mongodb
export async function createCircle({
  userId,
  username,
  name,
  bio,
  image,
}: CircleParams): Promise<void> {
  // connect to the database
  try {
    connectToDB();

    // find the user's object id in the database
    const user = await User.findOne({ id: userId }).select("_id");

    // create a new circle using the given information
    await Circle.create({
      name: name,
      username: username,
      image: image,
      bio: bio,
      owner: user._id,
    });
  } catch (e: any) {
    throw new Error(`Failed to create a circle: $(e.message)`);
  }
}

// function that updates a circle's details
export async function updateCircle({
  circleId,
  username,
  name,
  bio,
  image,
  path,
}: CircleParams): Promise<void> {
  // connect to the database
  try {
    connectToDB();

    // find the circle and update it's details
    await Circle.findOneAndUpdate(
      { id: circleId },
      { username: username, name: name, bio: bio, image: image },
      { upsert: true }
    );

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to update the circle's information: $(e.message)`);
  }
}

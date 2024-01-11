"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

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

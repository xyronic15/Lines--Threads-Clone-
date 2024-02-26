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
    const circle = await Circle.create({
      name: name,
      username: username,
      image: image,
      bio: bio,
      owner: user._id,
    });

    // add the user to the circle's admins
    await Circle.findByIdAndUpdate(circle._id, {
      $push: { admins: user._id },
    });

    // update the user's circles
    await User.findByIdAndUpdate(user._id, {
      $push: { circles: circle._id },
    });
  } catch (e: any) {
    throw new Error(`Failed to create a circle: ${e.message}`);
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
    await Circle.findByIdAndUpdate(
      circleId,
      { username: username, name: name, bio: bio, image: image },
      { upsert: true }
    );

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to update the circle's information: ${e.message}`);
  }
}

// function to fetch a circle's details given a circleId
export async function fetchCircle(circleId: string) {
  try {
    connectToDB();

    // find the circle in the database
    const circleQuery = await Circle.findById(circleId)
      .populate({
        path: "owner",
        model: User,
        select: "_id id username name image",
      })
      .populate({
        path: "admins",
        model: User,
        select: "_id id username name image",
      })
      .populate({
        path: "members",
        model: User,
        select: "_id id username name image",
      })
      .select("-posts")
      .exec();

    const circle = {
      _id: circleQuery._id,
      name: circleQuery.name,
      username: circleQuery.username,
      image: circleQuery.image,
      bio: circleQuery.bio,
    };

    return [circle, circleQuery.owner, circleQuery.admins, circleQuery.members];
  } catch (e: any) {
    throw new Error(`Failed to fetch the circle: ${e.message}`);
  }
}

// function to join a circle
export async function joinCircle(
  userId: string,
  circleId: string,
  path: string
) {
  try {
    connectToDB();

    // find the user and circle in the database
    const user = await User.findOne({ id: userId }).select("_id");
    const circle = await Circle.findById(circleId).select("_id");

    // update the circle's members and admins
    await Circle.findByIdAndUpdate(circle._id, {
      $push: { members: user._id },
    });
    await User.findByIdAndUpdate(user._id, {
      $push: { circles: circle._id },
    });

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to join the circle: ${e.message}`);
  }
}

// function that allows the user to leave a circle even if they are a member or an admin
export async function leaveCircle(
  userId: string,
  circleId: string,
  path: string
) {
  try {
    connectToDB();

    // find the user and circle in the database
    const user = await User.findOne({ id: userId }).select("_id");
    const circle = await Circle.findById(circleId).select("_id");

    // only do if the user is not the owner
    if (user._id === circle.owner) {
      throw new Error("Cannot leave a circle you own");
    }
    // update the circle's members and admins
    await Circle.findByIdAndUpdate(circle._id, {
      $pull: { members: user._id, admins: user._id },
    });

    // remove the circle from the user's circles array
    await User.findByIdAndUpdate(user._id, {
      $pull: { circles: circle._id },
    });

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to leave the circle: ${e.message}`);
  }
}

// fetch a circle's posts given an id string
export async function fetchCirclePosts(circleId: string) {
  try {
    connectToDB();

    // find the circle in the database
    const result = await Circle.findById(circleId).populate({
      path: "posts",
      model: Post,
      populate: [
        {
          path: "author",
          model: User,
          select: "id name image",
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
    throw new Error(`Failed to fetch the circle's posts: ${e.message}`);
  }
}

// function that makes a user an admin
export async function makeAdmin(
  userId: string,
  circleId: string,
  path: string
) {
  try {
    connectToDB();

    // find the user in the database
    const user = await User.findOne({ id: userId }).select("_id");

    // update the circle's admins and remove them from the members list
    await Circle.findByIdAndUpdate(circleId, {
      $push: { admins: user._id },
      $pull: { members: user._id },
    });

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Failed to make the user an admin: ${e.message}`);
  }
}

// function that removes the user from being an admin in the circle
export async function removeAdmin(
  userId: string,
  circleId: string,
  path: string
) {
  try {
    connectToDB();

    // find the user in the database
    const user = await User.findOne({ id: userId }).select("_id");

    // update the circle's admins and remove them from the admins list and add them to the members list
    await Circle.findByIdAndUpdate(circleId, {
      $pull: { admins: user._id },
      $push: { members: user._id },
    });

    revalidatePath(path);
  } catch (e: any) {
    throw new Error(
      `Failed to remove the user from being an admin: ${e.message}`
    );
  }
}

// function that searches for circles based on username, name or bio
export async function searchCircles(query: string) {
  try {
    connectToDB();

    if (!query) {
      return [];
    }

    // search for circles based on username, name or bio
    const circles = await Circle.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive regex for name
        { username: { $regex: query, $options: "i" } }, // Case-insensitive regex for username
        { bio: { $regex: query, $options: "i" } }, // Case-insensitive regex for bio
      ],
    }).select("_id name username image admins members");

    return circles;
  } catch (e: any) {
    throw new Error(`Failed to find circles: ${e.message}`);
  }
}

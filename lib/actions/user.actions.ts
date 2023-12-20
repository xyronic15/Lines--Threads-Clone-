"use server";

import User from "../models/user.model";
import { connectToDB } from "../validations/mongoose";

export async function updateUser(userId: String): Promise<void> {
  // connect to the database
  connectToDB();

  // find the user and update their information
  // TBC
  await User.findOneAndUpdate({ id: userId }, { age: 30 });
}

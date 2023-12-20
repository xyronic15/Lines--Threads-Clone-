import mongoose from "mongoose";

// var to check if mongodb is connected
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  // if connection i already established then don't make a new connection
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  if (!process.env.MONGODB_URL) {
    return console.log("MONGODB_URL is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

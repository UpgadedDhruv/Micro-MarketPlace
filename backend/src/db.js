import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

let cached = null;

export const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!cached) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }

    cached = mongoose.connect(uri);
  }

  await cached;
};

export default mongoose;

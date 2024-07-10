import mongoose from "mongoose";
import "dotenv/config";

const mongodb_uri = process.env.MONGODB_URI;
if (!mongodb_uri) throw new Error("MONGODB_URI is missing from the .env file");

export default async function mongoDBConnection() {
  try {
    await mongoose.connect(mongodb_uri!);
    console.log("connected to db....");

      
  } catch (error) {
    throw error;
  }
}

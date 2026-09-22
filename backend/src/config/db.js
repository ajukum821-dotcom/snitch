import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`server conncted to mongodbSuccessfully`);
  } catch (error) {
    console.log(`server connection failed`);
  }
};
export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/auth`);

    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectDB;
import mongoose from "mongoose";

const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (typeof MONGO_URI !== "string") {
  throw new Error("Mongo URI required!");
}

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");
  } catch (error: unknown) {
    console.error("Error while connecting to DB", error);
  }
};

export default connectDb;

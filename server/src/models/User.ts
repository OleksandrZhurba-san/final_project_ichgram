import { model, Schema } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>({
  full_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, },
  bio: { type: String, default: "" },
  website: { type: String, default: "" },
  image: { type: String, default: "" },
  posts_count: { type: Number, default: 0 },
  followers_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  create_at: { type: Date, default: Date.now },
});

const User = model<IUser>("User", userSchema);

export default User;

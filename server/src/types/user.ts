import { Document, Types } from "mongoose";

export interface IUser extends Document {
  full_name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  website: string;
  image: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  posts: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  create_at: Date;
}
export interface IUpdateProfileBody {
  username: string;
  bio: string;
  website: string;
}

import { Document, Types } from "mongoose";

interface IPost extends Document {
  user_id: Types.ObjectId;
  images: string[];
  description: string;
  likes_count: number;
  comments_count: number;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  created_at: Date;
}
export interface ICreatePostBody {
  description: string;
}
export interface IUpdatePostBody {
  description?: string;
}

export interface IPostParams {
  [key: string]: string;
}

export default IPost;

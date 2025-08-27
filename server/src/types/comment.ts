import { Types } from "mongoose";

interface IComment extends Document {
  user_id: Types.ObjectId;
  ref_id: Types.ObjectId;
  ref_type: "Post" | "Comment";
  text: string;
  likes_count: number;
  comments_count: number;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  created_at: Date;
}

export interface ICreateCommentBody {
  text: string;
}

export interface ICommentParams {
  [key: string]: string;
}

export default IComment;

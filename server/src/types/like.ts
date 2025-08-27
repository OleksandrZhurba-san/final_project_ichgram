import { Document, Types } from "mongoose";

interface ILike extends Document {
  user_id: Types.ObjectId;
  ref_id: Types.ObjectId;
  ref_type: "Post" | "Comment";
  created_at: Date;
}

export default ILike;

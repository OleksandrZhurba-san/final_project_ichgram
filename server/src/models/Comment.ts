import { model, Schema } from "mongoose";
import IComment from "../types/comment";

const commentSchema = new Schema<IComment>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ref_id: { type: Schema.Types.ObjectId, required: true },
  ref_type: { type: String, required: true, enum: ["Post", "Comment"] },
  text: { type: String, required: true, },
  likes_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  created_at: { type: Date, default: Date.now }
});

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;

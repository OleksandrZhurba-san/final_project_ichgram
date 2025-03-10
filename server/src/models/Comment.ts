import { model, Schema } from "mongoose";
import IComment from "../types/comment";

const commentSchema = new Schema<IComment>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ref_id: { type: Schema.Types.ObjectId, required: true },
  ref_type: { type: String, required: true, enum: ["Post", "Comment"] },
});

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;

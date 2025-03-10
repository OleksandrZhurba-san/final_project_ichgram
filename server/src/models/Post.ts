import { model, Schema } from "mongoose";
import IPost from "../types/post";

const postSchema = new Schema<IPost>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String, required: true }],
  description: { type: String, default: "" },
  likes_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  created_at: { type: Date, default: Date.now },
});

const Post = model<IPost>("Post", postSchema);
export default Post;

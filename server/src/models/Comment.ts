import { Schema } from "mongoose";

const commentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ref_id: { type: Schema.Types.ObjectId, required: true },
  ref_type: { type: String, required: true, enum: ["Post", "Comment"] },
});

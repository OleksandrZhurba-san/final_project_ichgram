import { model, Schema } from "mongoose";
import ILike from "../types/like";

const likeSchema = new Schema<ILike>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ref_id: { type: Schema.Types.ObjectId, required: true },
  ref_type: { type: String, required: true, enum: ["Post", "Comment"] },
  created_at: { type: Date, default: Date.now }
});

const Like = model<ILike>("Like", likeSchema);

export default Like;

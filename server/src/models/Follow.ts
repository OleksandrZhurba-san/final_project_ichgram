import { model, Schema } from "mongoose";
import IFollow from "../types/follow"

const followSchema = new Schema<IFollow>({
  follower_user_id: {
    type: Schema.Types.ObjectId, ref: "User", required: true
  },
  following_user_id: {
    type: Schema.Types.ObjectId, ref: "User", required: true
  },
  created_at: { type: Date, default: Date.now }
});

const Follow = model<IFollow>("Follow", followSchema);

export default Follow;

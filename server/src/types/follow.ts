import { Document, Types } from "mongoose";

interface IFollow extends Document {
  follower_user_id: Types.ObjectId;
  following_user_id: Types.ObjectId;
  created_at: Date;
}

export default IFollow;

import { HydratedDocument } from "mongoose";
import IUser from "./user";

declare global {
  namespace Express {
    export interface Request {
      user: HydratedDocument<IUser>;
    }
  }
}

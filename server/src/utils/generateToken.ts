import jwt, { Secret } from "jsonwebtoken";
import { ITokenPayload } from "../types/tokenPayload";

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
//const JWT_EXPIRATION: string = (process.env.JWT_EXPIRATION as string) || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required!");
}

export const generateToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h"});
};

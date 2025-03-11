import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const authMiddleware = async (
  req: Request,
  res: Response<IApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      console.log("Auth error: No token provided");
      res.status(401).json({ message: "Access denied. Authorization token is required!" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.id) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const user = await User.findById(decoded.id).select("_id username email");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;


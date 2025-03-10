import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { JwtPayload, Secret } from "jsonwebtoken";
import User from "../models/User";

const authMiddleware = async (
  req: Request,
  res: Response<IApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log(`Auth error: token ${token}`);
      res
        .status(401)
        .json({ message: "Access denied. Authorization token is required!" });
      return;
    }
    const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
    if (typeof JWT_SECRET !== "string") {
      throw new Error("JWT secret is required");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;

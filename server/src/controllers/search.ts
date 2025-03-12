import { Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { ISearchQuery } from "../types/search";
import { Post, User } from "../models";

const userSearch = async (
  req: Request<ISearchQuery>,
  res: Response<IApiResponse>
): Promise<void> => {
  const { query } = req.query;

  try {
    const users = query
      ? await User.find({
        username: { $regex: query, $options: "i" },
      }).select(["_id", "username", "image"])
      : [];

    res.status(201).json({ message: "Users: ", data: users })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const postSearch = async (
  req: Request<ISearchQuery>,
  res: Response<IApiResponse>
): Promise<void> => {
  const { query } = req.query;
  try {
    const posts = await Post.find(
      query
        ? {
          description: { $regex: query, $options: "i" }
        }
        : {}
    );
    if (posts.length === 0) {
      res.status(404).json({ message: "No matching posts" })
      return;
    }
    res.status(200).json({ message: "Posts: ", data: posts })
  } catch (error) {

  }
}

export { userSearch, postSearch }

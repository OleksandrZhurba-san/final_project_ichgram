import { Request, Response } from "express";
import { ICreatePostBody, IPostParams, IUpdatePostBody } from "../types/post";
import { IApiResponse } from "../types/common";
import { Post, User } from "../models"
import upload from "../utils/multer";
import mongoose from "mongoose";

export const uploadPostImg = upload.single("image");

const createPost = async (
  req: Request<{}, {}, ICreatePostBody>,
  res: Response<IApiResponse>
): Promise<void> => {
  const { description } = req.body;
  const userId = req.user._id;
  try {
    if (!req.file) {
      res.status(400).json({ message: "Image is required" });
      return;
    }
    const base64Img = req.file.buffer.toString("base64");
    const post = new Post({
      user_id: userId,
      images: [`data:image/jpeg;base64,${base64Img}`],
      description,
    });
    await post.save();
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { posts: post._id },
        $inc: { posts_count: 1 },
      },
      { new: true }
    );
    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPost = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId)
      .populate("user_id", "username image")
      .populate({
        path: "comments",
        populate: {
          path: "user_id",
          select: "username image",
        },
      })
      .populate("likes");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json({ message: "Post:", data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePost = async (
  req: Request<IPostParams, {}, IUpdatePostBody>,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  const { description } = req.body;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (String(post.user_id) !== String(userId)) {
      res.status(403).json({ message: "Access denied!" });
      return;
    }

    if (!description) {
      res.status(401).json({ message: "No description for update provided" });
      return;
    }

    console.log("Description to update: ", description);
    post.description = description;
    await post.save();

    res
      .status(200)
      .json({ message: "Post has been updated successfully", data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePost = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      console.log(post);
      res.status(404).json({ message: "Post Not Found" });
      return;
    }
    if (String(post.user_id) !== String(userId)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(
      post.user_id,
      {
        $pull: { posts: post._id },
        $inc: { posts_count: -1 },
      },
      { new: true }
    );

    res.status(200).json({ message: "Post has been successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPosts = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  if (!mongoose.isValidObjectId(req.user._id)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const userId = req.user._id;
  if (!req.user || !req.user._id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    console.log(userId, typeof userId);

    const posts = await Post.find({ user_id: { $ne: userId } })
      .populate("user_id", "username image")
      .populate({
        path: "comments",
        populate: {
          path: "user_id",
          select: "username image",
        },
      })
      .populate("likes", "user_id");
    res.status(200).json({ message: "Posts", data: posts });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createPost, getPost, updatePost, deletePost, getAllPosts };

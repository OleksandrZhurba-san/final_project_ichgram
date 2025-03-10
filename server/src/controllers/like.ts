import { Request, Response } from "express";
import { IApiResponse } from "../types/common";
import Post from "../models/Post";
import Like from "../models/Like";

const likePost = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user._id;
  try {

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post Not Found" })
      return;
    }

    const existingLike = await Like.findOne({
      ref_id: postId,
      ref_type: "Post",
      user_id: userId,
    });

    if (existingLike) {
      res.status(400).json({ message: "This post has already been liked" });
      return;
    }

    const like = new Like({
      user_id: userId,
      ref_id: postId,
      ref_type: "Post",
    });

    await like.save();

    await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: like._id },
        $inc: { likes_count: 1 }
      },
      { new: true }
    );

    res.status(201).json({ message: "Like post successfully", data: like });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const unlikePost = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user._id;
  try {
    const existingLike = await Like.findOne({
      ref_id: postId,
      ref_type: "Post",
      user_id: userId,
    });

    if (!existingLike) {
      res.status(400).json({ message: "Like Not Found" });
      return;
    }

    await Like.findByIdAndDelete(existingLike._id);


    await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: existingLike._id },
        $inc: { likes_count: -1 }
      },
      { new: true }
    );

    res.status(201).json({ message: "Unliked", data: existingLike });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export { likePost, unlikePost };

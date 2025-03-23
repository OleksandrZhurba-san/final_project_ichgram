import { Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { Post, Like } from "../models";

const likePost = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post Not Found" });
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
        $inc: { likes_count: 1 },
      },
      { new: true }
    );

    // Get updated like count and status
    const likeCount = await Like.countDocuments({
      ref_id: postId,
      ref_type: "Post",
    });

    res.status(201).json({
      message: "Liked post successfully",
      data: {
        count: likeCount,
        liked: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
        $pull: { likes: existingLike._id },
        $inc: { likes_count: -1 },
      },
      { new: true }
    );

    // Get updated like count and status
    const likeCount = await Like.countDocuments({
      ref_id: postId,
      ref_type: "Post",
    });

    res.status(200).json({
      message: "Unliked successfully",
      data: {
        count: likeCount,
        liked: false,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const toggleLike = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post Not Found" });
      return;
    }

    const existingLike = await Like.findOne({
      ref_id: postId,
      ref_type: "Post",
      user_id: userId,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: existingLike._id },
          $inc: { likes_count: -1 },
        },
        { new: true }
      );
    } else {
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
          $inc: { likes_count: 1 },
        },
        { new: true }
      );
    }

    // Get updated like count and status
    const likeCount = await Like.countDocuments({
      ref_id: postId,
      ref_type: "Post",
    });

    const userLike = await Like.findOne({
      ref_id: postId,
      ref_type: "Post",
      user_id: userId,
    });

    res.status(200).json({
      message: "Like status updated",
      data: {
        count: likeCount,
        liked: !!userLike,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLikesByPost = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post Not Found" });
      return;
    }

    const likeCount = await Like.countDocuments({
      ref_id: postId,
      ref_type: "Post",
    });

    const userLike = await Like.findOne({
      ref_id: postId,
      ref_type: "Post",
      user_id: userId,
    });

    res.status(200).json({
      message: "Post like status",
      data: {
        count: likeCount,
        liked: !!userLike,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { likePost, unlikePost, toggleLike, getLikesByPost };

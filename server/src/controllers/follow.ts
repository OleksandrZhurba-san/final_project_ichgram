import { Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { User } from "../models";
import Follow from "../models/Follow";

const follow = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const targetUserId = req.params.id;
  const userId = req.user._id;

  if (targetUserId === String(userId)) {
    res.status(401).json({ message: "Can't follow yourself" });
    return;
  }

  if (!targetUserId) {
    res.status(401).json({ message: "User ID to follow is required" });
    return;
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const alreadyFollowing = await Follow.findOne({
      follower_user_id: userId,
      following_user_id: targetUserId,
    });

    if (alreadyFollowing) {
      res.status(409).json({ message: "Already following" });
      return;
    }

    const following = new Follow({
      follower_user_id: userId,
      following_user_id: targetUserId,
    });

    following.save();

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { following: targetUser._id },
        $inc: { following_count: 1 }
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      targetUserId,
      {
        $push: { followers: user._id },
        $inc: { followers_count: 1 }
      },
      { new: true }
    );

    res.status(201).json({ message: "Follow successfully", data: follow });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const unfollow = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const targetUserId = req.params.id;
  const userId = req.user._id;

  if (!targetUserId) {
    res.status(401).json({ message: "User ID to unfollow is required" });
    return;
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const alreadyFollowing = await Follow.findOne({
      follower_user_id: userId,
      following_user_id: targetUserId,
    });

    if (!alreadyFollowing) {
      res.status(401).json({ message: "You are not following target user" });
      return;
    }

    await Follow.findByIdAndDelete(alreadyFollowing._id);

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: targetUser._id },
        $inc: { following_count: -1 }
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      targetUserId,
      {
        $pull: { followers: userId._id },
        $inc: { followers_count: -1 }
      },
      { new: true }
    );

    res.status(201).json({ message: "Successfully unfollowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserFollowers = async (
  req: Request,
  res: Response<IApiResponse>,
): Promise<void> => {
  const userId = req.params.id;

  if (!userId) {
    res.status(401).json({ message: "User ID is required" })
    return;
  }

  try {
    const followers = await User.findById(userId)
      .select("followers")
      .populate(
        "followers",
        "username image"
      )

    if (!followers) {
      res.status(404).json({ message: "Followers not found" });
      return;
    }

    res.status(200).json({ message: "Followers list", data: followers });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

};

const getUserFollowing = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const userId = req.params.id;

  if (!userId) {
    res.status(401).json({ message: "User ID is required" })
    return;
  }

  try {
    const following = await User.findById(userId)
      .select("following")
      .populate(
        "following",
        "username image"
      )
    if (!following) {
      res.status(401).json({ message: "You don't follow anyone" });
      return;
    };

    res.status(200).json({ message: "Following list: ", data: following });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Erro" })
  }

};

export { follow, unfollow, getUserFollowers, getUserFollowing };

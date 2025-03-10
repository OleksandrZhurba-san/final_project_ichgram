import { Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { Post, User } from "../models";
import { IUpdatePostBody } from "../types/post";
import { IUpdateProfileBody } from "../types/user";

const getUserProfile = async (
  req: Request,
  res: Response<IApiResponse>
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
      .select(["-password"])
      .populate("posts");
    if (!user) {
      console.log(`User not found ${user}`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User:", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserProfile = async (
  req: Request<{}, {}, IUpdateProfileBody>,
  res: Response<IApiResponse>
): Promise<void> => {
  const user = req.user;

  try {

    if (!user) {
      console.log(user);
      res.status(401).json({ message: "Unautharized access" });
      return;
    }

    const { username, bio, website } = req.body;
    if (bio) {
      user.bio = bio;
    }
    if (website) {
      user.website = website;
    }
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(404).json({ message: "This username is taken" });
        return;
      }
      user.name = username;
    }

    if (req.file) {
      const base64Img = req.file.buffer.toString("base64");
      user.image = `data:image/jpeg;base64,${base64Img}`;
    }

    await user.save();
    res.status(201).json({ message: "Profile updated succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

export { getUserProfile, updateUserProfile };

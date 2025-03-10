import { Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { User } from "../models";

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

export { getUserProfile };

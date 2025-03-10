import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { IApiResponse } from "../types/common";
import { ILoginBody, IRegisterBody } from "../types/auth";
import { User } from "../models";
// import { generateToken } from "../utils/generateToken";
import jwt, { Secret } from "jsonwebtoken";
import { IUser } from "../types/user";

const register = async (
  req: Request<{}, {}, IRegisterBody>,
  res: Response<IApiResponse>
): Promise<void> => {
  try {
    const { full_name, username, email, password } = req.body;
    if (!full_name || !username || !email || !password) {
      res.status(400).json({ message: "Please fill the all fields" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists!" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(`User registered ${newUser}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (
  req: Request<{}, {}, ILoginBody>,
  res: Response<IApiResponse>
): Promise<void> => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      console.log(`Invalid credentials. ${login} ${password}`);
      res.status(400).json({ message: "Invalid credentials!" });
      return;
    }
    const user: IUser | null = await User.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user || !user.password) {
      console.log(`db returned bad credentials ${user}, ${user?.password}`);
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(
        `password is not valid, pass: ${password}, user_pass: ${user.password}`
      );
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }
    //TODO: thx typescript, you are helping so much
    // const token = generateToken({ id: user._id.toString() });
    const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res
      .status(200)
      .json({ message: "Logged in successfully", data: { token } });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export { register, login };

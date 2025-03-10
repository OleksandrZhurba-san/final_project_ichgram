import express from "express";
import cors from "cors";
import "dotenv/config";
import "module-alias/register"
import connectDb from "./config/db";
import { authRoutes, userRoutes, postRoutes, commentRoutes, likeRoutes } from "./routes";
const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

import express, { NextFunction, Request, Response, Router } from "express";
import cors from "cors";
import "dotenv/config";
import "module-alias/register"
import connectDb from "./config/db";
import { authRoutes, userRoutes, postRoutes, commentRoutes, likeRoutes, followRoutes } from "./routes";
const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();
const apiRouter: Router = express.Router();


apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", userRoutes);
apiRouter.use("/post", postRoutes);
apiRouter.use("/comment", commentRoutes);
apiRouter.use("/like", likeRoutes);
apiRouter.use("/follow", followRoutes);

app.use("/api", apiRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Page Not Found" })

})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

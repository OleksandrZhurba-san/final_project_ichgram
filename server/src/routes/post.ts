import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { createPost, getPost, uploadPostImg } from "../controllers/post";

const router: Router = Router();

router.post("/create", authMiddleware, uploadPostImg, createPost);
router.get("/:postId", authMiddleware, getPost);

export default router;

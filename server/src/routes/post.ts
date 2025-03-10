import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { createPost, deletePost, getAllPosts, getPost, updatePost, uploadPostImg } from "../controllers/post";

const router: Router = Router();

router.post("/create", authMiddleware, uploadPostImg, createPost);
router.get("/:postId", authMiddleware, getPost);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);
router.get("/", authMiddleware, getAllPosts);

export default router;

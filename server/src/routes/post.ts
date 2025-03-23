import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { createPost, deletePost, getAllPosts, getPost, getPostsByUserId, updatePost, uploadPostImg } from "../controllers/post";
import validateObjectId from "../middlewares/validateId";

const router: Router = Router();

router.get("/", authMiddleware, getAllPosts);
router.post("/create", authMiddleware, uploadPostImg, createPost);
router.get("/:postId", authMiddleware, validateObjectId("postId"), getPost);
router.get("/user/:userId", authMiddleware, validateObjectId("userId"), getPostsByUserId);
router.put("/:postId", authMiddleware, validateObjectId("postId"), updatePost);
router.delete("/:postId", authMiddleware, validateObjectId("postId"), deletePost);

export default router;

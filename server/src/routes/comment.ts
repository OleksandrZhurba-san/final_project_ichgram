import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { createComment, deleteComment, getAllCommentsByPostId } from "../controllers/comment";
import validateObjectId from "../middlewares/validateId";

const router: Router = Router();
router.get("/:postId", authMiddleware, validateObjectId("postId"), getAllCommentsByPostId);
router.post("/:postId", authMiddleware, validateObjectId("postId"), createComment);
router.delete("/:commentId", authMiddleware, validateObjectId("commentId"), deleteComment);

export default router;

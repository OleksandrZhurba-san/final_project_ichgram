import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { createComment, deleteComment } from "../controllers/comment";

const router: Router = Router();

router.post("/:postId", authMiddleware, createComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;

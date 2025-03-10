import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { likePost, unlikePost } from "../controllers/like";

const router: Router = Router();

router.post("/:postId", authMiddleware, likePost);
router.delete("/:postId", authMiddleware, unlikePost);

export default router;

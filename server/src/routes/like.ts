import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { likePost, unlikePost } from "../controllers/like";
import validateObjectId from "../middlewares/validateId";

const router: Router = Router();

router.post("/:postId", authMiddleware, validateObjectId("postId"), likePost);
router.delete("/:postId", authMiddleware, validateObjectId("postId"), unlikePost);

export default router;

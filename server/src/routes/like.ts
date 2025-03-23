import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getLikesByPost, likePost, toggleLike, unlikePost } from "../controllers/like";
import validateObjectId from "../middlewares/validateId";

const router: Router = Router();

router.post("/:postId", authMiddleware, validateObjectId("postId"), likePost);
router.delete("/:postId", authMiddleware, validateObjectId("postId"), unlikePost);
router.post("/toggle/:postId", authMiddleware, validateObjectId("postId"), toggleLike)
router.get("/:postId", authMiddleware, validateObjectId("postId"), getLikesByPost)

export default router;

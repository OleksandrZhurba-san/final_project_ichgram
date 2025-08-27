import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import validateObjectId from "../middlewares/validateId";
import { follow, getUserFollowers, getUserFollowing, unfollow } from "../controllers/follow";

const router: Router = Router();

router.post(
  "/:id",
  authMiddleware,
  validateObjectId("id"),
  follow
);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId("id"),
  unfollow
);
router.get(
  "/followers/:id",
  authMiddleware,
  validateObjectId("id"),
  getUserFollowers
);
router.get(
  "/following/:id",
  authMiddleware,
  validateObjectId("id"),
  getUserFollowing
);

export default router;

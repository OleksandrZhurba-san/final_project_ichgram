import { Router } from "express";
import { getUserProfile, updateUserProfile, updateUserProfilePicture } from "../controllers/user";
import authMiddleware from "../middlewares/authMiddleware";
import validateObjectId from "../middlewares/validateId";

const router: Router = Router();

router.get("/:id", authMiddleware, validateObjectId("id"), getUserProfile);
router.put("/update", authMiddleware, updateUserProfilePicture, updateUserProfile);

export default router;

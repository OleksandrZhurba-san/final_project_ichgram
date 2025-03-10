import { Router } from "express";
import { getUserProfile } from "../controllers/user";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = Router();

router.get("/:id", authMiddleware, getUserProfile);

export default router;

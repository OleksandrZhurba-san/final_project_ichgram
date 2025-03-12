import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { postSearch, userSearch } from "../controllers/search";

const router: Router = Router();

router.get("/users", authMiddleware, userSearch);
router.get("/posts", authMiddleware, postSearch);

export default router;

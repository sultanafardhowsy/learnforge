import { Router } from "express";
import { login, me } from "../controllers/auth.controller";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validators";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", requireAdmin, me);

export default router;

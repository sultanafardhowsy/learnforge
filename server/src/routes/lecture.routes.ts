import { Router } from "express";
import { deleteLecture, getLecture, updateLecture } from "../controllers/lecture.controller";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { lectureUpdateSchema } from "../validators";

const router = Router();

router.get("/:id", getLecture);
router.put("/:id", requireAdmin, validate(lectureUpdateSchema), updateLecture);
router.delete("/:id", requireAdmin, deleteLecture);

export default router;

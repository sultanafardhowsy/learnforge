import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getStats,
  listCourses,
  updateCourse,
} from "../controllers/course.controller";
import { createLecture, listLectures } from "../controllers/lecture.controller";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { courseSchema, courseUpdateSchema, lectureSchema } from "../validators";

const router = Router();

// Public (student panel)
router.get("/", listCourses);
router.get("/stats", requireAdmin, getStats);
router.get("/:id", getCourse);
router.get("/:courseId/lectures", listLectures);

// Admin only
router.post("/", requireAdmin, validate(courseSchema), createCourse);
router.put("/:id", requireAdmin, validate(courseUpdateSchema), updateCourse);
router.delete("/:id", requireAdmin, deleteCourse);
router.post("/:courseId/lectures", requireAdmin, validate(lectureSchema), createLecture);

export default router;

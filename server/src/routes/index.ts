import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import lectureRoutes from "./lecture.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ success: true, message: "OK" }));
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/lectures", lectureRoutes);

export default router;

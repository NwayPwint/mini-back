import { Router } from "express";
import { protect, optionalProtect } from "../middlewares/authMiddleware";
import {
  enrollInCourse,
  getCourseBySlug,
  unEnrollInCourse,
  updateProgress,
} from "../controllers/courseController";

const router = Router();
router.get("/:slug", optionalProtect, getCourseBySlug);
router.post("/enroll/:slug", protect, enrollInCourse);
router.post("/unenroll/:slug", protect, unEnrollInCourse);
router.patch("/progress/:enrollmentId", protect, updateProgress);

export default router;

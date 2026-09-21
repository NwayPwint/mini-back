import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/restrictTo";
import { createCourseSchema } from "../validators/admin/courseValidator";
import { validate } from "../middlewares/validate";
import {
  createCourse,
  getCourses,
} from "../controllers/admin/courseController";

const router = Router();
router.use(protect);
router.use(restrictTo("ADMIN"));
router.get("/courses", getCourses);
router.post("/courses", validate(createCourseSchema), createCourse);
export default router;

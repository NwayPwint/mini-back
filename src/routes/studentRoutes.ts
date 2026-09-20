import { Router } from "express";
import {
  getCertificates,
  getMyCourses,
  getSavedCourses,
  getStudentDashboard,
  saveCourse,
  unsaveCourse,
} from "../controllers/studentController";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/restrictTo";
const router = Router();
router.use(protect);
router.use(restrictTo("STUDENT"));

router.get("/dashboard", getStudentDashboard);
router.get("/my-courses", getMyCourses);
router.get("/my-certificates", getCertificates);
router.get("/my-saved-courses", getSavedCourses);
router.post("/save/course/:courseId", saveCourse);
router.delete("/unsave/course/:courseId", unsaveCourse);
export default router;

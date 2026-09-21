import { Router } from "express";
import {
  getCertificates,
  getCourseClassroom,
  getMyCourses,
  getSavedCourses,
  getStudentDashboard,
  saveCourse,
  unsaveCourse,
  updateLessonProgress,
} from "../controllers/studentController";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/restrictTo";
const router = Router();
router.use(protect);
router.use(restrictTo("STUDENT"));

router.get("/dashboard", getStudentDashboard);
router.get("/my-courses", getMyCourses);
router.get("/courses/:slug/classroom", getCourseClassroom);
router.get("/my-certificates", getCertificates);
router.get("/my-saved-courses", getSavedCourses);
router.patch("/lessons/:lessonId/progress", updateLessonProgress);
router.post("/save/course/:courseId", saveCourse);
router.delete("/unsave/course/:courseId", unsaveCourse);
export default router;

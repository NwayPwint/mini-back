import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/restrictTo";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validators/admin/courseValidator";
import { validate } from "../middlewares/validate";
import {
  createCourse,
  deleteCourse,
  getCourseBySlug,
  getCourses,
  togglePublish,
  updateCourse,
} from "../controllers/admin/courseController";
import {
  createModule,
  deleteModule,
  updateModule,
} from "../controllers/admin/moduleController";
import {
  createModuleSchema,
  updateModuleSchema,
} from "../validators/admin/moduleValidator";
import {
  createLesson,
  deleteLesson,
  updateLesson,
} from "../controllers/admin/lessonController";
import {
  createLessonSchema,
  updateLessonSchema,
} from "../validators/admin/lessonValidator";
import { getDashboardStats } from "../controllers/admin/statsController";
import { getUsers, updateUserRole } from "../controllers/admin/userController";
import { updateUserRoleSchema } from "../validators/admin/userValidator";

const router = Router();
router.use(protect);
router.use(restrictTo("ADMIN"));

// courses routes
router.get("/courses", getCourses);
router.post("/courses", validate(createCourseSchema), createCourse);
router.delete("/courses/:slug", deleteCourse);
router.get("/courses/:slug", getCourseBySlug);
router.patch("/courses/:slug", validate(updateCourseSchema), updateCourse);
router.patch("/courses/:slug/toggle-publish", togglePublish);

// module routes
router.post(
  "/courses/:courseId/modules",
  validate(createModuleSchema),
  createModule,
);
router.patch(
  "/courses/:courseId/modules/:moduleId",
  validate(updateModuleSchema),
  updateModule,
);
router.delete("/courses/:courseId/modules/:moduleId", deleteModule);

// lesson routes
router.post(
  "/courses/:courseId/modules/:moduleId/lessons",
  validate(createLessonSchema),
  createLesson,
);
router.patch(
  "/courses/:courseId/modules/:moduleId/lessons/:lessonId",
  validate(updateLessonSchema),
  updateLesson,
);
router.delete(
  "/courses/:courseId/modules/:moduleId/lessons/:lessonId",
  deleteLesson,
);

// stats routes
router.get("/dashboard/stats", getDashboardStats);

// user routes
router.get("/users", getUsers);
router.patch("/users/:userId/role", validate(updateUserRoleSchema), updateUserRole);

export default router;

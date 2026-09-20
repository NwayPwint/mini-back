"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const restrictTo_1 = require("../middlewares/restrictTo");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.use((0, restrictTo_1.restrictTo)("STUDENT"));
router.get("/dashboard", studentController_1.getStudentDashboard);
router.get("/my-courses", studentController_1.getMyCourses);
router.get("/my-certificates", studentController_1.getCertificates);
router.get("/my-saved-courses", studentController_1.getSavedCourses);
router.post("/save/course/:courseId", studentController_1.saveCourse);
router.delete("/unsave/course/:courseId", studentController_1.unsaveCourse);
exports.default = router;
//# sourceMappingURL=studentRoutes.js.map
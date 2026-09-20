"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveCourse = exports.saveCourse = exports.getSavedCourses = exports.getCertificates = exports.getMyCourses = exports.getStudentDashboard = void 0;
const appError_1 = require("../utils/appError");
const studentService_1 = require("../services/studentService");
const catchAsync_1 = require("../utils/catchAsync");
const appResponse_1 = require("../utils/appResponse");
exports.getStudentDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const result = await (0, studentService_1.getStudentDashboardService)(userId);
    (0, appResponse_1.sendResponse)(res, 200, "Fetched student dashboard successfylly", result);
});
exports.getMyCourses = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?.id;
    const { status, q } = req.query;
    const myCourses = await (0, studentService_1.getMyCoursesService)({
        userId,
        status: status,
        q: q,
    });
    res.status(200).json({
        success: true,
        message: "Fetch my courses successfully",
        data: myCourses,
    });
});
exports.getCertificates = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?.id;
    const certificates = await (0, studentService_1.getCertificatesService)(userId);
    res.status(200).json({
        success: true,
        message: "Fetch certificates successfully",
        data: certificates,
    });
});
exports.getSavedCourses = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?.id;
    const savedCourses = await (0, studentService_1.getSavedCoursesService)(userId);
    res.status(200).json({
        success: true,
        message: "Fetch courses successfully",
        data: savedCourses,
    });
});
exports.saveCourse = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?.id;
    const { courseId } = req.params;
    const savedCourse = await (0, studentService_1.saveCourseService)(userId, courseId);
    res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: savedCourse,
    });
});
exports.unsaveCourse = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?.id;
    const { courseId } = req.params;
    await (0, studentService_1.unsaveCourseService)(userId, courseId);
    res.status(200).json({
        success: true,
        message: "Course removed from saved",
        data: null,
    });
});
//# sourceMappingURL=studentController.js.map
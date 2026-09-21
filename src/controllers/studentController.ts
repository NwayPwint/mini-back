import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

import {
  getCertificatesService,
  getCourseClassroomService,
  getMyCoursesService,
  getSavedCoursesService,
  getStudentDashboardService,
  saveCourseService,
  unsaveCourseService,
  updateLessonProgressService,
} from "../services/studentService";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { sendResponse } from "../utils/appResponse";
import { EnrollmentStatus } from "@prisma/client";

export const getStudentDashboard = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }
    const result = await getStudentDashboardService(userId);
    sendResponse(res, 200, "Fetched student dashboard successfylly", result);
  },
);

export const getMyCourses = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id!;
    const { status, q } = req.query;

    const myCourses = await getMyCoursesService({
      userId,
      status: status as EnrollmentStatus | undefined,
      q: q as string | undefined,
    });

    res.status(200).json({
      success: true,
      message: "Fetch my courses successfully",
      data: myCourses,
    });
  },
);

export const getCertificates = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id!;
    const certificates = await getCertificatesService(userId);
    res.status(200).json({
      success: true,
      message: "Fetch certificates successfully",
      data: certificates,
    });
  },
);

export const getSavedCourses = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id!;
    const savedCourses = await getSavedCoursesService(userId);
    res.status(200).json({
      success: true,
      message: "Fetch courses successfully",
      data: savedCourses,
    });
  },
);

export const saveCourse = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id!;
    const { courseId } = req.params;

    const savedCourse = await saveCourseService(userId, courseId as string);

    res.status(201).json({
      success: true,
      message: "Course saved successfully",
      data: savedCourse,
    });
  },
);

export const unsaveCourse = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { courseId } = req.params;

    await unsaveCourseService(userId as string, courseId as string);

    res.status(200).json({
      success: true,
      message: "Course removed from saved",
      data: null,
    });
  },
);

export const getCourseClassroom = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const { slug } = req.params;

    const classroomData = await getCourseClassroomService(
      slug as string,
      userId,
    );
    sendResponse(res, 200, "Fetch course classoom successfully", classroomData);
  },
);

export const updateLessonProgress = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 404);
    }

    const { lessonId } = req.params;
    const { watchedSec, isCompleted } = req.body;

    if (typeof watchedSec !== "number" || watchedSec < 0) {
      throw new AppError("A valid watchedSec (number >=0) is required", 400);
    }

    const result = await updateLessonProgressService(
      userId,
      lessonId as string,
      watchedSec,
      isCompleted,
    );

    sendResponse(res, 200, "Lesson progress updated successfully", result);
  },
);

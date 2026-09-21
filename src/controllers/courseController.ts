import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/appResponse";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  enrollInCourseService,
  getCourseBySlugService,
  unenrollInCourseService,
  updateProgressService,
} from "../services/courseService";
import { Response } from "express";
import { AppError } from "../utils/appError";

export const getCourseBySlug = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { slug } = req.params;
    const userId = req.user?.id;

    const course = await getCourseBySlugService(slug as string, userId);

    sendResponse(res, 200, "Course fetched successfully", course);
  },
);

export const enrollInCourse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { slug } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const result = await enrollInCourseService(
      slug as string,
      userId as string,
    );
    sendResponse(res, 200, "Enroll successfully", result);
  },
);

export const unEnrollInCourse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { slug } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const result = await unenrollInCourseService(slug as string, userId);
    sendResponse(res, 200, "Cancel enrollment successfully", result);
  },
);

export const updateProgress = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const result = await updateProgressService(
      userId,
      enrollmentId as string,
      Number(progress),
    );

    sendResponse(res, 200, "Update progress successfully", result);
  },
);

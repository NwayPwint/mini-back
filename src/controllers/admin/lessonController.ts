import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import {
  createLessonService,
  deleteLessonService,
  updateLessonService,
} from "../../services/admin/lessonService";
import { sendResponse } from "../../utils/appResponse";

export const createLesson = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { moduleId, courseId } = req.params;
    if (!user) throw new AppError("Unauthorized access", 404);
    const lesson = await createLessonService(
      courseId as string,
      moduleId as string,
      req.body,
    );
    sendResponse(res, 201, "Lesson created successfully", lesson);
  },
);

export const updateLesson = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { courseId, moduleId, lessonId } = req.params;
    if (!user) throw new AppError("Unauthorized access", 401);

    const updatedLesson = await updateLessonService(
      courseId as string,
      moduleId as string,
      lessonId as string,
      req.body,
    );
    sendResponse(res, 200, "Lesson updated successfully", updatedLesson);
  },
);

export const deleteLesson = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { courseId, moduleId, lessonId } = req.params;
    if (!user) throw new AppError("Unauthorized access", 401);

    const deletedLesson = await deleteLessonService(
      courseId as string,
      moduleId as string,
      lessonId as string,
    );
    sendResponse(res, 200, "Lesson deleted successfully", deleteLesson);
  },
);

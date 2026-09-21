import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import {
  createCourseService,
  getCourseService,
} from "../../services/admin/courseService";
import { AppError } from "../../utils/appError";
import { sendResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { PAGINATION } from "../../config/constant";

//  course crud
export const getCourses = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user?.id;
    if (!user) {
      throw new AppError("Unauthorized access", 401);
    }

    const page = Number(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT;

    const courses = await getCourseService(page, limit);
    sendResponse(res, 200, "Courses fetch successfully", courses);
  },
);

export const createCourse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const createdById = req.user?.id;
    const data = req.body;

    if (!createdById) {
      throw new AppError("Unauthorized access", 401);
    }

    const newCourse = await createCourseService(data, createdById);

    sendResponse(res, 201, "Course created successfully", newCourse);
  },
);

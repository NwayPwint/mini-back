import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import {
  createCourseService,
  deleteCourseService,
  getCoursesService,
  getCourseBySlugService,
  togglePublishService,
  updateCourseService,
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

    const courses = await getCoursesService(page, limit);
    sendResponse(res, 200, "Courses fetch successfully", courses);
  },
);

export const getCourseBySlug = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { slug } = req.params;
    if (!user) {
      throw new AppError("Unauthorized access", 401);
    }

    const course = await getCourseBySlugService(slug as string);
    sendResponse(res, 200, "Course fetched successfully", course);
  },
);

export const togglePublish = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { slug } = req.params;
    if (!user) {
      throw new AppError("Unauthorized access", 401);
    }

    const course = await togglePublishService(slug as string);
    const statusMessage = course.published
      ? "Course published successfully"
      : "Course unpublished successfully";

    sendResponse(res, 200, statusMessage, course);
  },
);

export const updateCourse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { slug } = req.params;
    if (!user) {
      throw new AppError("Unauthorized access", 401);
    }

    const updatedCourse = await updateCourseService(slug as string, req.body);
    sendResponse(res, 200, "Course updated successfully", updatedCourse);
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

export const deleteCourse = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { slug } = req.params;
    if (!user) {
      throw new AppError("Unauthorized access", 401);
    }

    const deletedCourse = await deleteCourseService(slug as string);
    sendResponse(res, 200, "Course deleted sucessfully", deletedCourse);
  },
);

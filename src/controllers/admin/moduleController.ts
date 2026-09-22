import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import {
  createModuleService,
  deleteModuleService,
  updateModuleService,
} from "../../services/admin/moduleService";
import { AppError } from "../../utils/appError";
import { sendResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { Response } from "express";

export const createModule = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) throw new AppError("Unauthorized access", 401);

    const { courseId } = req.params;

    const createdModule = await createModuleService(
      courseId as string,
      req.body,
    );

    sendResponse(res, 201, "Module created successfully", createdModule);
  },
);

export const updateModule = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) throw new AppError("Unauthorized access", 401);

    const { courseId, moduleId } = req.params;

    const updatedModule = await updateModuleService(
      courseId as string,
      moduleId as string,
      req.body,
    );

    sendResponse(res, 200, "Module updated successfully", updatedModule);
  },
);

export const deleteModule = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) throw new AppError("Unauthorized access", 401);

    const { courseId, moduleId } = req.params;

    const deletedModule = await deleteModuleService(
      courseId as string,
      moduleId as string,
    );
    sendResponse(res, 200, "Module deleted successfully", deletedModule);
  },
);

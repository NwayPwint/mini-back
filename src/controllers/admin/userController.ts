import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import {
  getUsersService,
  updateUserRoleService,
} from "../../services/admin/userService";
import { sendResponse } from "../../utils/appResponse";
import { Role } from "@prisma/client";

export const getUsers = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit, role, q } = req.query;
    const filters = {
      role: role ? (role as Role) : undefined,
      q: q ? String(q) : undefined,
    };
    const user = req.user;
    if (!user) throw new AppError("Unauthorized access", 401);
    const users = await getUsersService(Number(page), Number(limit), filters);
    sendResponse(res, 200, "Fetch user successfully", users);
  },
);

export const updateUserRole = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params;
    const current_user = req.user;
    if (!current_user) throw new AppError("Unauthorized access", 401);
    if (current_user.id === userId)
      throw new AppError("You cannot change your own role", 400);

    const updatedUser = await updateUserRoleService(userId as string, req.body);
    sendResponse(res, 200, "Updated user role successfully", updatedUser);
  },
);

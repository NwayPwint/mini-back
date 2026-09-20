import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  getMeService,
  updateProfileService,
  changePasswordService,
} from "../services/authService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/appResponse";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const register = catchAsync(async (req: Request, res: Response) => {
  const newUser = await registerService(req.body);
  sendResponse(res, 201, "User registered successfully", newUser);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const user = await loginService(req.body);
  sendResponse(res, 200, "User login successfully", user);
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    sendResponse(res, 200, result.message);
  },
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await resetPasswordService(req.body);
  sendResponse(res, 200, result.message);
});

export const getMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }
    const user = await getMeService(userId);
    sendResponse(res, 200, "User profile fetched successfully", user);
  },
);

export const updateProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }
    const updatedUser = await updateProfileService(userId, req.body);
    sendResponse(res, 200, "User profile updated successfully", updatedUser);
  },
);

export const changePassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    await changePasswordService(userId, req.body);

    sendResponse(res, 200, "Password updated successfully");
  },
);

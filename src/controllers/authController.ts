import { Request, Response } from "express";
import {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/appResponse";

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
    await forgotPasswordService(email);
    sendResponse(res, 200, "Password reset email sent successfully");
  },
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const result = await resetPasswordService(req.body);
    sendResponse(res, 200, result.message);
  },
);

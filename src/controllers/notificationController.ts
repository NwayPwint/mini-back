import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  getNotificationsService,
  getPreferencesService,
  getUnreadCountService,
  markNotificationReadService,
  markAllNotificationsReadService,
  updatePreferencesService,
} from "../services/notificationService";
import { AppError } from "../utils/appError";
import { sendResponse } from "../utils/appResponse";

export const getPreferences = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }
    const preferences = await getPreferencesService(userId);
    sendResponse(
      res,
      200,
      "Notification preferences retrieved successfully",
      preferences,
    );
  },
);

export const updatePreferences = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }
    const preferences = await updatePreferencesService(userId, req.body);
    sendResponse(
      res,
      200,
      "Notification preferences updated successfully",
      preferences,
    );
  },
);

export const getUnreadCount = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }
    const unreadCount = await getUnreadCountService(userId);
    sendResponse(res, 200, "Unread count retrieved successfully", {
      unreadCount,
    });
  },
);

export const getNotifications = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getNotificationsService(userId, page, limit);
    sendResponse(res, 200, "Notification retrieved successfully", result);
  },
);

export const markRead = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    const id = req.params.id as string;
    const notification = await markNotificationReadService(userId, id);
    sendResponse(
      res,
      200,
      "Notification marked as read successfully",
      notification,
    );
  },
);

export const markAllRead = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized access", 401);
    }

    await markAllNotificationsReadService(userId);

    sendResponse(
      res,
      200,
      "All notifications marked as read successfully",
      null,
    );
  },
);

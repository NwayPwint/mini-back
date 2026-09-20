"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllRead = exports.markRead = exports.getNotifications = exports.getUnreadCount = exports.updatePreferences = exports.getPreferences = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const notificationService_1 = require("../services/notificationService");
const appError_1 = require("../utils/appError");
const appResponse_1 = require("../utils/appResponse");
exports.getPreferences = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const preferences = await (0, notificationService_1.getPreferencesService)(userId);
    (0, appResponse_1.sendResponse)(res, 200, "Notification preferences retrieved successfully", preferences);
});
exports.updatePreferences = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const preferences = await (0, notificationService_1.updatePreferencesService)(userId, req.body);
    (0, appResponse_1.sendResponse)(res, 200, "Notification preferences updated successfully", preferences);
});
exports.getUnreadCount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const unreadCount = await (0, notificationService_1.getUnreadCountService)(userId);
    (0, appResponse_1.sendResponse)(res, 200, "Unread count retrieved successfully", {
        unreadCount,
    });
});
exports.getNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await (0, notificationService_1.getNotificationsService)(userId, page, limit);
    (0, appResponse_1.sendResponse)(res, 200, "Notification retrieved successfully", result);
});
exports.markRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const id = req.params.id;
    const notification = await (0, notificationService_1.markNotificationReadService)(userId, id);
    (0, appResponse_1.sendResponse)(res, 200, "Notification marked as read successfully", notification);
});
exports.markAllRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req?.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    await (0, notificationService_1.markAllNotificationsReadService)(userId);
    (0, appResponse_1.sendResponse)(res, 200, "All notifications marked as read successfully", null);
});
//# sourceMappingURL=notificationController.js.map
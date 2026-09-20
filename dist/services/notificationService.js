"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationService = exports.markAllNotificationsReadService = exports.markNotificationReadService = exports.getNotificationsService = exports.getUnreadCountService = exports.updatePreferencesService = exports.getPreferencesService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const appError_1 = require("../utils/appError");
const getPreferencesService = async (userId) => {
    return await prisma_1.default.notificationPreference.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });
};
exports.getPreferencesService = getPreferencesService;
const updatePreferencesService = async (userId, data) => {
    return await prisma_1.default.notificationPreference.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data },
    });
};
exports.updatePreferencesService = updatePreferencesService;
const getUnreadCountService = async (userId) => {
    return await prisma_1.default.notification.count({
        where: { userId, isRead: false },
    });
};
exports.getUnreadCountService = getUnreadCountService;
const getNotificationsService = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
        prisma_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.default.notification.count({ where: { userId } }),
    ]);
    return {
        notifications,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getNotificationsService = getNotificationsService;
const markNotificationReadService = async (userId, id) => {
    const notification = await prisma_1.default.notification.findFirst({
        where: { id, userId },
    });
    if (!notification) {
        throw new appError_1.AppError("Notification not found", 404);
    }
    return await prisma_1.default.notification.update({
        where: { id },
        data: { isRead: true },
    });
};
exports.markNotificationReadService = markNotificationReadService;
const markAllNotificationsReadService = async (userId) => {
    return await prisma_1.default.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
};
exports.markAllNotificationsReadService = markAllNotificationsReadService;
const createNotificationService = async (userId, type, title, message, link) => {
    return await prisma_1.default.notification.create({
        data: { userId, type, title, message, link },
    });
};
exports.createNotificationService = createNotificationService;
//# sourceMappingURL=notificationService.js.map
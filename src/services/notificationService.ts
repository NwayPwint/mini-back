import { NotificationType } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../utils/appError";
import { UpdatePreferencesInput } from "../validators/notificationValidator";

export const getPreferencesService = async (userId: string) => {
  return await prisma.notificationPreference.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
};

export const updatePreferencesService = async (
  userId: string,
  data: UpdatePreferencesInput,
) => {
  return await prisma.notificationPreference.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

export const getUnreadCountService = async (userId: string) => {
  return await prisma.notification.count({
    where: { userId, isRead: false },
  });
};

export const getNotificationsService = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
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

export const markNotificationReadService = async (
  userId: string,
  id: string,
) => {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });
  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

export const markAllNotificationsReadService = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const createNotificationService = async (
  userId: string,
  type: NotificationType,
  title: string,
  message?: string,
  link?: string,
) => {
  return await prisma.notification.create({
    data: { userId, type, title, message, link },
  });
};

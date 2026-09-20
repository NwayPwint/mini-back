import { NotificationType } from "@prisma/client";
import { UpdatePreferencesInput } from "../validators/notificationValidator";
export declare const getPreferencesService: (userId: string) => Promise<{
    id: string;
    userId: string;
    weeklyDigest: boolean;
    courseReminders: boolean;
    announcements: boolean;
    certificateAlerts: boolean;
}>;
export declare const updatePreferencesService: (userId: string, data: UpdatePreferencesInput) => Promise<{
    id: string;
    userId: string;
    weeklyDigest: boolean;
    courseReminders: boolean;
    announcements: boolean;
    certificateAlerts: boolean;
}>;
export declare const getUnreadCountService: (userId: string) => Promise<number>;
export declare const getNotificationsService: (userId: string, page?: number, limit?: number) => Promise<{
    notifications: {
        id: string;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string | null;
        link: string | null;
        isRead: boolean;
        createdAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const markNotificationReadService: (userId: string, id: string) => Promise<{
    id: string;
    userId: string;
    type: import(".prisma/client").$Enums.NotificationType;
    title: string;
    message: string | null;
    link: string | null;
    isRead: boolean;
    createdAt: Date;
}>;
export declare const markAllNotificationsReadService: (userId: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const createNotificationService: (userId: string, type: NotificationType, title: string, message?: string, link?: string) => Promise<{
    id: string;
    userId: string;
    type: import(".prisma/client").$Enums.NotificationType;
    title: string;
    message: string | null;
    link: string | null;
    isRead: boolean;
    createdAt: Date;
}>;
//# sourceMappingURL=notificationService.d.ts.map
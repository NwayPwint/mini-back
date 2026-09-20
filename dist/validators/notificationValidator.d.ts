import { z } from "zod";
export declare const updatePreferencesSchema: z.ZodObject<{
    weeklyDigest: z.ZodOptional<z.ZodBoolean>;
    courseReminders: z.ZodOptional<z.ZodBoolean>;
    announcements: z.ZodOptional<z.ZodBoolean>;
    certificateAlerts: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
//# sourceMappingURL=notificationValidator.d.ts.map
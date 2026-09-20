import { z } from "zod";

export const updatePreferencesSchema = z.object({
  weeklyDigest: z.boolean().optional(),
  courseReminders: z.boolean().optional(),
  announcements: z.boolean().optional(),
  certificateAlerts: z.boolean().optional(),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

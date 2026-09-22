import { z } from "zod";

export const createLessonSchema = z.object({
  title: z
    .string()
    .min(3, "Lesson title must be at least 3 characters long"),
  durationMinutes: z
    .number()
    .int("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute"),
  videoUrl: z
    .string()
    .url("Invalid video URL format")
    .optional()
    .or(z.literal("")),
  isFreePreview: z.boolean().optional().default(false),
  order: z.number().int().min(1, "Order must be at least 1").optional(),
});

export const updateLessonSchema = z.object({
  title: z.string().min(3, "Lesson title must be at least 3 characters long").optional(),
  durationMinutes: z.number().int().min(1, "Duration must be at least 1 minute").optional(),
  videoUrl: z.string().url("Invalid video URL format").optional().or(z.literal("")),
  isFreePreview: z.boolean().optional(),
  order: z.number().int().min(1, "Order must be at least 1").optional(),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
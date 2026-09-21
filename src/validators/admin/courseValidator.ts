import { z } from "zod";
import { CourseLevel } from "@prisma/client";

export const createCourseSchema = z.object({
  title: z.string().min(3, "Course title must be at least 3 characters long"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  description: z.string().optional(),
  instructorName: z.string(),
  level: z.nativeEnum(CourseLevel).optional(),
  published: z.boolean().default(false),
  learningOutcomes: z.array(z.string()).default([]),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Course title must be at least 3 characters long")
    .optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    )
    .optional(),
  description: z.string().optional(),
  instructorName: z.string().optional(),
  level: z.nativeEnum(CourseLevel).optional(),
  published: z.boolean().optional(),
  learningOutcomes: z.array(z.string()).optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

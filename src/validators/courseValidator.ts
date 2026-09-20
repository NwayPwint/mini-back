import { z } from "zod";

export const enrollCourseSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Course slug is required"),
  }),
});

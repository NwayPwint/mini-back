import { z } from "zod";

export const createModuleSchema = z.object({
  title: z.string().min(3, "Module title must be at least 3 characters long"),
  order: z.number().int().min(1).optional(),
});

export const updateModuleSchema = z.object({
  title: z.string().min(3).optional(),
  order: z.number().int().min(1).optional(),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

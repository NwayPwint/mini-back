import { z } from "zod";
import { Role } from "@prisma/client";

export const updateUserRoleSchema = z.object({
  role: z.enum(Role),
});

export type UpdatedUserRoleInput = z.infer<typeof updateUserRoleSchema>;

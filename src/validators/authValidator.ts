import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address format"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.string().email("Invalid email address format").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  weeklyTargetHours: z.number().int().min(1).max(168).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation password do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

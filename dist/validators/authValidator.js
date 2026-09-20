"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address format"),
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address format"),
    password: zod_1.z.string(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address format"),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long").optional(),
    email: zod_1.z.string().email("Invalid email address format").optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    weeklyTargetHours: zod_1.z.number().int().min(1).max(168).optional(),
});
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z
        .string()
        .min(6, "New password must be at least 6 characters long"),
    confirmPassword: zod_1.z.string().min(1, "Please confirm your new password"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation password do not match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=authValidator.js.map
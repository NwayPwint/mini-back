"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = exports.updateProfileService = exports.getMeService = exports.resetPasswordService = exports.forgotPasswordService = exports.loginService = exports.registerService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const appError_1 = require("../utils/appError");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../utils/sendEmail");
const excludePassword_1 = require("../utils/excludePassword");
const registerService = async (data) => {
    const { email, name, password } = data;
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new appError_1.AppError("Email is already registered", 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = await prisma_1.default.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: client_1.Role.STUDENT,
            passwordChangedAt: new Date()
        },
    });
    return (0, excludePassword_1.excludePassword)(newUser);
};
exports.registerService = registerService;
const loginService = async (data) => {
    const { email, password } = data;
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new appError_1.AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new appError_1.AppError("Invalid email or password", 401);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new appError_1.AppError("JWT_SECRET environment variable is not set", 500);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, jwtSecret, {
        expiresIn: "1d",
    });
    return {
        user: (0, excludePassword_1.excludePassword)(user),
        token,
    };
};
exports.loginService = loginService;
const forgotPasswordService = async (email) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        return { message: "If this email exists, a reset link has been sent." };
    }
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await prisma_1.default.user.update({
        where: { email },
        data: { passwordResetToken, passwordResetExpires },
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    await (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Reset Your Password - LMS",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="color: #0f172a;">Reset Your Password</h2>
        <p>You requested a password reset for your LMS account. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Reset Password</a>
        <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    });
    return { message: "If this email exists, a reset link has been sent." };
};
exports.forgotPasswordService = forgotPasswordService;
const resetPasswordService = async (data) => {
    const { token, password } = data;
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await prisma_1.default.user.findFirst({
        where: {
            passwordResetToken: hashedToken,
            passwordResetExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new appError_1.AppError("Token is invalid or has expired", 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
            passwordChangedAt: new Date()
        },
    });
    return { message: "Password has been reset successfully" };
};
exports.resetPasswordService = resetPasswordService;
const getMeService = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new appError_1.AppError("User not found", 404);
    }
    return (0, excludePassword_1.excludePassword)(user);
};
exports.getMeService = getMeService;
const updateProfileService = async (userId, data) => {
    try {
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data,
        });
        return (0, excludePassword_1.excludePassword)(updatedUser);
    }
    catch (error) {
        throw new appError_1.AppError("User not found or update failed", 404);
    }
};
exports.updateProfileService = updateProfileService;
const changePasswordService = async (userId, data) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new appError_1.AppError("User not found", 404);
    }
    const isCurrentPasswordCorrect = await bcrypt_1.default.compare(data.currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
        throw new appError_1.AppError("Incorrect current password", 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.newPassword, 10);
    await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
            passwordChangedAt: new Date()
        },
    });
    return { message: "Password changed successfully" };
};
exports.changePasswordService = changePasswordService;
//# sourceMappingURL=authService.js.map
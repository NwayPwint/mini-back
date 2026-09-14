import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { RegisterInput, LoginInput, ResetPasswordInput } from "../validators/authValidator";
import { AppError } from "../utils/appError";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { excludePassword } from "../utils/excludePassword";

export const registerService = async (data: RegisterInput) => {
  const { email, name, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: Role.STUDENT,
    },
  });

  return excludePassword(newUser);
};

export const loginService = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppError("JWT_SECRET environment variable is not set", 500);
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    jwtSecret,
    { expiresIn: "1d" },
  );

  return {
    user: excludePassword(user),
    token,
  };
};

export const forgotPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "If this email exists, a reset link has been sent." };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { passwordResetToken, passwordResetExpires },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

  await sendEmail({
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

export const resetPasswordService = async (data: ResetPasswordInput) => {
  const { token, password } = data;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { message: "Password has been reset successfully" };
};

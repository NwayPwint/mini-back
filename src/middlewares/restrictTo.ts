import { Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../utils/appError";
import { AuthenticatedRequest } from "./authMiddleware";

export const restrictTo = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      throw new AppError(
        "You do not have permission to perform this action",
        403
      );
    }

    next();
  };
};
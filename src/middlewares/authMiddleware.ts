import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  let token: string | undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError(
      "You are not loggend in! Please log in to get access.",
      401,
    );
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("Jwt secret is not defined", 500);
  }

  const decoded = jwt.verify(token, jwtSecret) as {
    userId: string;
    role: string;
  };

  req.user = {
    id: decoded.userId,
    role: decoded.role,
  };

  next();
};

export const optionalProtect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      role: string;
    };

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
  } catch (error) {
    req.user = undefined;
  }

  next();
};

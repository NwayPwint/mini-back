import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    stack: process.env.ENV === "development" ? err.stack : undefined,
  });
};

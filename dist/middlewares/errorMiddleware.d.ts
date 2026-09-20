import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
export declare const errorMiddleware: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorMiddleware.d.ts.map
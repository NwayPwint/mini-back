import { Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "./authMiddleware";
export declare const restrictTo: (...allowedRoles: Role[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=restrictTo.d.ts.map
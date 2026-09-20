import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const protect: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=authMiddleware.d.ts.map
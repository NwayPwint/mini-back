import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { getAdminDashboardStatsService } from "../../services/admin/statsService";
import { AppError } from "../../utils/appError";
import { sendResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { Response } from "express";

export const getDashboardStats = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) throw new AppError("Unauthorized access", 401);

    const stats = await getAdminDashboardStatsService();
    sendResponse(res, 200, "Fetched stats successfully", stats);
  },
);

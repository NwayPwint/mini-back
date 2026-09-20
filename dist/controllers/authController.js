"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const appError_1 = require("../utils/appError");
const authService_1 = require("../services/authService");
const catchAsync_1 = require("../utils/catchAsync");
const appResponse_1 = require("../utils/appResponse");
exports.register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const newUser = await (0, authService_1.registerService)(req.body);
    (0, appResponse_1.sendResponse)(res, 201, "User registered successfully", newUser);
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await (0, authService_1.loginService)(req.body);
    (0, appResponse_1.sendResponse)(res, 200, "User login successfully", user);
});
exports.forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    const result = await (0, authService_1.forgotPasswordService)(email);
    (0, appResponse_1.sendResponse)(res, 200, result.message);
});
exports.resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, authService_1.resetPasswordService)(req.body);
    (0, appResponse_1.sendResponse)(res, 200, result.message);
});
exports.getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const user = await (0, authService_1.getMeService)(userId);
    (0, appResponse_1.sendResponse)(res, 200, "User profile fetched successfully", user);
});
exports.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    const updatedUser = await (0, authService_1.updateProfileService)(userId, req.body);
    (0, appResponse_1.sendResponse)(res, 200, "User profile updated successfully", updatedUser);
});
exports.changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("Unauthorized access", 401);
    }
    await (0, authService_1.changePasswordService)(userId, req.body);
    (0, appResponse_1.sendResponse)(res, 200, "Password updated successfully");
});
//# sourceMappingURL=authController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const appError_1 = require("../utils/appError");
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new appError_1.AppError("You are not logged in! Please log in to get access.", 401);
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new appError_1.AppError("You do not have permission to perform this action", 403);
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=restrictTo.js.map
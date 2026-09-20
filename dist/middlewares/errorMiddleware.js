"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const appError_1 = require("../utils/appError");
const errorMiddleware = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof appError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.message) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
        stack: process.env.ENV === "development" ? err.stack : undefined,
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map
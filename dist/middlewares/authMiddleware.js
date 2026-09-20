"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new appError_1.AppError("You are not loggend in! Please log in to get access.", 401);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new appError_1.AppError("Jwt secret is not defined", 500);
    }
    const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
    req.user = {
        id: decoded.userId,
        role: decoded.role,
    };
    next();
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map
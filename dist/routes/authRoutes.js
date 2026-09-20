"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validate_1 = require("../middlewares/validate");
const authValidator_1 = require("../validators/authValidator");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.validate)(authValidator_1.registerSchema), authController_1.register);
router.post("/login", (0, validate_1.validate)(authValidator_1.loginSchema), authController_1.login);
router.post("/forgot-password", (0, validate_1.validate)(authValidator_1.forgotPasswordSchema), authController_1.forgotPassword);
router.post("/reset-password", (0, validate_1.validate)(authValidator_1.resetPasswordSchema), authController_1.resetPassword);
router.get("/me", authMiddleware_1.protect, authController_1.getMe);
router.put("/profile", authMiddleware_1.protect, (0, validate_1.validate)(authValidator_1.updateProfileSchema), authController_1.updateProfile);
router.put("/change-password", authMiddleware_1.protect, (0, validate_1.validate)(authValidator_1.changePasswordSchema), authController_1.changePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map
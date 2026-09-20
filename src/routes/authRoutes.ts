import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/authValidator";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);

export default router;

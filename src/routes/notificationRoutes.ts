import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  getNotifications,
  getPreferences,
  getUnreadCount,
  markAllRead,
  markRead,
  updatePreferences,
} from "../controllers/notificationController";
import { validate } from "../middlewares/validate";
import { updatePreferencesSchema } from "../validators/notificationValidator";
const router = Router();
router.use(protect);

router.get("/preferences", getPreferences);
router.put(
  "/preferences",
  validate(updatePreferencesSchema),
  updatePreferences,
);
router.get("/unread-count", getUnreadCount);
router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markRead);
export default router;

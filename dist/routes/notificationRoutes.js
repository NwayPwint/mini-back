"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const notificationController_1 = require("../controllers/notificationController");
const validate_1 = require("../middlewares/validate");
const notificationValidator_1 = require("../validators/notificationValidator");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.get("/preferences", notificationController_1.getPreferences);
router.put("/preferences", (0, validate_1.validate)(notificationValidator_1.updatePreferencesSchema), notificationController_1.updatePreferences);
router.get("/unread-count", notificationController_1.getUnreadCount);
router.get("/", notificationController_1.getNotifications);
router.patch("/read-all", notificationController_1.markAllRead);
router.patch("/:id/read", notificationController_1.markRead);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map
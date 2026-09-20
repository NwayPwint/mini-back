"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferencesSchema = void 0;
const zod_1 = require("zod");
exports.updatePreferencesSchema = zod_1.z.object({
    weeklyDigest: zod_1.z.boolean().optional(),
    courseReminders: zod_1.z.boolean().optional(),
    announcements: zod_1.z.boolean().optional(),
    certificateAlerts: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=notificationValidator.js.map
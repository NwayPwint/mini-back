"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_SECRET",
    "RESEND_API_KEY",
    "FRONTEND_URL",
];
const validateEnv = () => {
    const missing = requiredEnvVars.filter((key) => !process.env[key] || process.env[key]?.trim() === "");
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=validateEnv.js.map
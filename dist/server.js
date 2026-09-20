"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./config/prisma"));
const validateEnv_1 = require("./config/validateEnv");
(0, validateEnv_1.validateEnv)();
const PORT = process.env.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! Shutting down server...");
    console.log(err.name, err.message);
    server.close(async () => {
        await prisma_1.default.$disconnect();
        process.exit(1);
    });
});
process.on("SIGTERM", async () => {
    console.log("SIGTERM RECEIVED. Shutting down gracefully");
    server.close(async () => {
        console.log("Process terminated!");
        await prisma_1.default.$disconnect();
    });
});
//# sourceMappingURL=server.js.map
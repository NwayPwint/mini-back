"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const appResponse_1 = require("./utils/appResponse");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/student", studentRoutes_1.default);
app.use("/api/notification", notificationRoutes_1.default);
app.get("/", (req, res) => {
    (0, appResponse_1.sendResponse)(res, 200, "Welcome to Mahar Pyinnyar Bank LMS API!");
});
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map
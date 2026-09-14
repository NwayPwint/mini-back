import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { sendResponse } from "./utils/appResponse";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, 200, "Welcome to Mahar Pyinnyar Bank LMS API!");
});

app.use(errorMiddleware);

export default app;

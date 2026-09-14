import "dotenv/config";
import app from "./app";
import prisma from "./config/prisma";
import { validateEnv } from "./config/validateEnv";

validateEnv();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! Shutting down server...");
  console.log(err.name, err.message);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(async () => {
    console.log("Process terminated!");
    await prisma.$disconnect();
  });
});

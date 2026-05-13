import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { activityRouter } from "./routes/activityRoutes";
import { authRouter } from "./routes/authRoutes";
import { categoryRouter } from "./routes/categoryRoutes";
import { dashboardRouter } from "./routes/dashboardRoutes";
import { config } from "./utils/config";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";
import { prisma } from "./utils/prisma";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(config.isProduction ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      service: "distraction-monitoring-backend",
      timestamp: new Date().toISOString()
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/activities", activityRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, config.host, () => {
  console.log(`Backend API listening on http://${config.host}:${config.port}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down backend API.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

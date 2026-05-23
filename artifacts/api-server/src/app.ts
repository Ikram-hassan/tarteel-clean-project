// @ts-nocheck
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index";
import { logger } from "./lib/logger";

const app: Express = express();

// 🔹 Middlewares
app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ method: req.method, url: req.url?.split("?")[0] }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

// 🔹 CORS configuration (تم تحسينه لمنع حظر Preflight)
const corsOptions = {
  origin: "https://tateel-5.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// معالجة صريحة لطلبات OPTIONS لضمان عدم حظرها
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 🔹 Root Route
 */
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Tarteel E-Maqraa API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 🔥 API Routes
 */
app.use("/api", router);

/**
 * 🔥 Global Error Handler
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;